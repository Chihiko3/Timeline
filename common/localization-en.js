(() => {
  const translations = window.ENGLISH_TRANSLATIONS || {};
  const reviewedTranslations = window.ENGLISH_REVIEWED_TRANSLATIONS || {};
  const excludedGlobals = /(?:IMAGE_SOURCES|TIMELINE_IMAGES|DECISION_CHAINS|DECISION_CHAIN_REVIEW)$/;
  const ui = {
    "游戏资料库": "Game Archive",
    "本地使用的游戏资料库。": "A chronological archive of video game hardware and long-running game series.",
    "时间线": "Timeline",
    "显示图片区域": "Show artwork bounds",
    "资料库页面": "Archive sections",
    "游戏主机": "Video Game Hardware",
    "游戏系列": "Game Series",
    "游戏主机时间线": "Video Game Hardware Timeline",
    "主机年份时间线": "Hardware timeline",
    "游戏系列资料库页面": "Game-series archive pages",
    "总览": "Overview",
    "游戏系列总览时间线": "Combined game-series timeline",
    "Pokemon核心系列时间线": "Pokemon series timeline",
    "Final Fantasy 游戏时间线": "Final Fantasy timeline",
    "Dragon Quest 游戏时间线": "Dragon Quest timeline",
    "Xeno Series 创作谱系时间线": "Xeno Series creative-lineage timeline",
    "Like a Dragon 游戏时间线": "Like a Dragon timeline",
    "Spike 与 Chunsoft 叙事游戏设计谱系时间线": "Spike and Chunsoft narrative-game design timeline",
    "时间线图片管理": "Timeline media manager",
    "当前厂商开关下没有可显示的主机。": "No hardware matches the current manufacturer selection.",
    "硬件时间线": "Hardware timeline",
    "厂商显示": "Manufacturers",
    "全选": "Select all",
    "全不选": "Clear all",
    "家用机": "Home console",
    "掌机": "Handheld",
    "混合 / PC 掌机": "Hybrid / handheld PC",
    "产品线": "Product line",
    "暂未整理型号。": "No models documented yet.",
    "待补": "To be confirmed",
    "年份待补": "Year to be confirmed",
    "硬件型号": "Hardware model",
    "护航 / 首发": "Launch titles",
    "特色 / 高讨论": "Signature / highly discussed",
    "暂未整理。": "Not documented yet.",
    "正在匹配图片": "Matching artwork",
    "未匹配到图片": "No artwork matched",
    "没有找到匹配的主机或游戏。": "No matching hardware or games found.",
    "护航 / 早期主推": "Launch / early promotion",
    "剧情概要": "Plot summary",
    "叙事创新": "Narrative innovation",
    "版本结构": "Release structure",
    "核心体验": "Core experience",
    "本作变化": "Changes",
    "机制逻辑": "Mechanism logic",
    "系列影响": "Series impact",
    "行业影响": "Industry impact",
    "研究线索": "Research prompts",
    "设计问题": "Design problem",
    "设计假设": "Design hypothesis",
    "本作实验": "Experiment",
    "结果与代价": "Result and cost",
    "后续选择": "Follow-up choice",
    "判断依据": "Evidence",
    "判断结果": "Assessment",
    "缺少依据": "Missing evidence",
    "暂无后续独立版本": "No later standalone version recorded",
    "首次登陆": "First release",
    "后续登陆": "Later releases",
    "时间线图片": "Timeline Media",
    "搜索卡片": "Search cards",
    "打开仓库图片目录": "Open repository media folder",
    "在资源管理器中打开 assets 文件夹": "Open the assets folder in File Explorer",
    "无法打开本地图片目录。请确认正在使用本地 GM 服务。": "The local media folder could not be opened. Confirm that the local GM service is running.",
    "没有匹配的卡片": "No matching cards",
    "前移": "Move earlier",
    "后移": "Move later",
    "暂无图片": "No artwork",
    "添加": "Add",
    "删除图片": "Delete image",
    "确认删除这张图片吗？": "Delete this image permanently?",
    "国内里程碑": "Domestic milestone",
    "全球化里程碑": "Global milestone",
    "组织整合节点": "Organization-integration milestone",
    "当前版本尚未整理该作品的剧情概要。": "This release does not yet have a plot summary.",
    "同人作品": "Fan work",
    "未知制作者": "Unknown creator",
    "选择总览中显示的游戏系列": "Choose game series to show in the overview",
    "显示时间线": "Show timelines",
    "请选择要显示的游戏系列。": "Select one or more game series to display.",
    "御三家": "Starter trio",
    "非官方作品，初始伙伴资料不适用。": "Starter information does not apply to this unofficial work.",
    "正传": "Mainline",
    "外传": "Spin-off",
    "重制": "Remake",
    "正传续作": "Mainline Sequel",
    "战略版": "Tactics",
    "陆行鸟": "Chocobo",
    "水晶编年史": "Crystal Chronicles",
    "伊瓦利斯": "Ivalice",
    "零式": "Type-0",
    "移动端": "Mobile",
    "跨作品": "Crossover",
    "动作 RPG": "Action RPG",
    "战略 RPG": "Tactical RPG",
    "回合制 RPG": "Turn-based RPG",
    "战棋": "Tactical RPG",
    "迷宫探索": "Dungeon crawler",
    "赛车": "Racing",
    "卡牌": "Card game",
    "动作冒险": "Action Adventure",
    "城市建设": "City builder",
    "塔防": "Tower defense",
    "竞速": "Racing",
    "第三人称射击": "Third-person shooter",
    "大逃杀": "Battle royale",
    "对战动作": "Fighting action",
    "团队对战": "Team battle",
    "团队竞速": "Team racing",
    "音乐节奏": "Rhythm",
    "档案 RPG": "Archive RPG",
    "育成 RPG": "Monster-raising RPG"
  };
  const terminology = {
    "正传": "Mainline",
    "外传": "Spin-off",
    "正传续作": "Mainline Sequel",
    "重制": "Remake",
    "强化版": "Enhanced Edition",
    "加强": "Enhanced Edition",
    "重构": "Reimagining",
    "重构重制": "Rebuilt Remake",
    "HD-2D 重制": "HD-2D Remake",
    "重制＋新篇": "Remake + New Story",
    "重启": "Reboot",
    "续作": "Sequel",
    "续篇": "Sequel",
    "前传": "Prequel",
    "终章": "Finale",
    "起点": "Origin",
    "前史": "Precursor",
    "主干": "Core Line",
    "分叉": "Branch",
    "实验": "Experiment",
    "成熟": "Mature Form",
    "再构": "Reworking",
    "服务型": "Live Service",
    "时代剧": "Historical Drama",
    "时代剧重制": "Historical Remake",
    "黑豹": "Kurohyo",
    "审判": "Judgment",
    "外传 RPG": "Spin-off RPG",
    "外传动作": "Action Spin-off",
    "VII 衍生": "FFVII Compilation",
    "VII 重制": "FFVII Remake Project",
    "不思议迷宫": "Mystery Dungeon",
    "创世小玩家": "Builders",
    "达伊大冒险": "The Adventure of Dai",
    "怪兽篇": "Monsters",
    "怪兽战斗之路": "Monster Battle Road",
    "史莱姆": "Slime",
    "体感": "Motion-Controlled",
    "英雄集结": "Heroes",
    "X 分支": "Xenoblade X",
    "合集重制": "Collection Remake",
    "强化育成 RPG": "Enhanced Monster-raising RPG",
    "移动端育成 RPG": "Mobile Monster-raising RPG",
    "育成 RPG": "Monster-raising RPG",
    "重制育成 RPG": "Remade Monster-raising RPG",
    "建造 RPG": "Building RPG",
    "卡牌对战": "Card Battler",
    "卡牌街机": "Arcade Card Battler",
    "怪兽编队 RPG": "Monster Team RPG",
    "乱斗 RPG": "Battle Royale RPG",
    "数字卡牌": "Digital Card Game",
    "卡牌 RPG": "Card-based RPG",
    "体感 RPG": "Motion-Control RPG",
    "体感动作 RPG": "Motion-Control Action RPG",
    "位置 RPG": "Location-based RPG",
    "消除": "Puzzle",
    "寻宝动作 RPG": "Treasure-hunting Action RPG",
    "移动端 RPG": "Mobile RPG",
    "动作 RPG": "Action RPG",
    "动作冒险": "Action Adventure",
    "射击动作": "Shooter",
    "推理动作": "Detective Action",
    "回合制 RPG": "Turn-based RPG",
    "战略 RPG": "Tactical RPG",
    "战棋": "Tactical RPG",
    "迷宫探索": "Dungeon Crawler",
    "音乐节奏": "Rhythm Game",
    "独立扩展": "Standalone Expansion",
    "剧情扩展": "Story Expansion",
    "资料短篇": "Companion Vignettes",
    "重构 RPG": "Reworked RPG",
    "前传 RPG": "Prequel RPG",
    "真人群像": "Live-action Ensemble",
    "恐怖 Sound Novel": "Horror Sound Novel",
    "指令式推理": "Command-driven Mystery",
    "电视剧式叙事": "TV-drama Structure",
    "逻辑组合": "Logic Assembly",
    "HD 恐怖": "HD Horror",
    "密室与多周目": "Escape Rooms and Multiple Playthroughs",
    "梦境调查": "Dream Investigation",
    "多视点收束": "Multi-perspective Convergence",
    "碎片时间": "Fragmented Timeline",
    "本格推理": "Honkaku Mystery",
    "高速推理": "High-speed Deduction",
    "3D 推理": "3D Deduction",
    "多类型 ADV": "Multi-genre Adventure",
    "流程图博弈": "Flowchart Strategy",
    "民俗恐怖": "Folk Horror",
    "群像推理": "Ensemble Mystery",
    "双时间诡计": "Dual-timeline Mystery",
    "谎言推理": "Lie-based Deduction",
    "联机推理": "Online Deduction",
    "调查与密室": "Investigation and Escape Rooms",
    "动作叙事": "Action-driven Narrative",
    "小高分支": "Kodaka Branch",
    "打越分支": "Uchikoshi Branch",
    "Spike 分支": "Spike Branch",
    "同人 ROM 改版": "Fan-made ROM Hack",
    "同人游戏": "Fan Game",
    "日本国民级现象": "National Phenomenon in Japan",
    "海外品牌重新建立": "International Brand Revival",
    "全球多平台规模化": "Global Multi-platform Expansion",
    "日本国内系列确立": "Series Established in Japan",
    "全球大众化突破": "Global Mainstream Breakthrough",
    "全球长期运营再突破": "Global Live-service Breakthrough",
    "Square／Enix 合并后首作": "First Release after the Square-Enix Merger",
    "日本国内系列成立": "Series Established in Japan",
    "全球口碑突破": "Global Critical Breakthrough",
    "全球品牌与玩法再启动": "Global Brand and Gameplay Reintroduction",
    "SEGA／Sammy 整合后首作": "First Release after Sega-Sammy Integration",
    "日本国内现象化": "National Phenomenon in Japan",
    "全球大众文化突破": "Global Pop-culture Breakthrough",
    "Sound Novel 起点": "Origin of the Sound Novel Line",
    "全球原创品牌突破": "Global Breakthrough for an Original IP",
    "合并后首作": "First Release after the Merger",
    "国际口碑突破": "International Critical Breakthrough",
    "加入任天堂后首作": "First Release under Nintendo Ownership",
    "全球商业扩张": "Global Commercial Breakthrough",
    "日本国内创作谱系确立": "Creative Lineage Established in Japan",
    "游戏业务整合后首作": "First Release after Games-business Integration",
    "正传 1 · Definitive Edition": "Xenoblade 1 · Definitive Edition",
    "正传 1 · JRPG": "Xenoblade 1 · JRPG",
    "正传 2 · JRPG": "Xenoblade 2 · JRPG",
    "正传 2 前传 · 独立扩展": "Xenoblade 2 · Standalone Expansion",
    "正传 3 · JRPG": "Xenoblade 3 · JRPG",
    "正传 3 前传 · 剧情扩展": "Xenoblade 3 · Story Expansion",
    "X 分支 · 开放世界 RPG": "Xenoblade X · Open-world RPG",
    "X 分支 · Definitive Edition": "Xenoblade X · Definitive Edition",
    "蜘蛛侠：迈尔斯 · 莫拉雷斯": "Marvel's Spider-Man: Miles Morales",
    "托尼 · 霍克职业滑板": "Tony Hawk's Pro Skater",
    "托尼 · 霍克职业滑板2": "Tony Hawk's Pro Skater 2",
    "强化版：红绿蓝 · 动画联动": "Enhanced Edition of Red / Green / Blue · Anime Tie-in",
    "强化版：红蓝宝石 · 需交换": "Enhanced Edition of Ruby / Sapphire · Trading Required",
    "重制自 Final Fantasy III（1990） · 3D 化与角色重构": "Remake of Final Fantasy III (1990) · 3D Presentation and Reworked Characters",
    "重制自 Final Fantasy IV（1991） · 3D 化与剧情扩充": "Remake of Final Fantasy IV (1991) · 3D Presentation and Expanded Story",
    "重构自 Final Fantasy XIV（2010） · 剧情与系统全面重启": "Rebuilt from Final Fantasy XIV (2010) · Story and Systems Relaunched",
    "重制自 Final Fantasy VII（1997） · 剧情重构": "Remake of Final Fantasy VII (1997) · Reimagined Story",
    "FFVII Remake 项目第二部 · 剧情延续": "Second Entry in the FFVII Remake Project · Continuing Story",
    "勇者斗恶龙怪兽篇 1 · 2": "Dragon Quest Monsters 1 + 2",
    "创作谱系起点 · 与后续 Xeno 作品并非同一世界观": "Creative-lineage Starting Point · Separate Continuity from Later Xeno Works",
    "Episode I 补充作品 · 含原创角色短篇、资料库与小游戏": "Episode I Companion Release · Original Character Vignettes, Database, and Minigames",
    "Episode I 直接续篇 · 聚焦 Jr.、MOMO 与米尔奇亚事件": "Direct Sequel to Episode I · Focused on Jr., MOMO, and the Miltian Conflict",
    "Episode I 百年前的正史前传 · 补完 Ziggy 与 Voyager": "Canonical Prequel Set 100 Years before Episode I · Expands Ziggy and Voyager's Backstory",
    "重构：Episode I / II · 重新编排剧本、流程与战斗": "Reworking of Episodes I and II · Reorganized Scenario, Progression, and Combat",
    "Xenosaga 三部曲终章 · 收束 Shion、KOS-MOS 与宇宙重启危机": "Finale of the Xenosaga Trilogy · Resolves Shion and KOS-MOS's Story amid a Universe-scale Crisis",
    "前传：Xenoblade Chronicles 2 · 9月21日另发独立实体版": "Prequel to Xenoblade Chronicles 2 · Standalone Physical Edition Released September 21",
    "Remake of: Xenoblade Chronicles（2010）· 内含后日谈 Future Connected": "Definitive Re-release of Xenoblade Chronicles (2010) · Includes the New Epilogue Future Connected",
    "前传：Xenoblade Chronicles 3 · 编号三部曲终章": "Prequel to Xenoblade Chronicles 3 · Concludes the Numbered Trilogy's Overarching Story",
    "Remake of: Xenoblade Chronicles X（2015）· 新增结局篇章": "Definitive Re-release of Xenoblade Chronicles X (2015) · Adds a New Ending Chapter",
    "Remake of: Yakuza 3（2009）；附加全新 Dark Ties 篇章": "Remake of Yakuza 3 (2009) · Includes the New Dark Ties Story"
  };
  const patterns = [
    [/^世代\s*(\d+)$/, "Generation $1"],
    [/^(\d+) 个型号 \/ 改版$/, "$1 models / revisions"],
    [/^型号 \/ 改版 (\d+)$/, "Models / Revisions: $1"],
    [/^型号 \/ 改版 (\d+) 项$/, "$1 models / revisions"],
    [/^护航与特色游戏 (\d+) 款$/, "$1 launch and signature games"],
    [/^(\d+) 个平台$/, "$1 platforms"],
    [/^当前显示 (\d+) 台硬件，覆盖 (\d+) 个护航与特色游戏条目。$/, "Showing $1 hardware entries and $2 launch/signature game records."],
    [/^打开 (.+) 的资料页$/, "Open the reference page for $1"],
    [/^(.+) 图片$/, "$1 image"],
    [/^图片来源：(.+)$/, "Image source: $1"],
    [/^年份待补 · (.+)$/, "Year to be confirmed · $1"],
    [/^判断依据：(.+)$/, "Evidence: $1"],
    [/^谱系关系：(.+)$/, "Lineage: $1"],
    [/^重制：(.+)$/, "Remake of: $1"],
    [/^改版：(.+)$/, "Hack of: $1"],
    [/^(.+) 像素图$/, "$1 pixel sprite"]
  ];

  function translateString(value) {
    if (typeof value !== "string") return value;
    if (ui[value]) return ui[value];
    if (terminology[value]) return terminology[value];
    if (reviewedTranslations[value]) return reviewedTranslations[value];
    for (const [pattern, replacement] of patterns) {
      if (pattern.test(value)) return value.replace(pattern, replacement);
    }
    if (/[·・]/.test(value)) {
      return value
        .split(/\s*[·・]\s*/)
        .map((part) => translateString(part))
        .join(" · ");
    }
    const numberedMainline = value.match(/^正传\s*(\d+)(?:\s*前传)?$/);
    if (numberedMainline) {
      return `Mainline ${numberedMainline[1]}${/前传$/.test(value) ? " Prequel" : ""}`;
    }
    if (translations[value]) return translations[value];
    return value;
  }

  function translateFully(value) {
    let current = value;
    for (let pass = 0; pass < 4; pass += 1) {
      const translated = translateString(current);
      if (translated === current) break;
      current = translated;
    }
    return current;
  }

  function localizeObject(value, visited = new Set()) {
    if (!value || typeof value !== "object" || visited.has(value)) return value;
    visited.add(value);
    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        value[index] = typeof entry === "string" ? translateFully(entry) : localizeObject(entry, visited);
      });
      return value;
    }
    Object.entries(value).forEach(([key, entry]) => {
      value[key] = typeof entry === "string" ? translateFully(entry) : localizeObject(entry, visited);
    });
    return value;
  }

  function isTimelineDataGlobal(key) {
    return key === "HARDWARE_CARD_COPY" || [
      "CONSOLE_",
      "POKEMON_",
      "FINAL_FANTASY_",
      "DRAGON_QUEST_",
      "LIKE_A_DRAGON_",
      "XENOBLADE_",
      "SPIKE_SERIES_"
    ].some((prefix) => key.startsWith(prefix));
  }

  window.applyEnglishLocalization = () => {
    Object.entries(window).forEach(([key, value]) => {
      if (isTimelineDataGlobal(key) && !excludedGlobals.test(key)) localizeObject(value);
    });
  };
  window.ENGLISH_UI_TRANSLATIONS = ui;
  window.ENGLISH_TIMELINE_TERMINOLOGY = terminology;
  window.translateGameArchiveText = translateFully;

  if (window.APP_LANGUAGE !== "en") return;
  window.applyEnglishLocalization();

  const attributes = ["aria-label", "title", "placeholder", "alt"];
  function localizeElement(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      const source = root.nodeValue;
      const trimmed = source.trim();
      if (!trimmed) return;
      const translated = translateFully(trimmed);
      if (translated !== trimmed) root.nodeValue = source.replace(trimmed, translated);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) {
      attributes.forEach((attribute) => {
        if (!root.hasAttribute(attribute)) return;
        const source = root.getAttribute(attribute);
        const translated = translateFully(source);
        if (translated !== source) root.setAttribute(attribute, translated);
      });
    }
    root.childNodes.forEach(localizeElement);
  }

  const nativeAlert = window.alert.bind(window);
  const nativeConfirm = window.confirm.bind(window);
  window.alert = (message) => nativeAlert(translateFully(String(message)));
  window.confirm = (message) => nativeConfirm(translateFully(String(message)));

  window.addEventListener("DOMContentLoaded", () => {
    document.title = "Game Archive";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = ui["本地使用的游戏资料库。"];
    localizeElement(document.body);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(localizeElement);
        if (mutation.type === "attributes") localizeElement(mutation.target);
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: attributes
    });
  });
})();
