// `date` is the earliest verified public release date in any region.
// Ports stay in `later`; substantial editions and story expansions receive their own timeline cards.
window.XENOBLADE_RELEASES = [
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
