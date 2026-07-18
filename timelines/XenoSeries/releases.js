// `date` is the earliest verified public release date in any region.
// Ports stay in `later`; substantial editions and story expansions receive their own timeline cards.
window.XENOBLADE_RELEASES = [
  {
    id: "xenogears",
    date: "1998.02.11",
    category: "Xenogears",
    tag: "Xenogears · RPG",
    name: "Xenogears",
    chineseName: "异度装甲",
    lineage: "创作谱系起点 · 与后续 Xeno 作品并非同一世界观",
    first: [{ year: 1998, platform: "PlayStation" }],
    later: [{ year: 2008, platform: "PS3 / PSP（Game Archives）" }],
    sources: ["https://www.jp.square-enix.com/game/detail/xenogears/"]
  },
  {
    id: "xenosaga-ep1",
    date: "2002.02.28",
    category: "Xenosaga",
    tag: "Xenosaga · RPG",
    name: "Xenosaga Episode I: Der Wille zur Macht",
    chineseName: "异度传说 Episode I：权力意志",
    lineage: "精神续作：承接 Xenogears 的创作母题，但重建世界与版权体系",
    first: [{ year: 2002, platform: "PS2" }],
    later: [],
    sources: ["https://www.bandainamcoent.co.jp/corporate/press/namco/2002/jan/press03.html"]
  },
  {
    id: "xenosaga-freaks",
    date: "2004.04.28",
    category: "Xenosaga",
    tag: "Xenosaga · 资料短篇",
    name: "Xenosaga Freaks",
    chineseName: "异度传说 Freaks",
    lineage: "Episode I 补充作品 · 含原创角色短篇、资料库与小游戏",
    first: [{ year: 2004, platform: "PS2" }],
    later: [],
    sources: ["https://www.bandainamcoent.co.jp/cs/list/xenofreaks/"]
  },
  {
    id: "xenosaga-ep2",
    date: "2004.06.24",
    category: "Xenosaga",
    tag: "Xenosaga · RPG",
    name: "Xenosaga Episode II: Jenseits von Gut und Böse",
    chineseName: "异度传说 Episode II：善恶的彼岸",
    lineage: "Episode I 直接续篇 · 聚焦 Jr.、MOMO 与米尔奇亚事件",
    first: [{ year: 2004, platform: "PS2" }],
    later: [],
    sources: ["https://www.bandainamcoent.co.jp/corporate/press/namco/50/50-014.pdf"]
  },
  {
    id: "xenosaga-pied-piper",
    date: "2004.07.14",
    category: "Xenosaga",
    tag: "Xenosaga · 前传 RPG",
    name: "Xenosaga: Pied Piper",
    chineseName: "异度传说：吹笛者",
    lineage: "Episode I 百年前的正史前传 · 补完 Ziggy 与 Voyager",
    first: [{ year: 2004, platform: "Vodafone live!" }],
    later: [{ year: 2026, platform: "NS / Steam（G-MODE Archives+）" }],
    sources: [
      "https://www.mobygames.com/game/82123/xenosaga-pied-piper/releases/",
      "https://info.gmodecorp.com/gmodearchives/bandainamco/xenosagapiedpiper/"
    ]
  },
  {
    id: "xenosaga-i-ii",
    date: "2006.03.30",
    category: "Xenosaga",
    tag: "Xenosaga · 重构 RPG",
    name: "Xenosaga I & II",
    chineseName: "异度传说 I & II",
    lineage: "重构：Episode I / II · 重新编排剧本、流程与战斗",
    first: [{ year: 2006, platform: "Nintendo DS" }],
    later: [],
    sources: ["https://www.bandainamcoent.co.jp/corporate/press/namco/51/51-072.pdf"]
  },
  {
    id: "xenosaga-ep3",
    date: "2006.07.06",
    category: "Xenosaga",
    tag: "Xenosaga · RPG",
    name: "Xenosaga Episode III: Also sprach Zarathustra",
    chineseName: "异度传说 Episode III：查拉图斯特拉如是说",
    lineage: "Xenosaga 三部曲终章 · 收束 Shion、KOS-MOS 与宇宙重启危机",
    first: [{ year: 2006, platform: "PS2" }],
    later: [],
    sources: ["https://www.bandainamcoent.co.jp/corporate/press/namco/51/51-072.pdf"]
  },
  {
    id: "xc1",
    date: "2010.06.10",
    category: "正传",
    tag: "正传 1 · JRPG",
    name: "Xenoblade Chronicles",
    chineseName: "异度神剑",
    first: [{ year: 2010, platform: "Wii" }],
    later: [{ year: 2015, platform: "New Nintendo 3DS（Xenoblade Chronicles 3D）" }],
    sources: ["https://www.nintendo.co.jp/ir/pdf/2011/110128e.pdf"]
  },
  {
    id: "xcx",
    date: "2015.04.29",
    category: "X 分支",
    tag: "X 分支 · 开放世界 RPG",
    name: "Xenoblade Chronicles X",
    chineseName: "异度神剑 X",
    first: [{ year: 2015, platform: "Wii U" }],
    later: [],
    sources: ["https://www.nintendo.co.jp/ir/pdf/2015/150507_4e.pdf"]
  },
  {
    id: "xc2",
    date: "2017.12.01",
    category: "正传",
    tag: "正传 2 · JRPG",
    name: "Xenoblade Chronicles 2",
    chineseName: "异度神剑 2",
    first: [{ year: 2017, platform: "Nintendo Switch" }],
    later: [],
    sources: ["https://www.nintendo.com/en-gb/News/2017/November/Nintendo-spotlights-Xenoblade-Chronicles-2-before-its-launch-on-1st-December-1301901.html"]
  },
  {
    id: "torna",
    date: "2018.09.14",
    category: "正传 2",
    tag: "正传 2 前传 · 独立扩展",
    name: "Xenoblade Chronicles 2: Torna - The Golden Country",
    chineseName: "异度神剑 2：黄金之国伊拉",
    lineage: "前传：Xenoblade Chronicles 2 · 9月21日另发独立实体版",
    first: [{ year: 2018, platform: "Nintendo Switch（Expansion Pass）" }],
    later: [],
    sources: ["https://www.nintendo.com/en-gb/DLC/Xenoblade-Chronicles-2-Torna-The-Golden-Country-1564213.html"]
  },
  {
    id: "xcde",
    date: "2020.05.29",
    category: "正传",
    tag: "正传 1 · Definitive Edition",
    name: "Xenoblade Chronicles: Definitive Edition",
    chineseName: "异度神剑：终极版",
    lineage: "重制：Xenoblade Chronicles（2010）· 内含后日谈 Future Connected",
    first: [{ year: 2020, platform: "Nintendo Switch" }],
    later: [{ year: 2026, platform: "Nintendo Switch 2（Switch 2 Edition）" }],
    sources: [
      "https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Xenoblade-Chronicles-Definitive-Edition-1633054.html",
      "https://www.nintendo.com/sg/news/article/383ACrTcQizYZdC07E6YJ"
    ]
  },
  {
    id: "xc3",
    date: "2022.07.29",
    category: "正传",
    tag: "正传 3 · JRPG",
    name: "Xenoblade Chronicles 3",
    chineseName: "异度神剑 3",
    first: [{ year: 2022, platform: "Nintendo Switch" }],
    later: [],
    sources: ["https://www.nintendo.com/us/whatsnew/xenoblade-chronicles-3-gets-a-new-trailer-and-release-date/"]
  },
  {
    id: "future-redeemed",
    date: "2023.04.25",
    category: "正传 3",
    tag: "正传 3 前传 · 剧情扩展",
    name: "Xenoblade Chronicles 3: Future Redeemed",
    chineseName: "异度神剑 3：崭新的未来",
    lineage: "前传：Xenoblade Chronicles 3 · 编号三部曲终章",
    first: [{ year: 2023, platform: "Nintendo Switch（Expansion Pass）" }],
    later: [],
    sources: ["https://www.nintendo.com/pt-br/store/products/dlc-wave-4-70050000035315-switch/"]
  },
  {
    id: "xcxde",
    date: "2025.03.20",
    category: "X 分支",
    tag: "X 分支 · Definitive Edition",
    name: "Xenoblade Chronicles X: Definitive Edition",
    chineseName: "异度神剑 X：终极版",
    lineage: "重制：Xenoblade Chronicles X（2015）· 新增结局篇章",
    first: [{ year: 2025, platform: "Nintendo Switch" }],
    later: [{ year: 2026, platform: "Nintendo Switch 2（Switch 2 Edition）" }],
    sources: [
      "https://www.nintendo.com/us/whatsnew/xenoblade-chronicles-x-definitive-edition-brings-an-expansive-sci-fi-adventure-to-nintendo-switch-on-march-20/",
      "https://www.nintendo.com/us/whatsnew/xenoblade-chronicles-x-definitive-edition-nintendo-switch-2-edition-brings-enhanced-visuals-to-its-massive-world-available-today/"
    ]
  }
];
