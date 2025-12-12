// NPCの位置とセリフ
window.npcs = window.npcs || [];

// 兵士
window.npcs.push({
  x: 5, y: 4,
  map: "宮殿内部",
  name: "兵士",
  color: "#daa520",
  image: "images/npc1.png",
  imageRight: -250,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#daa520",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下！"},
    { speaker: "player", text: "うむ。今朝もご苦労であるな。"},
    { speaker: "npc", text: "ありがとうございます。"},
    { speaker: "npc", text: "陛下。"},
    { speaker: "player", text: "どうした？"},
    { speaker: "npc", text: "アレキサンドリア様が、「陛下がお目覚めになられたら、私のところに来るよう伝えてください」とのことです。"},
    { speaker: "player", text: "そうなのか？"},
    { speaker: "npc", text: "はい。"},
    { speaker: "player", text: "ふむ。では、あやつは今どこにおる？"},
    { speaker: "npc", text: "宮殿の外で待っていると、仰っていました。"},
    { speaker: "player", text: "分かった。すぐに向かおう。"},
    { speaker: "npc", text: "お気を付けて。"}
  ]
});

// アレキサンドリア
window.npcs.push({
  x: 11, y: 2,
  map: "宮殿外部",
  name: "アレキサンドリア",
  color: "#00bfff",
  image: "images/npc2.png",
  imageRight: -120,
  imageSize: 1000,
  imageBottom: -500,
  nameColor: "#00bfff",
  isActive: true,
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。お待ちしておりました。" },
    { speaker: "player", text: "うむ。" },
    { speaker: "player", text: "宮殿内の兵士から、そなたのもとへと来るよう言われたのだ。" },
    { speaker: "npc", text: "はい。" },
    { speaker: "player", text: "して、こんな朝から余に何の用なのだ？" },
    { speaker: "npc", text: "……まさか、お忘れなのですか？" },
    { speaker: "player", text: "何が？" },
    { speaker: "npc", text: "本当に、お忘れなのですね……。" },
    { speaker: "player", text: "だから、その中身を今聞いておるのではないか！" },
    { speaker: "npc", text: "はぁ……。" },
    { speaker: "npc", text: "……。" },
    { speaker: "npc", text: "今日は神殿に参る日と、以前に仰っていたではありませんか？" },
    { speaker: "player", text: "……何？" },
    { speaker: "npc", text: "ですから、今日は神殿への物資を持って行く日だと、申しているのです。" },
    { speaker: "player", text: "……。" },
    { speaker: "player", text: "…………。" },
    { speaker: "player", text: "そうであった！" },
    { speaker: "npc", text: "やっと思い出されましたか。" },
    { speaker: "player", text: "ああ、こうしてはおれん！　今すぐに向かうぞ！" },
    { speaker: "npc", text: "……本当、陛下は陛下ですね。" },
    { speaker: "npc", text: "貴方様が幼い頃より仕えてきた身分ゆえ、今さらのことではありますが……。" },
    { speaker: "npc", text: "既に神殿への連絡は済ませてありますので、後は御身が向かうだけとなっております。" },
    { speaker: "player", text: "流石、余の臣下であるな！　主君のことを分かっておる！" },
    { speaker: "npc", text: "……急ぎ向かってくださいませ。" },
    { speaker: "player", text: "うむ、余の愛するあやつが待っておるのだ。早く行かねばな！" },
    {
      speaker: "npc",
      text: "はい。私もお供しますので。",
      // --- アレキサンドリアの action (修正後) ---
      action: () => {
        // ★ 修正: party.jsで定義されたスキル付きデータを使用
        window.addPartyMember(window.companionData.alexandria); 
      }
    }
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 9, y: 6,
  map: "神域①",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"},
    { speaker: "player", text: "うむ。〈白の神官女〉は中におるか？"},
    { speaker: "npc", text: "はい。神官女様は中でお待ちです。"},
    { speaker: "player", text: "分かった。すぐに向かおう。"}
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 7, y: 9,
  map: "神殿内部",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"}
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 3, y: 9,
  map: "神殿内部",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"}
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 7, y: 7,
  map: "神殿内部",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"}
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 3, y: 7,
  map: "神殿内部",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"}
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 7, y: 5,
  map: "神殿内部",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"}
  ]
});

// 〈神殿従女〉
window.npcs.push({
  x: 3, y: 5,
  map: "神殿内部",
  name: "〈神殿従女〉",
  color: "#f0f8ff",
  image: "images/npc3.png",
  imageRight: 0,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#f0f8ff",
  dialogue: [
    { speaker: "npc", text: "おはようございます、陛下。"}
  ]
});

// 〈白の神官女〉
window.npcs.push({
  x: 5, y: 3,
  map: "神殿内部",
  name: "〈白の神官女〉",
  color: "#ffffff",

  // --- スチル用設定 ---
  image: "images/still1.png",
  imageRight: 170,
  imageSize: 1400,
  imageBottom: 50,

  // --- 立ち絵用設定（新しく追加） ---
  standingImage: "images/npc4.png",
  standingRight: -20,
  standingSize: 400,
  standingBottom: 20,

  nameColor: "#ffffff",
  dialogue: [
    { speaker: "npc", text: "お待ちしておりました、陛下。"},
    { speaker: "player", 
      text: "うむ。会いたかったぞ、〈白の神官女〉よ。"
    },
    { speaker: "npc", 
      text: "はい。陛下においては、ご健勝のようで？"
    },
    { speaker: "player", 
      text: "うむ。この余なのだから、当然であるぞ？"
    },
    { speaker: "npc", 
      text: "そうですか。",
      action: () => switchToStanding()
    },
    { speaker: "npc",
      text: "まぁ、何せあの『陛下』なのですから、それも当然のことと言えましょう。",
      action: () => switchToStanding() // ←ここでスチル→立ち絵に切り替え
    },
    { speaker: "player",
      text: "うむ。余のことをよく分かっておるではないか。"
    },
    { speaker: "npc",
      text: "……最近になって、御身がどういう人物なのか、分かってきましたので。"
    },
    { speaker: "player",
      text: "ほう？　それは良い傾向であるな。"
    },
    { speaker: "npc",
      text: "？　どうしてです？"
    },
    { speaker: "player",
      text: "決まっておろう？"
    },
    { speaker: "player",
      text: "ついぞこれまで、この国の王ですら気に掛けなかった女が、ようやっとその気になったと言うのだから、これを吉報と言わずして、何と例えようか。"
    },
    { speaker: "npc",
      text: "……今日の本題に入りましょう。"
    },
    { speaker: "player",
      text: "照れたか？"
    },
    { speaker: "npc",
      text: "（そんなはずがない）今日来てくださったのは、支援の件ですよね？"
    },
    { speaker: "player",
      text: "そうだ。王家から毎月、この神殿に送っている物資だな。"
    },
    { speaker: "npc",
      text: "毎度のことながら、陛下のご温情には感謝しております。"
    },
    { speaker: "player",
      text: "そうか。それは良いことであるな。"
    },
    { speaker: "npc",
      text: "はい。本当に。"
    },
    { speaker: "player",
      text: "これでようやく、この余と婚約する気になったか？"
    },
    { speaker: "npc",
      text: "……何度言わせる気ですか。そのようなこと、あり得るはずがないでしょう？",
    },
    { speaker: "player",
      text: "何故だ？",
    },
    { speaker: "npc",
      text: "確かに、陛下の毎度のご贈品にはとても感謝しております。",
    },
    { speaker: "npc",
      text: "しかし、古より交わされた王家と神殿の盟約をお忘れではないはず。",
    },
    { speaker: "player",
      text: "……やはりそれか。",
    },
    { speaker: "player",
      text: "悪いが、その答えはもう聞き飽きたぞ。",
    },
    { speaker: "npc",
      text: "飽きた、飽きないの話ではありません。そういう決まりだから、そう申しているのです。",
    },
    { speaker: "player",
      text: "決まり、か。余の嫌う言葉の一つであるな。"
    },
    { speaker: "npc",
      text: "……御身も一国の玉座に座す君主であるならば、決まりの重要性を理解されていることとは存じますが？",
    },
    { speaker: "player",
      text: "当然だ。決まりとは即ち、人を縛るためにあり、守るために敷くものであるからな。",
    },
    { speaker: "npc",
      text: "ならば……。"
    },
    { speaker: "player",
      text: "だがそれは、あくまで人の話。王たるこの余はその枠外にある存在だと自負している。"
    },
    { speaker: "npc",
      text: "王は、人ではないと？"
    },
    { speaker: "player",
      text: "そうとも。王とは、人の枠に収まらぬからこその器。だからこそ、人界の上に立つことの名を冠することが出来る。"
    },
    { speaker: "player",
      text: "そしてそれは、〈白の神官女〉たるそなたも同義であると思っているぞ。"
    },
    { speaker: "npc",
      text: "……そこまで理解しておられるのなら――。"
    },
    { speaker: "player",
      text: "ああ。それを承知した上で、そなたにこう告げよう。"
    },
    { speaker: "player",
      text: "――『王』たるこの余の『妻』となれ。"
    },
    { speaker: "npc",
      text: "……呆れて物が言えないとは、まさにこのことでしょうね。"
    },
    { speaker: "npc",
      text: "……。"
    },
    { speaker: "npc",
      text: "……一つ、賭けをいたしませんか？"
    },
    { speaker: "player",
      text: "賭けだと？",
    },
    { speaker: "npc",
      text: "――はい。"
    },
    { speaker: "player",
      text: "……解せぬな。俗世とは離れた身にある神殿の者たるそなたが、賭け事とは。"
    },
    { speaker: "player",
      text: "一体何が目的だ？"
    },
    { speaker: "npc",
      text: "……私とて、遊興に耽る時ぐらいはあります。"
    },
    { speaker: "player",
      text: "……そうか。"
    },
    { speaker: "player",
      text: "――ならば良い。申してみよ。その賭けの内容とやらを。"
    },
    { speaker: "npc",
      text: "……では。"
    },
    { speaker: "npc",
      text: "……この神殿がある神域の、さらに奥にある『迷宮』はご存知と思います。"
    },
    { speaker: "player",
      text: "当然だ。この赤の王国内において、それを知らぬものはいないだろう。"
    },
    { speaker: "player",
      text: "最も、そこに入れる者はいないがな。"
    },
    { speaker: "npc",
      text: "はい。『迷宮』への立ち入りは禁じられています。"
    },
    { speaker: "npc",
      text: "陛下もご存知の通り。この国において、それは古より続いてきた習わし、王家と神殿の盟約によるものです。"
    },
    { speaker: "player",
      text: "……そうだな。"
    },
    { speaker: "npc",
      text: "はい。"
    },
    { speaker: "player",
      text: "その『迷宮』が、どうしたと？"
    },
    { speaker: "npc",
      text: "実はそちらで、ある問題が起きていまして。"
    },
    { speaker: "player",
      text: "問題？",
    },
    { speaker: "npc",
      text: "そうです。"
    },
    { speaker: "npc",
      text: "先ほど陛下が申しました通りの、入れる者がいないはずの『迷宮』ですが……。"
    },
    { speaker: "npc",
      text: "最近、その不可侵の禁が破られることがありました。"
    },
    { speaker: "player",
      text: "ほう？"
    },
    { speaker: "player",
      text: "それはまた、興味深い話だな。"
    },
    { speaker: "npc",
      text: "……（興味深いという話ではないのですが）。"
    },
    { speaker: "npc",
      text: "……（しかし陛下のことですから、何かしらの考えには思い至ったはず）。"
    },
    { speaker: "npc",
      text: "……（今はただ、私の思惑に乗っていただかなければ）。"
    },
    { speaker: "player",
      text: "現状はどうなっておる？"
    },
    { speaker: "npc",
      text: "……では、説明を始めます。"
    },
    { speaker: "npc",
      text: "現在、私どもが管理を任されているこの国の神域――その奥にある『迷宮』。"
    },
    { speaker: "npc",
      text: "何者をも侵入を禁じているはずの、その場所ですが。"
    },
    { speaker: "npc",
      text: "先日、そちらである人物を〈神殿従女〉の一人が見つけ、こちらで救護する運びとなる出来事が起きました。"
    },
    { speaker: "player",
      text: "……ふむ？"
    },
    { speaker: "player",
      text: "続けよ。"
    },
    { speaker: "npc",
      text: "はい。私どもの管轄内の出来事なので、救護自体に異論はないのです。"
    },
    { speaker: "npc",
      text: "問題は、その人物の症状でして……。"
    },
    { speaker: "player",
      text: "何やら言いたくなさそうだな？"
    },
    { speaker: "npc",
      text: "……。"
    },
    { speaker: "npc",
      text: "ご推察の通り、今その人物の容態は回復し、こちらで保護しています。"
    },
    { speaker: "npc",
      text: "発見した当初はあまり良くなかったのですが。私たちの力で回復させまして。"
    },
    { speaker: "npc",
      text: "問題は、その……、発見した当時の状況なのです。"
    },
    { speaker: "player",
      text: "……人を払うか？"
    },
    { speaker: "npc",
      text: "いえ、ここにいる従女たちは皆既に把握していますので"
    },
    { speaker: "npc",
      text: "その人物というのが、女性で……。"
    },
    { speaker: "npc",
      text: "……その……。"
    },
    { speaker: "npc",
      text: "……を……孕んでいたのです。",
    },
    { speaker: "player",
      text: "今、なんと言った？"
    },
    { speaker: "npc",
      text: "それが――。"
    },
    { speaker: "npc",
      text: "――怪物の子を、孕んでいました。"
    },
    { speaker: "player",
      text: "――。"
    },
    { speaker: "npc",
      text: "驚かれましたよね。私も、この役目に就いた時はそうでした――。"
    },
    { speaker: "player",
      text: "……まるで、これまで何度も起きてきたような口振りだが？"
    },
    { speaker: "npc",
      text: "はい。今回の事態が起きたのは、これが初ではありません。"
    },
    { speaker: "npc",
      text: "実はこれまで何度も、そのような出来事が起きてきました。"
    },
    { speaker: "npc",
      text: "何故、これまで黙っていた？"
    },
    { speaker: "npc",
      text: "……それは単に、私が報告を怠っていただけで……。"
    },
    { speaker: "player",
      text: "……。"
    },
    { speaker: "player",
      text: "まぁ良い。余が知らなかっただけのことだ。そなたが気にすることではない。"
    },
    { speaker: "player",
      text: "話を戻そう。そなたは一体、この余に何を望む？"
    },
    { speaker: "npc",
      text: "私は――。"
    },
    { speaker: "npc",
      text: "陛下が『迷宮の主』を倒してくださるならば、喜んでこの身を御身に捧げたいと考えました。"
    },
    { speaker: "player",
      text: "……『迷宮の主』か。"
    },
    { speaker: "player",
      text: "つまりは、そのための賭けだと？"
    },
    { speaker: "npc",
      text: "……はい。"
    },
    { speaker: "player",
      text: "――ふむ。"
    },
    { speaker: "player",
      text: "そちらの言い分は理解した。その上で答えよう。"
    },
    { speaker: "player",
      text: "全く持って、そなたは素直ではないな！"
    },
    { speaker: "npc",
      text: "……と、申しますと？"
    },
    { speaker: "player",
      text: "そのような理屈を述べずとも、この余はそなたの望みであれば、何でも聞くと言うのだ。"
    },
    { speaker: "npc",
      text: "――。"
    },
    { speaker: "player",
      text: "まぁ、その『迷宮の主』とやらをこの余が倒したならば、そなたは王の妻になると申したのだから、もう良いがな！"
    },
    { speaker: "player",
      text: "それとも、やはり賭けは撤回するか？"
    },
    { speaker: "npc",
      text: "……いいえ。"
    },
    { speaker: "npc",
      text: "撤回はしません。先ほど申した通り、陛下が見事『迷宮の主』を倒したなら、私は王に侍ります。"
    },
    { speaker: "player",
      text: "――そうか。ならば良い。"
    },
    { speaker: "player",
      text: "では、早速参るとしよう。そなたらはここで王の凱旋を待っておれ。今に怪物の首を持ってこようではないか。"
    },
    { speaker: "npc",
      text: "いえ、私もお共します。"
    },
    { speaker: "player",
      text: "何だと？"
    },
    { speaker: "player",
      text: "それは認めぬぞ。〈白の神官女〉よ。"
    },
    { speaker: "player",
      text: "もしそなたの身に何かあれば、この賭けはどうなる？"
    },
    { speaker: "player",
      text: "それとも、そなたはこの余を弄んでおるのか？"
    },
    { speaker: "npc",
      text: "そのようなつもりはありません。私はただ、待っているだけの身では嫌なのです。"
    },
    { speaker: "player",
      text: "……頑固者め。"
    },
    { speaker: "player",
      text: "余の側から離れぬと誓うなら、同行を許そう。"
    },
    { speaker: "npc",
      text: "承知しました。"
    },
    { speaker: "player",
      text: "本当に分かったのか？"
    },
    { speaker: "npc",
      text: "はい。"
    },
    { speaker: "player",
      text: "……そうか。ならばもう言うまい。ただし、これだけは言っておこう。"
    },
    { speaker: "player",
      text: "そなたが死ぬ時は、この余も死ぬ時だ。王の生命の手綱、そなたが握っていると自覚せよ。"
    },
    { speaker: "npc",
      text: "……はい。"
    },
    { speaker: "player",
      text: "では、これから『迷宮』へと参るが、準備は良いか？"
    },
    { speaker: "npc",
      text: "既に支度は整えてあります。"
    },
    { speaker: "player",
      text: "準備が良くて大いに結構。では、共に参るとしよう。"
    },
    {
      speaker: "npc",
      text: "はい、陛下。",
      // --- 〈白の神官女〉の action (修正後) ---
      action: () => {
        // 仲間に追加
        // ★ 修正: party.jsで定義されたスキル付きデータを使用
        window.addPartyMember(window.companionData.shrineMaiden);
      }
    }
  ]
});

// 兵士
window.npcs.push({
  x: 9, y: 1,
  map: "神域②",
  name: "兵士",
  color: "#daa520",
  image: "images/npc1.png",
  imageRight: -250,
  imageSize: 1000,
  imageBottom: -320,
  nameColor: "#daa520",
  dialogue: [
    { speaker: "npc", text: "陛下、この先は迷宮となっております。"},
    { speaker: "player", text: "うむ。腕が鳴るな。"},
    { speaker: "npc", text: "そうでしょうか？　では、ご武運を！"}
  ]
});

// 商人
window.npcs.push({
  x: 4, y: 3,
  map: "道具屋",
  name: "商人",
  color: "#00ff7f",
  image: "images/npc_shop.png",
  imageRight: -50,
  imageSize: 500,
  imageBottom: -50,
  nameColor: "#00ff7f",
  dialogue: [
    {
      speaker: "npc",
      text: "いらっしゃい！何をお求めですか？",
      choices: [
        { text: "買う", next: "shop_open" },
        { text: "やめる", next: "shop_cancel" }
      ]
    },
    {
      next: "shop_cancel",
      speaker: "npc",
      text: "またのご利用をお待ちしております！"
    }
  ]
});