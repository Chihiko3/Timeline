// Curated narrative-game lineage. Dates use the earliest verified public release worldwide.
// Straight ports and compilations remain in `later`; materially new works receive their own cards.
const spikeNarrativeSourceMap = {
  "portopia-fc": [
    "https://www.famitsu.com/news/201406/08054671.html",
    "https://www.famitsu.com/news/202111/29242223.html",
    "https://www.4gamer.net/games/074/G007427/20131108107/"
  ],
  otogiriso: [
    "https://www.spike-chunsoft.co.jp/company/outline/",
    "https://www.spike-chunsoft.co.jp/pages/games/imabikiso/whatsoundnovel.html"
  ],
  kamaitachi: [
    "https://www.spike-chunsoft.co.jp/pages/kama30th/",
    "https://www.spike-chunsoft.co.jp/pages/shinkama/about/"
  ],
  machi: [
    "https://www.spike-chunsoft.co.jp/company/about/",
    "https://www.spike-chunsoft.co.jp/pages/428/"
  ],
  kamaitachi2: [
    "https://game.watch.impress.co.jp/docs/20020802/kama2.htm"
  ],
  kinpachi: [
    "https://www.spike-chunsoft.co.jp/pages/games/3b/gameinfo.html",
    "https://game.watch.impress.co.jp/docs/20040624/chun.htm"
  ],
  kamaitachi3: [
    "https://www.spike-chunsoft.co.jp/news/42174/"
  ],
  imabikisou: [
    "https://www.spike-chunsoft.co.jp/pages/games/imabikiso/index.html",
    "https://www.spike-chunsoft.co.jp/pages/games/imabikiso/whatsoundnovel.html"
  ],
  "428": [
    "https://www.spike-chunsoft.co.jp/pages/428/",
    "https://www.spike-chunsoft.co.jp/news/1799/"
  ],
  "999": [
    "https://www.spike-chunsoft.com/games/zero-escape-nonary-games/",
    "https://www.4gamer.net/games/094/G009485/20091208051/"
  ],
  "trick-logic-1": [
    "https://www.4gamer.net/games/105/G010573/20100608061/"
  ],
  "trick-logic-2": [
    "https://www.4gamer.net/games/105/G010573/20100702069/"
  ],
  danganronpa: [
    "https://www.spike-chunsoft.co.jp/company/about/",
    "https://www.danganronpa.com/"
  ],
  "shin-kamaitachi": [
    "https://www.spike-chunsoft.co.jp/pages/shinkama/mb/index.html",
    "https://www.spike-chunsoft.co.jp/pages/shinkama/about/"
  ],
  vlr: [
    "https://www.spike-chunsoft.com/games/zero-escape-nonary-games/"
  ],
  danganronpa2: [
    "https://www.danganronpa.com/",
    "https://www.spike-chunsoft.co.jp/company/outline/",
    "https://www.spike-chunsoft.co.jp/company/about/",
    "https://www.spike-chunsoft.co.jp/news/45095/"
  ],
  "ultra-despair-girls": [
    "https://www.danganronpa.com/"
  ],
  "zero-time-dilemma": [
    "https://www.spike-chunsoft.com/games/zero-time-dilemma/"
  ],
  "danganronpa-v3": [
    "https://www.danganronpa.com/v3/",
    "https://www.danganronpa.com/v3/sp/system/"
  ],
  "ai-somnium": [
    "https://www.spike-chunsoft.com/ai/",
    "https://www.spike-chunsoft.com/news/ai-the-somnium-files-release-date-changed-to-september-17-for-north-america/"
  ],
  "ai-nirvana": [
    "https://www.spike-chunsoft.com/games/ai-the-somnium-files-nirvana-initiative/"
  ],
  "rain-code": [
    "https://www.spike-chunsoft.com/games/master-detective-archives-rain-code/"
  ],
  "no-sleep-kaname": [
    "https://www.spike-chunsoft.com/games/no-sleep-for-kaname-date-from-ai-the-somnium-files/"
  ],
  "shuten-order": [
    "https://www.spike-chunsoft.com/news/multi-genre-adventure-game-shuten-order-from-dmm-games-and-kazutaka-kodaka-of-tookyo-games-launches-worldwide/"
  ]
};

window.SPIKE_SERIES_RELEASES = [
  {
    id: "portopia-fc",
    date: "1985.11.29",
    category: "Adventure",
    tag: "前史 · 指令式推理",
    name: "The Portopia Serial Murder Case (Famicom)",
    chineseName: "港口镇连续杀人事件（FC版）",
    lineage: "前史：堀井雄二 1983 年 PC 原作的 FC 改编版，由 Chunsoft 开发。它积累了主机文字冒险、指令菜单和线索推进经验，但仍是寻找唯一答案的直线型推理；《弟切草》后来反向改造成没有唯一正确路线的分支阅读。",
    first: [{ year: 1985, platform: "Famicom" }],
    later: []
  },
  {
    id: "otogiriso",
    date: "1992.03.07",
    category: "Sound Novel",
    tag: "起点 · 恐怖 Sound Novel",
    name: "Otogirisō",
    chineseName: "弟切草",
    lineage: "直接起点：Chunsoft 首个自社发行作品，以全屏文字、声音与多周目分支建立 Sound Novel 形式。",
    first: [{ year: 1992, platform: "Super Famicom" }],
    later: [
      { year: 1999, platform: "PlayStation（苏生篇）" },
      { year: 2002, platform: "GBA" }
    ]
  },
  {
    id: "kamaitachi",
    date: "1994.11.25",
    category: "Sound Novel",
    tag: "主干 · 本格推理",
    name: "Kamaitachi no Yoru",
    chineseName: "恐怖惊魂夜",
    lineage: "直接继承《弟切草》的全屏阅读与分支复读，将主线改造成可以凭证据求解的封闭空间谋杀案。",
    first: [{ year: 1994, platform: "Super Famicom" }],
    later: [
      { year: 1998, platform: "PlayStation" },
      { year: 2002, platform: "GBA" },
      { year: 2013, platform: "iOS（Smart Sound Novel）" },
      { year: 2017, platform: "PS Vita / Windows（轮回彩声）" }
    ]
  },
  {
    id: "machi",
    date: "1998.01.22",
    category: "Sound Novel",
    tag: "分叉 · 真人群像",
    name: "Machi: Unmei no Kōsaten",
    chineseName: "街：命运的交叉点",
    lineage: "从单一主角分支转向真人实拍、多主角并行时间表与跨路线 Zapping，是《428》的直接设计前身。",
    first: [{ year: 1998, platform: "Sega Saturn" }],
    later: [
      { year: 1999, platform: "PlayStation" },
      { year: 2006, platform: "PSP" }
    ]
  },
  {
    id: "kamaitachi2",
    date: "2002.07.18",
    category: "Sound Novel",
    tag: "续作 · 民俗恐怖",
    name: "Kamaitachi no Yoru 2",
    chineseName: "恐怖惊魂夜 2：监狱岛的童谣",
    lineage: "《恐怖惊魂夜》直接续作；从单一可验证谜案扩张为共享孤岛资产的多作者、多类型路线合集。",
    first: [{ year: 2002, platform: "PS2" }],
    later: []
  },
  {
    id: "kinpachi",
    date: "2004.06.24",
    category: "Drama Adventure",
    tag: "实验 · 电视剧式叙事",
    name: "3-Nen B-Gumi Kinpachi Sensei: Densetsu no Kyōdan ni Tate!",
    chineseName: "3年B组金八先生：站上了传说的讲台！",
    lineage: "Chunsoft 叙事实验分支；并非 Sound Novel 续作，而是把电视连续剧的单元集、学生关系与教师判断做成交互结构。",
    first: [{ year: 2004, platform: "PS2" }],
    later: [{ year: 2005, platform: "PS2（完全版）" }]
  },
  {
    id: "kamaitachi3",
    date: "2006.07.27",
    category: "Sound Novel",
    tag: "终章 · 多视点收束",
    name: "Kamaitachi no Yoru × 3",
    chineseName: "恐怖惊魂夜 × 3：三日月岛事件的真相",
    lineage: "原三部曲终章，以多角色视点和统一时间轴回收前两作人物与谜团。",
    first: [{ year: 2006, platform: "PS2" }],
    later: [
      { year: 2009, platform: "PSP" },
      { year: 2024, platform: "PS4 / NS / Windows" }
    ]
  },
  {
    id: "imabikisou",
    date: "2007.10.25",
    category: "Sound Novel",
    tag: "实验 · HD 恐怖",
    name: "Imabikisō",
    chineseName: "忌火起草",
    lineage: "回到《弟切草》的恐怖主干，以高清真人影像、语音和环绕声测试高规格 Sound Novel。",
    first: [{ year: 2007, platform: "PS3" }],
    later: [{ year: 2008, platform: "Wii（解明篇）" }]
  },
  {
    id: "428",
    date: "2008.12.04",
    category: "Sound Novel",
    tag: "成熟 · 真人群像",
    name: "428: Shibuya Scramble",
    chineseName: "428：被封锁的涩谷",
    lineage: "《街》的直接设计后继：保留真人群像和跨角色因果，将八人缩为五人，并用十分钟刻度、JUMP 与 Bad End 提示提高可读性。",
    first: [{ year: 2008, platform: "Wii" }],
    later: [
      { year: 2009, platform: "PS3 / PSP" },
      { year: 2011, platform: "iOS" },
      { year: 2018, platform: "PS4 / Windows" }
    ]
  },
  {
    id: "999",
    date: "2009.12.10",
    category: "Zero Escape",
    tag: "分叉 · 密室与多周目",
    name: "Nine Hours, Nine Persons, Nine Doors",
    chineseName: "极限脱出：9 小时 9 人 9 扇门",
    lineage: "Chunsoft 的新叙事分支：把 Sound Novel、多周目知识与密室逃脱结合；不是《428》的剧情续作。",
    first: [{ year: 2009, platform: "Nintendo DS" }],
    later: [
      { year: 2013, platform: "iOS" },
      { year: 2017, platform: "PS4 / PS Vita / Windows（The Nonary Games）" },
      { year: 2022, platform: "Xbox One / Xbox Series" }
    ]
  },
  {
    id: "trick-logic-1",
    date: "2010.07.22",
    category: "Mystery Novel",
    tag: "实验 · 逻辑组合",
    name: "TRICK×LOGIC Season 1",
    chineseName: "TRICK×LOGIC 第 1 季",
    lineage: "Chunsoft 受 SCE 委托开发的本格推理分支；用关键词抽取与逻辑组合把“读者推理”变成可判定操作。",
    first: [{ year: 2010, platform: "PSP" }],
    later: []
  },
  {
    id: "trick-logic-2",
    date: "2010.09.16",
    category: "Mystery Novel",
    tag: "续篇 · 逻辑组合",
    name: "TRICK×LOGIC Season 2",
    chineseName: "TRICK×LOGIC 第 2 季",
    lineage: "与第 1 季共同构成十案企划的后半部，延续“从小说中抽取事实，再组合假说”的推理规则。",
    first: [{ year: 2010, platform: "PSP" }],
    later: []
  },
  {
    id: "danganronpa",
    date: "2010.11.25",
    category: "Danganronpa",
    tag: "Spike 分支 · 高速推理",
    name: "Danganronpa: Trigger Happy Havoc",
    chineseName: "弹丸论破：希望学园与绝望高中生",
    lineage: "旧 Spike 独立形成的并行分支，并非《弟切草》团队的直接继承；它把调查证据转成言弹，在学级裁判中做成实时反驳。",
    first: [{ year: 2010, platform: "PSP" }],
    later: [
      { year: 2013, platform: "PS Vita" },
      { year: 2016, platform: "Windows" },
      { year: 2020, platform: "iOS / Android" },
      { year: 2021, platform: "NS / Xbox One" }
    ]
  },
  {
    id: "shin-kamaitachi",
    date: "2011.12.17",
    category: "Sound Novel",
    tag: "重启 · 联机推理",
    name: "Shin Kamaitachi no Yoru: 11 Hitome no Suspect",
    chineseName: "真恐怖惊魂夜：第 11 位访客",
    lineage: "以全新人物与案件重启《恐怖惊魂夜》，并用联机问答测试多人共同推理，但未延续为新主线。",
    first: [{ year: 2011, platform: "PS3 / PS Vita" }],
    later: []
  },
  {
    id: "vlr",
    date: "2012.02.16",
    category: "Zero Escape",
    tag: "续作 · 流程图博弈",
    name: "Zero Escape: Virtue's Last Reward",
    chineseName: "极限脱出 ADV：善人死亡",
    lineage: "《999》直接续作；把隐藏分支显式化为可跳转流程图，并用合作／背叛博弈控制角色关系与路线锁。",
    first: [{ year: 2012, platform: "Nintendo 3DS / PS Vita" }],
    later: [
      { year: 2017, platform: "PS4 / PS Vita / Windows（The Nonary Games）" },
      { year: 2022, platform: "Xbox One / Xbox Series" }
    ]
  },
  {
    id: "danganronpa2",
    date: "2012.07.26",
    category: "Danganronpa",
    tag: "续作 · 群像推理",
    name: "Danganronpa 2: Goodbye Despair",
    chineseName: "超级弹丸论破 2：再见绝望学园",
    lineage: "初代直接续作；扩大场景、案件机关与裁判动作，并用虚拟世界前提重写玩家对角色身份和系列规则的理解。",
    first: [{ year: 2012, platform: "PSP" }],
    later: [
      { year: 2013, platform: "PS Vita" },
      { year: 2016, platform: "Windows" },
      { year: 2020, platform: "iOS / Android" },
      { year: 2021, platform: "NS / Xbox One" }
    ]
  },
  {
    id: "ultra-despair-girls",
    date: "2014.09.25",
    category: "Danganronpa",
    tag: "外传 · 动作叙事",
    name: "Danganronpa Another Episode: Ultra Despair Girls",
    chineseName: "绝对绝望少女：弹丸论破 Another Episode",
    lineage: "连接《弹丸论破》一、二代的正史外传；以第三人称射击和城市逃亡替代学级裁判。",
    first: [{ year: 2014, platform: "PS Vita" }],
    later: [{ year: 2017, platform: "PS4 / Windows" }]
  },
  {
    id: "zero-time-dilemma",
    date: "2016.06.28",
    category: "Zero Escape",
    tag: "终章 · 碎片时间",
    name: "Zero Escape: Zero Time Dilemma",
    chineseName: "极限脱出：零时困境",
    lineage: "《极限脱出》三部曲终章；将流程图节点拆成失忆片段，让玩家先体验局部，再重建真实时间顺序。",
    first: [{ year: 2016, platform: "Nintendo 3DS / PS Vita" }],
    later: [
      { year: 2016, platform: "Windows" },
      { year: 2017, platform: "PS4" },
      { year: 2022, platform: "Xbox One / Xbox Series" }
    ]
  },
  {
    id: "danganronpa-v3",
    date: "2017.01.12",
    category: "Danganronpa",
    tag: "再构 · 谎言推理",
    name: "Danganronpa V3: Killing Harmony",
    chineseName: "新弹丸论破 V3：大家的自相残杀新学期",
    lineage: "以新舞台重构弹丸论破公式；通过谎言言弹和终章元叙事审视系列自身的重复生产与观众需求。",
    first: [{ year: 2017, platform: "PS4 / PS Vita" }],
    later: [
      { year: 2017, platform: "Windows" },
      { year: 2021, platform: "NS" },
      { year: 2022, platform: "Xbox One / Xbox Series" }
    ]
  },
  {
    id: "ai-somnium",
    date: "2019.09.17",
    category: "AI",
    tag: "打越分支 · 梦境调查",
    name: "AI: The Somnium Files",
    chineseName: "AI：梦境档案",
    lineage: "打越钢太郎在《极限脱出》后的新分支；保留流程图与跨路线信息，把密室替换为限时梦境探索。",
    first: [{ year: 2019, platform: "PS4 / NS / Windows" }],
    later: [{ year: 2021, platform: "Xbox One / Xbox Series" }]
  },
  {
    id: "ai-nirvana",
    date: "2022.06.23",
    category: "AI",
    tag: "续作 · 双时间诡计",
    name: "AI: The Somnium Files – nirvanA Initiative",
    chineseName: "AI：梦境档案 涅槃肇始",
    lineage: "《AI：梦境档案》直接续作；扩展双主角与梦境规模，并把玩家误读章节时间变成核心叙事机关。",
    first: [{ year: 2022, platform: "PS4 / NS" }],
    later: [{ year: 2022, platform: "Xbox One / Windows" }]
  },
  {
    id: "rain-code",
    date: "2023.06.30",
    category: "Master Detective",
    tag: "小高分支 · 3D 推理",
    name: "Master Detective Archives: RAIN CODE",
    chineseName: "超侦探事件簿 雾雨谜宫",
    lineage: "《弹丸论破》核心创作者的新品牌，并非同一世界观；把公开学级裁判改成城市调查、超侦探能力和 3D 谜迷宫。",
    first: [{ year: 2023, platform: "NS" }],
    later: [{ year: 2024, platform: "PS5 / Xbox Series / Windows（Plus）" }]
  },
  {
    id: "no-sleep-kaname",
    date: "2025.07.25",
    category: "AI",
    tag: "外传 · 调查与密室",
    name: "No Sleep For Kaname Date – From AI: The Somnium Files",
    chineseName: "伊达键不眠：From AI：梦境档案",
    lineage: "《AI：梦境档案》角色外传；缩小案件规模，并重新接入《极限脱出》式实体密室谜题。",
    first: [{ year: 2025, platform: "NS / NS2 / Windows" }],
    later: [{ year: 2026, platform: "PS4 / PS5 / Xbox Series" }]
  },
  {
    id: "shuten-order",
    date: "2025.09.05",
    category: "Creator Branch",
    tag: "小高分支 · 多类型 ADV",
    name: "SHUTEN ORDER",
    chineseName: "终天教团",
    lineage: "小高和刚与 Too Kyo Games 的创作者后继，由 Spike Chunsoft 参与发行；不是《弹丸论破》同世界作品，而是将五条嫌疑路线分别做成五种游戏类型。",
    first: [{ year: 2025, platform: "NS / Windows" }],
    later: [{ year: 2026, platform: "NS2" }]
  }
].map((release) => ({
  ...release,
  sources: spikeNarrativeSourceMap[release.id] || [
    "https://www.spike-chunsoft.co.jp/company/about/",
    "https://www.spike-chunsoft.com/games/"
  ]
}));
