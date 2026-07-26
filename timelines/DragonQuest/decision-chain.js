window.DRAGON_QUEST_DECISION_CHAINS = {
  dq2: {
    problem: "初代用单角色和受控地图成功降低了主机 RPG 的理解门槛，但冒险规模、队伍策略和远距离探索仍然有限。",
    hypothesis: "加入伙伴、船和更开放的大地图，可以在保留简单指令的同时提高战斗互补、搜索假设和世界规模。",
    experiment: "把单角色扩展为三人队伍，以不同法术和能力形成职责；让船解除陆路边界，并把关键物搜集分散到更大的非线性区域。",
    outcome: "系列获得了队伍战斗和世界旅行的基本尺度，但线索分散、海域搜索和终盘难度造成明显摩擦，说明扩大自由度时仅增加空间和敌人强度不足以维持可读性。",
    followUp: "第三作保留队伍与大世界，却用酒馆编队、职业分工、城镇信息和更系统的成长规划重新组织复杂度；后续正传没有回到初代的单角色结构。",
    basis: "关卡、队伍和难度曲线对比；关于第三作针对性修正的表述属于研究判断。"
  },
  dq9: {
    problem: "传统正传以固定主机上的单人长篇为中心，系列尚未验证便携设备上的面对面协作、重复探索和通关后长期交换能否成为主循环。",
    hypothesis: "如果把自建队伍、职业培养和随机藏宝图放到普及度高的掌机，并允许本地多人共同冒险，正传可以从一次性故事扩展为线下社交活动。",
    experiment: "采用 Nintendo DS 独占、自定义主角与队伍、本地多人联机、可反复刷新的藏宝图，以及通过擦肩通信传播地图和访客。",
    outcome: "藏宝图与擦肩通信形成了超出主线的社会传播和长期刷取，但体验高度依赖当时的人群密度与线下环境，离开活跃周期后部分价值难以复现。",
    followUp: "第十作把多人协作推进为持续在线世界；第十一作又回到大型单机叙事，说明社交化成为可复用分支，而没有取代单人正传。",
    basis: "本作功能、线下传播现象和后续两部正传结构对比；因果关系属于研究归纳。"
  },
  dq10: {
    problem: "第九作已经验证多人协作和长期收集，但本地联机无法持续更新同一世界，也无法让玩家关系长期沉淀。",
    hypothesis: "将 Dragon Quest 的低门槛指令战斗、职业成长和城镇冒险转成 MMO，可以在保持系列操作语言的同时建立持续运营的共同世界。",
    experiment: "采用在线共享世界、五种族起点、职业与队伍协作、版本式剧情更新，并让 Wii 成为最初入口，随后扩展到多个平台。",
    outcome: "作品形成长期运营的日本本土社区和持续叙事，但在线服务、地区运营和订阅门槛限制了全球可达性，也使其剧情难以像单机正传一样长期保存。",
    followUp: "第十一作恢复全球单机正传；Dragon Quest X Offline 又将在线剧情重构为可独立游玩的版本，表明系列选择保留 MMO 分支，同时为其内容建立离线入口。",
    basis: "发行平台、运营形态、DQXI 与 DQX Offline 的产品结构可验证；战略动机属于研究判断。"
  }
};

window.DRAGON_QUEST_DECISION_CHAIN_REVIEW = {
  inferred: [
    "dq1", "dq3", "dq4", "dq5", "torneko-1", "dq6", "dqm1", "dq7",
    "dq8", "battle-road", "dq11", "builders", "builders-2", "dq11s",
    "dq3-hd2d", "dq12-hd2d", "dq7-reimagined"
  ],
  insufficient: {
    "version-evidence": [
      "dq12-sfc", "dq3-sfc", "torneko-2", "dqm2", "dq4-ps", "dqm12",
      "torneko-3", "caravan-heart", "dq5-ps2", "young-yangus",
      "dq6-ds", "dqm-joker-2", "terry-3d", "dq7-3ds", "dqm2-3d",
      "dq8-3ds", "dqm-joker-3", "dqm2-sp", "dq10-offline", "dark-prince"
    ],
    "service-evidence": [
      "battle-road-2", "battle-road-victory", "monster-parade",
      "dqm-super-light", "stars", "battle-scanner", "dq-rivals", "dq-walk",
      "dq-tact", "dai-cross-blade", "dai-bonds", "keshi-keshi",
      "dq-champions", "smash-grow"
    ],
    "branch-evidence": [
      "kenshin", "slime-1", "slime-2", "dqm-joker", "dq-swords",
      "dq-wars", "slime-3", "dq-heroes", "theatrhythm", "dq-heroes-2",
      "dq-treasures", "infinity-strash"
    ]
  }
};
