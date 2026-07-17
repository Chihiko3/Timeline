// External impact is intentionally conservative: an unverified entry does not imply "no impact".
// It only means the archive currently has no source strong enough for an industry-level assertion.
const pokemonUnverifiedImpact = (ids, focus = {}) => Object.fromEntries(ids.map((id) => [id, {
  status: "unverified",
  summary: `尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：${focus[id] || "作品的玩法、市场和后续引用"}；不把系列内部评价或社区热度当作外部影响。`,
  sources: []
}]));

window.POKEMON_EXTERNAL_IMPACT_RESEARCH = {
  ...pokemonUnverifiedImpact([
    "crystal", "firered-leafgreen", "emerald", "platinum", "heartgold-soulsilver",
    "black-white", "black2-white2", "oras", "sun-moon", "ultra-sun-moon", "bdsp",
    "legends-za", "infinite-fusion", "uranium", "insurgence", "black-shadow", "prism",
    "unbound", "radical-red"
  ], {
    crystal: "彩色掌机呈现、动画精灵与第三版本模式",
    "firered-leafgreen": "经典地区重制、联机与兼容性设计",
    emerald: "战斗开拓区与第三版本内容整合",
    platinum: "版本强化、区域重构与战斗设施",
    "heartgold-soulsilver": "跟随宝可梦、复刻设计与双地区结构",
    "black-white": "软重启、新怪物图鉴与叙事主题",
    "black2-white2": "正统续作的版本结构与剧情承接",
    oras: "3D 重制、超级进化与区域叙事补完",
    "sun-moon": "岛屿试炼、地区形态与传统道馆替代",
    "ultra-sun-moon": "资料片式强化版本与究极异兽内容",
    bdsp: "忠实重制、外包开发与现代化取舍",
    "legends-za": "都市开放区、即时战斗与《传说》分支定位",
    "infinite-fusion": "融合生成、社区传播与非官方创作工具链",
    uranium: "原创地区、非官方发行与版权下架事件",
    insurgence: "非官方剧情、Delta 形态与同人社区传播",
    "black-shadow": "ROM 改版叙事、难度设计与中文社区传播",
    prism: "ROM 改版、地图扩展与非官方制作流程",
    unbound: "ROM 改版的开放探索、任务与便利功能",
    "radical-red": "ROM 改版的高难度对战与竞技规则改造"
  }),
  "red-green-blue": {
    status: "verified",
    summary: "确立了以收集、培养、交换和对战为核心的全球怪物收集游戏范式，并成为跨游戏、动画、卡牌与商品的全球文化现象。",
    sources: [
      "https://www.museumofplay.org/games/pokemon-red-and-green/",
      "https://www.smithsonianmag.com/smithsonian-institution/nintendo-released-its-first-pokemon-games-30-years-ago-heres-how-the-beloved-catchable-pocket-monsters-became-the-worlds-biggest-media-franchise-180988271/"
    ]
  },
  yellow: {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：动画角色、伙伴表现与第三版本的跨媒体联动；这属于系列内部的产品策略，不能直接等同于行业影响。",
    sources: ["https://www.gamesradar.com/games/pokemon/pokemon-red-blue-making-of-30th-anniversary/"]
  },
  "gold-silver": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：昼夜、星期、孵蛋与携带物；它们是系列长期标准，但不能仅凭机制延续断言影响了外部作品。",
    sources: ["https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Gold_and_Silver_Versions"]
  },
  "ruby-sapphire": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。官方确认特性与双打扩展了本作策略深度，但这一证据仅支持系列内部影响，不能延伸为行业级结论。",
    sources: ["https://www.pokemon.co.jp/game/gba/rs/battle.html"]
  },
  "diamond-pearl": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。物理／特殊分家重构了宝可梦竞技对战，但目前证据只足以说明其系列内部的长期规则影响。",
    sources: ["https://www.smogon.com/articles/physical-special-split"]
  },
  "x-y": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。超级进化带来版本限定的临时强化机制与广泛对战讨论，但不据此断言影响了其他系列。",
    sources: ["https://www.smogon.com/xy/mega-evolution"]
  },
  "lets-go": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：简化捕捉、双人协力与《Pokémon GO》联动；它展示了系列自身的用户迁移策略，不作外部行业断言。",
    sources: ["https://pokemonletsgo.pokemon.com/en-us/"]
  },
  "sword-shield": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。扩展票替代传统第三版本是系列商业与内容模式的转折，但尚无可靠资料证明其外溢到行业层面。",
    sources: ["https://en.wikipedia.org/wiki/Pok%C3%A9mon_Sword_and_Shield_Expansion_Pass"]
  },
  "legends-arceus": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。已检索方向：场景内捕捉、调查与区域式开放结构；这些是系列明确的实验方向，不能在缺少外部采用证据时写成行业影响。",
    sources: [
      "https://legends.arceus.pokemon.com/en-us/",
      "https://www.gamespot.com/articles/pokemon-legends-arceus-is-not-fully-open-world-pokemon-company-confirms/1100-6496960/"
    ]
  },
  "scarlet-violet": {
    status: "unverified",
    summary: "尚未找到足以支持“行业级外部影响”结论的可靠资料。官方确认其为系列首批完全开放世界 RPG；这说明系列路线变化，不等同于已经影响其他开放世界作品。",
    sources: ["https://www.nintendolife.com/news/2022/06/pokemon-scarlet-and-violet-described-as-the-first-open-world-rpgs-in-the-series"]
  }
};
