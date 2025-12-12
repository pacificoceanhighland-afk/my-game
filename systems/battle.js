// --- systems/battle.js (全面リファクタ版)
// - statusEffects 一本化 (重ねがけ可、即時反映、remainingTurns <= 0 で自動解除)
// - スキル: attack/heal/buff/debuff、hits 対応
// - BattleManager による安全な UI 呼び出しと同期処理

window.currentBattleEnemyIndex = -1;
window.currentMap = null;

class BattleManager {
  constructor() {
    this.state = 'idle'; // 'player_action' | 'enemy_turn' | 'end'
    this.currentEnemy = null;   // 戦闘用コピー
    this.partyMembers = [];     // 戦闘用コピー配列 (先頭はプレイヤー)
    this.selectedActorIndex = 0;
  }

  /* ------------------------------
     ヘルパー：戦闘用コピー生成（安全）
     ------------------------------ */
  getPartyMembers() {
    const members = [window.playerStatus].concat(window.party || []);
    return members.map(m => this.createBattleCharacter(m));
  }

  createBattleCharacter(base) {
    // shallow copy + 基本のHP/MP、攻防を補完
    const copy = {
      ...base,
      hp: (base.hp ?? base.currentHp) ?? 100,
      maxHp: base.maxHp ?? base.hp ?? 100,
      mp: (base.mp ?? base.currentMp) ?? 0,
      maxMp: base.maxMp ?? base.mp ?? 0,
      attack: (typeof base.attack === 'number') ? base.attack : (typeof base.totalAttack === 'number' ? base.totalAttack : 5),
      defense: (typeof base.defense === 'number') ? base.defense : (typeof base.totalDefense === 'number' ? base.totalDefense : 0),
      // statusEffects の形:
      // { id, name, type: 'buff'|'debuff', stat, amount, remainingTurns }
      statusEffects: Array.isArray(base.statusEffects) ? base.statusEffects.map(s => ({ ...s })) : []
    };
    // 互換で buffs 配列が使われている可能性があれば移行（安全に）
    if (Array.isArray(base.buffs) && base.buffs.length > 0 && !Array.isArray(copy.statusEffects)) {
      copy.statusEffects = base.buffs.map(b => ({
        id: b.id ?? (`buff_${b.name}_${Date.now()}`),
        name: b.name,
        type: 'buff',
        stat: b.stat ?? 'attack',
        amount: b.amount ?? 0,
        remainingTurns: b.duration ?? b.remainingTurns ?? 0
      }));
    }
    return copy;
  }

  /* ------------------------------
     ステータス効果適用 / 解除の共通ヘルパー
     - applyStatusEffect(target, effect)
     - removeStatusEffect(target, effectIndex) / removeById
     ------------------------------ */

  applyStatusEffect(target, effect) {
    // effect: { id, name, type: 'buff'|'debuff', stat, amount, remainingTurns }
    if (!target || !effect || typeof effect.amount !== 'number') return;

    // 同一 id が既に存在するならスタック（amountを足し、remainingTurns を更新）
    const idx = target.statusEffects.findIndex(e => e.id && effect.id && e.id === effect.id);
    if (idx >= 0) {
      const existing = target.statusEffects[idx];
      existing.amount = (existing.amount ?? 0) + effect.amount;
      existing.remainingTurns = effect.remainingTurns ?? existing.remainingTurns;
      // 即時反映（既に反映済みのケースもあるため慎重に）
      if (existing.type === 'buff') {
        if (typeof target[existing.stat] === 'number') target[existing.stat] += effect.amount;
      } else {
        if (typeof target[existing.stat] === 'number') target[existing.stat] -= effect.amount;
      }
      return;
    }

    // 新規効果なら即時反映して push
    if (effect.type === 'buff') {
      if (typeof target[effect.stat] === 'number') target[effect.stat] += effect.amount;
    } else {
      if (typeof target[effect.stat] === 'number') target[effect.stat] -= effect.amount;
    }

    target.statusEffects.push({
      id: effect.id ?? (`ef_${effect.stat}_${Date.now()}`),
      name: effect.name ?? effect.stat,
      type: effect.type,
      stat: effect.stat,
      amount: effect.amount,
      remainingTurns: effect.remainingTurns ?? 1
    });
  }

  removeStatusEffectByIndex(target, i) {
    if (!target || !Array.isArray(target.statusEffects)) return;
    const eff = target.statusEffects[i];
    if (!eff) return;

    // 解除でステータスを戻す（buffは + を戻す = -、debuffは - を戻す = +）
    if (eff.type === 'buff') {
      if (typeof eff.stat === 'string' && typeof eff.amount === 'number' && typeof target[eff.stat] === 'number') {
        target[eff.stat] = target[eff.stat] - eff.amount;
      }
    } else if (eff.type === 'debuff') {
      if (typeof eff.stat === 'string' && typeof eff.amount === 'number' && typeof target[eff.stat] === 'number') {
        target[eff.stat] = target[eff.stat] + eff.amount;
      }
    }

    // ログ
    battleUI?.log?.(`${target.name} の ${eff.name ?? eff.stat} の効果が切れた！`);
    // 削除
    target.statusEffects.splice(i, 1);
  }

  removeStatusEffectById(target, id) {
    if (!target || !Array.isArray(target.statusEffects)) return;
    for (let i = target.statusEffects.length - 1; i >= 0; i--) {
      if (target.statusEffects[i].id === id) {
        this.removeStatusEffectByIndex(target, i);
      }
    }
  }

  /* ------------------------------
     ラウンド終了処理（全キャラの statusEffects を減少・解除）
     - remainingTurns をデクリメント、<=0 なら即解除
     ------------------------------ */
  updateAllStatusEffects() {
    const all = [];
    if (this.currentEnemy) all.push(this.currentEnemy);
    if (Array.isArray(this.partyMembers)) all.push(...this.partyMembers);

    all.forEach(chara => {
      if (!chara || !Array.isArray(chara.statusEffects)) return;

      for (let i = chara.statusEffects.length - 1; i >= 0; i--) {
        const eff = chara.statusEffects[i];
        eff.remainingTurns = (eff.remainingTurns ?? 0) - 1;

        if (eff.remainingTurns <= 0) {
          // 削除時に元に戻す
          this.removeStatusEffectByIndex(chara, i);
        }
      }
    });

    battleUI?.updateDisplay?.();
  }

  /* ------------------------------
     ヘルパー: 全滅チェック
     ------------------------------ */
  isPartyDefeated() {
    return this.partyMembers.every(m => m.hp <= 0);
  }

  /* ------------------------------
     戦闘開始
     ------------------------------ */
  start(enemyBaseData) {
    this.currentEnemy = this.createBattleCharacter(enemyBaseData);
    this.partyMembers = this.getPartyMembers();

    battleUI?.show?.(this.currentEnemy, this.partyMembers);

    this.selectedActorIndex = 0;
    this.startActorTurn(this.selectedActorIndex);
  }

  /* ------------------------------
     各アクターのターン開始（プレイヤー側）
     ------------------------------ */
  startActorTurn(index) {
    if (index >= this.partyMembers.length) {
      this.startEnemyTurn();
      return;
    }

    const actor = this.partyMembers[index];
    if (!actor || actor.hp <= 0) {
      this.selectedActorIndex++;
      this.startActorTurn(this.selectedActorIndex);
      return;
    }

    this.state = 'player_action';
    this.selectedActorIndex = index;

    battleUI?.log?.(`${actor.name} の行動！ コマンドを選択してください`);
    battleUI?.enableCommands?.(index);
  }

  /* ------------------------------
     コマンド実行 (attack / skill / item / run)
     data は targetType/targetIndex, skillData/itemData を含む
     ------------------------------ */
  executeAction(actorIndex, command, data = {}) {
    if (this.state !== 'player_action' || actorIndex !== this.selectedActorIndex) return;

    const actor = this.partyMembers[actorIndex];
    battleUI?.disableCommands?.();

    let result = { consumedTurn: true };

    if (command === 'attack') {
      this.handleAttack(actor, data);
    } else if (command === 'skill' && data) {
      this.handleSkill(actor, data);
    } else if (command === 'item' && data) {
      result = this.handleItem(actor, data);
    } else if (command === 'run') {
      this.handleFlee();
      return;
    }

    if (result && result.consumedTurn === false) {
      battleUI?.enableCommands?.(this.selectedActorIndex);
      return;
    }

    setTimeout(() => this.checkAndAdvanceTurn(), 1000);
  }

  /* ------------------------------
     ターゲット取得ユーティリティ
     ------------------------------ */
  getTargetInstance(targetType, targetIndex) {
    if (targetType === 'enemy') return this.currentEnemy;
    if (targetType === 'ally') return this.partyMembers[targetIndex] ?? null;
    return null;
  }

  /* ------------------------------
     通常攻撃
     ------------------------------ */
  handleAttack(actor, data = {}) {
    const target = this.getTargetInstance(data.targetType, data.targetIndex);
    if (!target) {
      battleUI?.log?.('ターゲットが見つかりません。');
      return;
    }

    const dmg = this.calculateDamage(actor, target, 1, true);
    target.hp = Math.max(0, target.hp - dmg);

    battleUI?.log?.(`${actor.name} の攻撃！ → ${target.name} に ${dmg} ダメージ！`);
    battleUI?.updateDisplay?.();
  }

  /* ------------------------------
     スキル処理（attack / heal / buff / debuff）
     - skillData: スキルオブジェクト（window.skills 由来）
     - data から targetType/targetIndex が来る想定
     ------------------------------ */
  handleSkill(actor, skillData) {
    const skill = skillData;
    const target = this.getTargetInstance(skillData.targetType, skillData.targetIndex);

    if (!target) {
      battleUI?.log?.('ターゲットが見つかりません。');
      return;
    }

    const requiredMP = skill.mp ?? 0;
    if ((actor.mp ?? 0) < requiredMP) {
      battleUI?.log?.(`${actor.name} は MPが足りない！`);
      return;
    }
    actor.mp -= requiredMP;

    // 攻撃系（多段 hits 対応）
    if (skill.type === 'attack') {
      const hits = Math.max(1, skill.hits ?? 1);
      let totalDmg = 0;
      for (let i = 0; i < hits; i++) {
        const dmg = this.calculateDamage(actor, target, skill.power ?? 1, i === 0 ? skill.random ?? false : true);
        target.hp = Math.max(0, target.hp - dmg);
        totalDmg += dmg;
        // small delay per hit could be added by UI if desired
      }
      battleUI?.log?.(`${actor.name} の ${skill.name}！ → ${target.name} に ${totalDmg} ダメージ！`);
    }
    // 回復
    else if (skill.type === 'heal') {
      const healAmount = skill.amount ?? 20;
      const prev = target.hp;
      target.hp = Math.min(target.maxHp, target.hp + healAmount);
      const actual = target.hp - prev;
      if (actual > 0) {
        battleUI?.log?.(`${actor.name} の ${skill.name}！ → ${target.name} の HPが ${actual} 回復！`);
      } else {
        battleUI?.log?.(`${actor.name} の ${skill.name}！ → ${target.name} の HPは満タンだ。`);
      }
    }
    // バフ / デバフ
    else if (skill.type === 'buff' || skill.type === 'debuff') {
      const stat = skill.stat || 'attack';
      const amount = skill.amount ?? 5;
      const duration = skill.duration ?? 3;
      const id = skill.id ?? (`ef_${stat}_${Date.now()}`);

      // prepare effect object (debuff は type:'debuff')
      const effect = {
        id,
        name: skill.name,
        type: skill.type === 'buff' ? 'buff' : 'debuff',
        stat,
        amount,
        remainingTurns: duration
      };

      // apply via centralized helper (handles stacking & immediate stat change)
      this.applyStatusEffect(target, effect);

      battleUI?.log?.(`${actor.name} の ${skill.name}！ → ${target.name} の ${stat} が ${skill.type === 'buff' ? '+' : '-'}${amount}（${duration}ターン）`);
    }

    battleUI?.updateDisplay?.();
  }

  /* ------------------------------
     アイテム使用（戦闘中）
     - data: { itemData, itemId, targetType, targetIndex }
     ------------------------------ */
  handleItem(actor, data) {
    const { itemData, itemId } = data;
    const target = this.getTargetInstance(data.targetType, data.targetIndex);
    if (!target || data.targetType === 'enemy') {
      battleUI?.log?.(`そのアイテムは ${data.targetType === 'enemy' ? '敵' : '無効なターゲット'}には使えません。`);
      return { consumedTurn: false };
    }

    const inventory = window.inventory ?? [];
    const invIndex = inventory.findIndex(i => i.id === itemId);
    const invItem = invIndex >= 0 ? inventory[invIndex] : null;
    if (!invItem || invItem.quantity <= 0) {
      battleUI?.log?.(`${itemData.name} はもう持っていません。`);
      return { consumedTurn: false };
    }

    if (itemData.type === 'weapon' || itemData.type === 'armor') {
      battleUI?.log?.(`装備品(${itemData.name})は戦闘中は使えません。`);
      return { consumedTurn: false };
    }

    // 消費
    invItem.quantity--;
    battleUI?.log?.(`${actor.name} は ${itemData.name} を ${target.name} に使った！`);

    if (itemData.type === 'heal') {
      const healAmount = itemData.healAmount ?? 20;
      const prev = target.hp;
      target.hp = Math.min(target.maxHp, target.hp + healAmount);
      const actual = target.hp - prev;
      battleUI?.log?.(actual > 0 ? `${target.name} の HPが ${actual} 回復！` : `${target.name} の HPは満タンだ。`);
    } else if (itemData.type === 'mp') {
      const healMp = itemData.healAmount ?? 10;
      target.mp = Math.min(target.maxMp, target.mp + healMp);
      battleUI?.log?.(`${target.name} の MPが回復！`);
    } else if (itemData.type === 'full') {
      target.hp = target.maxHp;
      target.mp = target.maxMp;
      battleUI?.log?.(`${target.name} の HPと MPが全回復！`);
    } else {
      battleUI?.log?.(`効果がないようだ...`);
    }

    if (invItem.quantity <= 0) inventory.splice(invIndex, 1);

    battleUI?.updateDisplay?.();
    window.updateStatusWindow?.();
    window.updateItemWindow?.();

    return { consumedTurn: true };
  }

  /* ------------------------------
     ダメージ計算（簡易）
     ------------------------------ */
  calculateDamage(attacker, defender, skillPower = 1, isRandom = false) {
    let dmg = (attacker.attack ?? 5) * skillPower;
    if (isRandom) dmg *= 0.8 + Math.random() * 0.4;
    const final = Math.floor(dmg) - (defender.defense ?? 0);
    return Math.max(1, final);
  }

  /* ------------------------------
     ターン進行判定（プレイヤー側の行動後に実行）
     ------------------------------ */
  checkAndAdvanceTurn() {
    if (!this.currentEnemy) {
      this.selectedActorIndex++;
      this.startActorTurn(this.selectedActorIndex);
      return;
    }

    if (this.currentEnemy.hp <= 0) {
      this.endBattle('win');
      return;
    }

    this.selectedActorIndex++;
    this.startActorTurn(this.selectedActorIndex);
  }

  /* ------------------------------
     敵ターン
     - 敵行動の後にラウンド終了処理（statusEffects 更新）を呼ぶ
     ------------------------------ */
  startEnemyTurn() {
    this.state = 'enemy_turn';
    battleUI?.log?.(`${this.currentEnemy.name} のターン`);

    const target = this.partyMembers.find(m => m.hp > 0);
    if (!target) {
      this.endBattle('lose');
      return;
    }

    // 単純攻撃（将来的に AI 拡張）
    const dmg = this.calculateDamage(this.currentEnemy, target, 1, true);
    target.hp = Math.max(0, target.hp - dmg);

    battleUI?.log?.(`${this.currentEnemy.name} の攻撃！ → ${target.name} に ${dmg} ダメージ！`);
    battleUI?.updateDisplay?.();

    if (this.isPartyDefeated()) {
      setTimeout(() => this.endBattle('lose'), 1500);
      return;
    }

    // ラウンド終了：statusEffects の残りターンを減らして自動解除、その後新ラウンド開始
    setTimeout(() => {
      this.updateAllStatusEffects();
      this.startNewRound();
    }, 900);
  }

  startNewRound() {
    this.selectedActorIndex = 0;
    this.startActorTurn(this.selectedActorIndex);
  }

  handleFlee() {
    const success = Math.random() > 0.5;
    if (success) {
      battleUI?.log?.('うまく逃げ切れた！');
      setTimeout(() => this.endBattle('run'), 800);
    } else {
      battleUI?.log?.('逃げられない！');
      setTimeout(() => this.startEnemyTurn(), 800);
    }
  }

  /* ------------------------------
     戦闘終了（勝利/敗北/逃走）
     ------------------------------ */
  endBattle(result) {
    this.state = 'end';

    if (result === 'win') {
      battleUI?.log?.('敵を倒した！');

      const expAmount = (this.currentEnemy?.exp !== undefined) ? this.currentEnemy.exp : 10;
      if (window.partySystem?.distributeExp) {
        window.partySystem.distributeExp(expAmount);
      } else if (window.playerStatus?.gainExp) {
        window.playerStatus.gainExp(expAmount);
      }

      const goldAmount = (this.currentEnemy?.gold !== undefined) ? this.currentEnemy.gold : 0;
      if (goldAmount > 0 && window.playerStatus) {
        window.playerStatus.gold = (window.playerStatus.gold ?? 0) + goldAmount;
        battleUI?.log?.(`${goldAmount}G を手に入れた！`);
        window.updateStatusWindow?.();
      }

      if (window.currentMap?.enemies) {
        const idx = window.currentBattleEnemyIndex;
        if (typeof idx === 'number' && idx >= 0 && idx < window.currentMap.enemies.length) {
          window.currentMap.enemies.splice(idx, 1);
        }
      }
    } else if (result === 'lose') {
      battleUI?.log?.('力尽きた……');
      setTimeout(() => window.showGameOver?.(), 2000);
      return;
    } else if (result === 'run') {
      battleUI?.log?.('逃走に成功しました。戦闘を離脱します。');
    }

    setTimeout(() => battleUI?.hide?.(), (result === 'win' || result === 'run') ? 700 : 1200);

    // 戦闘用の HP/MP をフィールド側に反映
    this.syncBackStatus();

    // クリーンアップ
    this.currentEnemy = null;
    window.currentBattleEnemyIndex = -1;
    window.currentMap = null;
  }

  /* ------------------------------
     戦闘終了後に HP/MP を元データへ反映（簡易同期）
     - 先頭がプレイヤーで、以降が window.party の順を想定
     ------------------------------ */
  syncBackStatus() {
    try {
      const playerCopy = this.partyMembers[0];
      if (playerCopy && window.playerStatus) {
        window.playerStatus.hp = Math.max(0, Math.min(playerCopy.hp, playerCopy.maxHp));
        window.playerStatus.mp = Math.max(0, Math.min(playerCopy.mp, playerCopy.maxMp));
      }

      const originals = window.party || [];
      for (let i = 0; i < originals.length; i++) {
        const orig = originals[i];
        const found = this.partyMembers.find(p => p.name === orig.name && p !== playerCopy);
        if (found) {
          orig.hp = Math.max(0, Math.min(found.hp, found.maxHp));
          orig.mp = Math.max(0, Math.min(found.mp, found.maxMp));
        }
      }
    } catch (e) {
      console.error('syncBackStatus error:', e);
    }
  }
}

// インスタンス化 & 旧 API 互換
window.battleManager = new BattleManager();

window.startBattle = function(enemyIndex, map) {
  if (enemyIndex == null || enemyIndex < 0 || !map?.enemies) return;
  window.currentBattleEnemyIndex = enemyIndex;
  window.currentMap = map;
  const enemy = map.enemies[enemyIndex];
  window.battleManager.start(enemy);
};
