# 资料采集与校验策略

这个站点的目标不是做 ROM 下载站，而是做个人用的主机、掌机、软件阵容查漏补缺资料库。模拟器和游戏数据库可以作为重要线索，但不能直接等同于事实来源。

## 信息分层

硬件谱系：
- 优先来源：厂商官网、说明书、新闻稿、Wikipedia / Wikimedia、主机专门 Wiki、博物馆或 preservation 项目。
- 校验重点：发售年份、地区、型号关系、是否属于同一产品线、是否只是外设或兼容设备。

护航 / 早期主推游戏：
- 优先来源：官方首发阵容、发售日软件列表、当年媒体报道、平台官方商店历史页。
- 校验重点：区分日本、北美、欧洲等地区首发差异；区分“首发日”与“早期窗口期”。

特色 / 高讨论游戏：
- 优先来源：平台代表作榜单、销量榜、评分聚合、回顾文章、玩家社区长期讨论、模拟器前端精选列表。
- 校验重点：必须确认游戏确实在该硬件或其兼容模式上可玩；跨平台游戏要确认该平台版本是否有代表性。

完整软件库线索：
- 优先来源：No-Intro、Redump、MAME / MESS、TOSEC、LaunchBox Games Database、MobyGames、GameFAQs、TheGamesDB、IGDB、RetroAchievements、Libretro / emulator 文档。
- 校验重点：这些来源适合发现“可能遗漏的游戏”，但写入站点前需要再交叉确认发行平台、地区和年份。

## 模拟器网站的使用方式

可以使用：
- 模拟器兼容性列表，用来确认某个平台的软件是否能被模拟器识别。
- ROM 管理数据库，用来补全平台软件库、地区版本、标题变体。
- 模拟器前端数据库，用来观察玩家实际整理出来的平台分类和热门条目。
- Retro achievement / save database，用来发现社区持续玩的高讨论游戏。

不能直接使用：
- 单一 ROM 下载站的标题归类。
- 没有发行信息、没有平台说明、只靠文件名判断的平台对应。
- 把 hack、homebrew、prototype、unlicensed、fan translation 直接混进正式发行游戏，除非条目标注清楚。

## 写入规则

一个游戏进入 `launchGames`：
- 至少有一个明确来源说明它属于首发日或早期主推阵容。
- 如果不同地区首发不同，优先按该主机的主要首发地区记录，并在 note 里说明。

一个游戏进入 `signatureGames`：
- 至少满足两个条件中的一个：长期被认为是平台代表作；或者在该平台上有独特版本、玩法、技术或历史意义。
- 对跨平台游戏，优先保留“该平台版本特别重要”的条目。

一个游戏进入未来的完整库：
- 至少有两个独立来源能确认平台归属；或一个高可信 preservation 数据库能确认发行记录。
- 需要保留来源字段，方便之后回查。

## 验证流程

1. 先用 Wikipedia / 官方资料确认硬件名称、年份、地区和型号层级。
2. 再用模拟器、ROM 管理、preservation 数据库扫遗漏的软件标题。
3. 对候选游戏交叉查 MobyGames、GameFAQs、LaunchBox、No-Intro、Redump、官方商店或说明书。
4. 把结果归入 `launchGames`、`signatureGames`，未来如做完整库再单独建 `libraryGames`。
5. 对不确定条目不要硬写，先放进待验证清单。

## 维护原则

- 模拟器站点负责“发现问题”，不负责“最终定案”。
- ROM 文件不下载、不保存，站点只记录元数据。
- 对游戏策划视角有用的信息优先：首发阵容、代表玩法、硬件特性绑定、商业成败、社区讨论度。
- 每次批量补资料后，抽查几个冷门平台，避免把错误的平台归类批量带进来。

## 代际差异分析标准

每一项“本作变化”与“机制逻辑”都按以下顺序检查：

1. 先确定比较基线：它具体承接哪一部作品或哪套既有规则，不能只写“新增了某系统”。
2. 再写可观察变化：输入方式、资源、状态、数值关系、关卡条件、失败代价或叙事触发到底怎样改变。
3. 解释运行链条：玩家采取什么行动，系统读取什么条件，产生什么反馈，又迫使玩家调整什么决策。
4. 最后判断作用：解决了前作什么问题、制造了什么新问题，以及后续哪一作明确继承、修正或放弃。

证据层级必须区分：

- 官方明确说明：开发者访谈、说明书、官方网站或当年正式资料，可用于描述设计目标。
- 成品直接可见：游戏规则、界面、关卡和剧情脚本中能稳定复现的事实，可用于解释系统怎样运行。
- 高一致性解读：多个可靠资料或长期玩家共识支持的比较，只能写成分析，不能冒充官方设计意图。
- 证据不足：保留已有事实或明确写待验证，不用“丰富体验”“为后续提供基础”等空泛句补齐字段。

## Spike Series

- Spike Chunsoft 公司史与代表作：https://www.spike-chunsoft.co.jp/company/about/
- Spike Chunsoft Games Archive：https://www.spike-chunsoft.com/games/
- Spike Chunsoft 日本官网：https://www.spike-chunsoft.co.jp/
- 《弹丸论破》系列全球累计出货 1,000 万套公告：https://www.spike-chunsoft.com/news/danganronpa-series-surpasses-10-million-units-shipped-worldwide/
- 《风来的西林》系列全球累计出货 300 万套公告：https://www.spike-chunsoft.co.jp/news/45940/
- 作品日期与平台另外交叉检查各作品官方站、Nintendo / PlayStation / Steam 商店、Wikipedia 与 GameFAQs 发行记录。

## Final Fantasy

- 《FINAL FANTASY IV》30 周年官方访谈（时田贵司谈固定职业、战斗事件与剧情演出）：https://na.finalfantasy.com/topics/296
- 《FINAL FANTASY III》30 周年官方访谈（职业切换与职业专属指令）：https://na.finalfantasy.com/topics/171
- 《FINAL FANTASY VI》30 周年官方访谈（含《V》Gilgamesh 战中叙事的开发回顾）：https://na.finalfantasy.com/topics/528
- 《FINAL FANTASY IX》官方访谈（回归系列根源与事件设计）：https://na.finalfantasy.com/topics/191
- 《FINAL FANTASY XII》官方作品资料：https://na.finalfantasy.com/topics/52
- 《FINAL FANTASY Crystal Chronicles》官方开发者访谈：https://na.finalfantasy.com/topics/210
- 《Chocobo GP》官方开发者访谈：https://na.finalfantasy.com/topics/349

## Pokémon

- 《Pokémon HeartGold / SoulSilver》Iwata Asks 官方访谈：https://iwataasks.nintendo.com/interviews/ds/pokemon/0/0/
- 《Pokémon Black / White》Iwata Asks 官方访谈：https://iwataasks.nintendo.com/interviews/ds/pokemon-black-white/0/0/
- 《Pokémon Black 2 / White 2》Iwata Asks 官方访谈：https://iwataasks.nintendo.com/interviews/ds/pokemon-black2-white2/0/0/
- 《Pokémon Legends: Z-A》官方玩法说明（系列首次实时战斗、距离与招式范围）：https://legends.pokemon.com/en-gb/gameplay

## Dragon Quest

- 《勇者斗恶龙 III》官方系统资料（队伍、职业与转职）：https://www.dragonquest.jp/roto-trilogy/dq3/system/index.html
- 《勇者斗恶龙》堀井雄二游戏设计书官方介绍：https://www.dragonquest.jp/portal/news_detail/sq/4256/

## Xeno Series

- 《Xenoblade Chronicles》Iwata Asks 官方访谈（无缝世界、无缝战斗与未来视）：https://www.nintendo.com/en-gb/Iwata-Asks/Iwata-Asks-Xenoblade-Chronicles/Vol-3-The-Development-Process/4-The-Drive-to-Get-the-Job-Done/4-The-Drive-to-Get-the-Job-Done-839498.html
- 《Xenoblade Chronicles》Iwata Asks 剧情访谈（互动成长对角色叙事的约束）：https://iwataasks.nintendo.com/interviews/wii/xenoblade/1/0/
- 《Xenoblade Chronicles X》Iwata Asks 官方访谈：https://iwataasks.nintendo.com/interviews/wiiu/xenoblade-chronicles-x/0/0/

## Like a Dragon

- 《Yakuza: Like a Dragon》制作人说明（主角性格、队伍结构与回合制重构）：https://blog.playstation.com/2020/07/22/yakuza-like-a-dragon-meet-the-heroes-of-tomorrow/
- 《Like a Dragon》20 周年开发者访谈（先定剧情概念，再让支线内容服务主题）：https://blog.playstation.com/?p=413524
- 《Like a Dragon: Pirate Yakuza in Hawaii》开发者访谈（舰战难度分层与斗技场）：https://blog.playstation.com/2025/02/20/like-a-dragon-pirate-yakuza-in-hawaii-interview-2/
