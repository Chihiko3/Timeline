// External impact is intentionally conservative: an unverified entry does not imply "no impact".
const finalFantasyUnverifiedImpact = (ids, focus = {}) => Object.fromEntries(ids.map((id) => [id, {
  status: "unverified",
  summary: `尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：${focus[id] || "玩法、市场与后续引用"}；不把品牌知名度、重制次数或系列内部影响当作外部影响。`,
  sources: []
}]));

window.FINAL_FANTASY_EXTERNAL_IMPACT_RESEARCH = {
  ...finalFantasyUnverifiedImpact([
    "ff1", "ff2", "ff3", "ff5", "mystic-quest", "ff6", "chocobo-no-fushigi",
    "chocobo-no-fushigi-2", "ff8", "chocobo-racing", "ff9", "ffx", "ffx-2",
    "ff-tactics-advance", "crystal-chronicles", "ff7-snowboarding", "before-crisis",
    "dirge-cerberus", "ff3d", "chocobo-tales", "ff12-rw", "crisis-core",
    "ff-tactics-a2", "ring-of-fates", "chocobos-dungeon", "ff4-3d-remake",
    "ff4-after-years", "my-life-as-king", "my-life-as-darklord", "echoes-of-time",
    "ff13", "crystal-bearers", "four-heroes", "ff14-1", "type-0", "ff13-2",
    "ff-dimensions", "ff7-g-bike", "lightning-returns", "ff-agito", "ff-dimensions-2",
    "mobius-ff", "ff-explorers", "ff7-first-soldier", "stranger-of-paradise",
    "chocobo-gp", "ff16", "ff7-ever-crisis", "ff7-rebirth"
  ], {
    ff1: "早期主机 JRPG 的队伍、职业与成长结构",
    ff2: "熟练度成长与非经验值升级设计",
    ff3: "可切换职业系统与队伍构筑",
    ff5: "自由职业组合与能力继承",
    "mystic-quest": "面向北美市场的简化 JRPG 设计",
    ff6: "群像叙事、角色塑造与 16 位演出",
    "chocobo-no-fushigi": "角色品牌进入 Roguelike 的早期分支",
    "chocobo-no-fushigi-2": "Roguelike 分支的续作与系统深化",
    ff8: "Junction、卡牌与青年向校园叙事",
    "chocobo-racing": "角色品牌进入卡丁车竞速类型",
    ff9: "复古回归、职业原型与童话叙事",
    ffx: "配音叙事、条件回合战斗与球盘成长",
    "ffx-2": "正传直接续作、职业换装与女性主角群像",
    "ff-tactics-advance": "掌机战棋、裁判规则与任务式结构",
    "crystal-chronicles": "多人联机、GBA 连接与主机协作体验",
    "ff7-snowboarding": "IP 微型外传与单一玩法商品化",
    "before-crisis": "早期移动端章节式叙事与编译计划",
    "dirge-cerberus": "主系列世界观与第三人称射击的结合",
    ff3d: "经典 JRPG 的 3D 重制与掌机再发行",
    "chocobo-tales": "卡牌叙事、儿童向呈现与 DS 双屏交互",
    "ff12-rw": "伊瓦利斯世界观在掌机即时战略中的延展",
    "crisis-core": "前传叙事、掌机动作 RPG 与编译计划",
    "ff-tactics-a2": "掌机战棋职业组合与任务规则",
    "ring-of-fates": "多人动作 RPG 与 DS 联机设计",
    "chocobos-dungeon": "Roguelike 品牌延续与 Wii 平台适配",
    "ff4-3d-remake": "经典作品 3D 重制与角色补写",
    "ff4-after-years": "章节式后日谈与数字分发内容模式",
    "my-life-as-king": "WiiWare 数字发行与城市经营分支",
    "my-life-as-darklord": "塔防类型与角色品牌的结合",
    "echoes-of-time": "DS/Wii 跨平台联机与协作玩法",
    ff13: "线性流程、战斗范式与高成本开发争议",
    "crystal-bearers": "水晶编年史分支的动作冒险转向",
    "four-heroes": "小队协作、无 HUD 呈现与 WiiWare 发行",
    "ff14-1": "初版 MMO 的产品失败与服务运营问题",
    "type-0": "学院群像、战争题材与动作 RPG 结构",
    "ff13-2": "多结局、时间旅行与正传续作结构",
    "ff-dimensions": "移动端像素风正传式 RPG",
    "ff7-g-bike": "移动端轻量化外传与 IP 再利用",
    "lightning-returns": "时间限制、城市任务与单主角结构",
    "ff-agito": "移动端全服选择、章节运营、服务终止与 Agito+ 取消的区别",
    "ff-dimensions-2": "移动端免费游玩、抽取与角色编队",
    "mobius-ff": "移动端高规格 3D RPG 与服务运营",
    "ff-explorers": "多人共斗与职业能力组合",
    "ff7-first-soldier": "大逃杀外传与服务终止案例",
    "stranger-of-paradise": "高难度动作、Team Ninja 合作与重述起源",
    "chocobo-gp": "免费游玩竞速、赛季与平台服务",
    ff16: "成熟分级、动作化正传与单机发行策略",
    "ff7-ever-crisis": "章节式移动端重述与抽取商业模式",
    "ff7-rebirth": "大型重制三部曲、开放区域与原作重构"
  }),
  ff4: {
    status: "verified",
    summary: "常被视为角色关系与戏剧化叙事成为 JRPG 核心表达的里程碑；其外部意义主要在叙事与角色发展，而非单一首创机制。",
    sources: ["https://en.wikipedia.org/wiki/Final_Fantasy_IV"]
  },
  ff7: {
    status: "verified",
    summary: "以 3D 演出、全球营销与高销量推动主机 JRPG 进入更广泛的西方大众市场，并改变 Square 对海外本地化与发行市场的判断。",
    sources: [
      "https://www.gamespot.com/videos/how-final-fantasy-vii-changed-everything/2300-6463554/",
      "https://www.gamesradar.com/games/final-fantasy/before-final-fantasy-7-blew-up-globally-a-lot-of-square-enix-leadership-thought-there-wasnt-real-money-in-english-translations-and-the-localization-team-had-to-beg-them-for-overseas-releases/"
    ]
  },
  "ff-tactics": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：职业成长、等距战棋与伊瓦利斯叙事；其重要性毋庸置疑，但目前资料不足以量化或确认其对外部战棋作品的直接影响。",
    sources: ["https://en.wikipedia.org/wiki/Final_Fantasy_Tactics"]
  },
  ff11: {
    status: "verified",
    summary: "被 Guinness 记录为首个实现主机与 PC 跨平台联机的 MMORPG，是主机在线服务和跨平台 MMO 的早期标志案例。",
    sources: ["https://www.guinnessworldrecords.com/world-records/92187-first-cross-platform-mmorpg-videogame"]
  },
  ff12: {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：Gambit 的规则式队伍 AI；它是很有价值的设计案例，但当前没有足以确认其对外部作品产生直接影响的可靠证据。",
    sources: ["https://blog.playstation.com/archive/2017/07/07/extended-play-how-final-fantasy-xis-gambit-created-one-of-the-most-distinct-rpgs-ever/"]
  },
  "ff14-arr": {
    status: "verified",
    summary: "从失败首发到全面重构并持续运营，成为大型在线游戏通过产品重启修复系统、内容与玩家信任的标志性案例。",
    sources: ["https://na.finalfantasy.com/topics/21", "https://www.gamedeveloper.com/business/understanding-the-successful-relaunch-of-i-final-fantasy-xiv-i-"]
  },
  "ff7-remake": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：重制中的叙事重构、战斗现代化与原作关系；广泛讨论不等于已确认的外部行业影响。",
    sources: ["https://www.gamesradar.com/final-fantasy-7-remake-ending-explained/"]
  },
  ff15: {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：长期开发、跨媒体企划、发售后补完与项目范围管理；这些可用于个案研究，但不作外部影响断言。",
    sources: ["https://www.gamedeveloper.com/business/final-fantasy-xv-director-hajime-tabata-on-the-making-of-a-massive-game"]
  }
};
