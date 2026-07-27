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

## Spike Series

- Spike Chunsoft 公司史与代表作：https://www.spike-chunsoft.co.jp/company/about/
- Spike Chunsoft Games Archive：https://www.spike-chunsoft.com/games/
- Spike Chunsoft 日本官网：https://www.spike-chunsoft.co.jp/
- 《弹丸论破》系列全球累计出货 1,000 万套公告：https://www.spike-chunsoft.com/news/danganronpa-series-surpasses-10-million-units-shipped-worldwide/
- 《风来的西林》系列全球累计出货 300 万套公告：https://www.spike-chunsoft.co.jp/news/45940/
- 作品日期与平台另外交叉检查各作品官方站、Nintendo / PlayStation / Steam 商店、Wikipedia 与 GameFAQs 发行记录。
