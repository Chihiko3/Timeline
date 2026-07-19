# Game Archive

一个面向个人长期维护的本地游戏资料库。当前网站以统一的纵向时间线整理游戏硬件与游戏系列，重点是方便查阅、补充和管理资料，而不是面向公开用户的内容平台。

## 当前内容

### 游戏主机资料库

- 按最早公开发售时间排列游戏主机、掌机、混合机与 PC 掌机。
- 收录厂商、硬件型号、改版、代表性首发游戏与特色高讨论游戏。
- 点击时间线一级卡片可查看型号/改版、护航作与代表作等补充资料。

### 游戏系列资料库

- **总览**：提供所有已注册游戏时间线的筛选器。默认不显示任何系列；用户勾选后，将所选系列的一级卡片按全球最早发售日期合并到同一条时间线，并复用各系列原有的卡片内容、图片与展开详情。
- **Pokemon**：官方作品与代表性同人/ROM 改版，包含首发及后续登陆平台、御三家、重制/改版关系和封面图。
- **Final Fantasy**：不含跨界作品的最终幻想相关作品，包含正传、续作、战略版、水晶编年史、陆行鸟等分支，以及首发及后续登陆平台和封面/Logo 图。
- **Xeno Series**：以创作谱系串联 Xenogears、Xenosaga 与 Xenoblade，区分版权与世界观边界，并整理发行平台、机制演进和剧情解读。

新增游戏时间线时，应同时在 `common/app.js` 的 `seriesOverviewDefinitions()` 中完成注册。注册后的系列会自动进入总览筛选器，但不会默认勾选。

所有时间线的一级卡片遵循同一套规则：左上角日期、右上角分类标签、标题、副标题、补充文本、二级菜单提示，以及可选的右下角图片区域。不同时间线的二级、三级详情内容可以不同。

二至四级信息的固定职责见 [common/TIMELINE_CARD_ARCHITECTURE.md](common/TIMELINE_CARD_ARCHITECTURE.md)：二级为作品快照，三级为结构化记录，四级为策划观察与进一步研究线索。

## 项目结构

```text
GameConsole/
  index.html                         网站入口
  common/                            所有时间线共用的逻辑与样式
    app.js                            页面框架、统一时间线排布、卡片交互
    styles.css                        统一视觉样式、尺寸、间距和响应式规则
    timeline-image-store.js           GM 图片管理接口
  timelines/
    hardware/                         游戏主机时间线
      data.js                         硬件与厂商资料
      platform-variants.js            型号、改版、扩展与衍生硬件
      curated-games.js                护航/主推与特色/高讨论游戏
      game-localizations.js           游戏中文名资料
      timeline-images.js              主机卡片图片清单
      assets/consoles/                主机图片
    pokemon/                          Pokemon 时间线
      selection-criteria.js           时间线开头的收录规则
      releases.js                     版本、发售日期与平台资料
      timeline-images.js              卡片封面清单
      assets/covers/                  游戏封面
      assets/sprites/                 御三家像素图
    final-fantasy/                    Final Fantasy 时间线
      selection-criteria.js           时间线开头的收录规则
      final-fantasy-releases.js       作品、发售日期与平台资料
      final-fantasy-covers.js         采集到的封面映射
      final-fantasy-logos.js          采集到的 Logo 映射
      timeline-images.js              卡片图片清单
      assets/covers/                  封面与 Logo 文件
    XenoSeries/                       Xeno Series 创作谱系时间线
      selection-criteria.js           时间线开头的收录规则
      releases.js                     作品、发售日期与平台资料
      editorial-reading.js            核心体验、本作变化与研究线索
      design-logic.js                 机制底层逻辑
      series-impact.js                系列长期影响
      external-impact-research.js     行业影响及验证状态
      plot-summaries.js               剧情概要与叙事创新
      timeline-images.js              卡片图片清单
      assets/covers/                  Xeno Series 全部作品图片
  scripts/                            本地服务、资源采集与维护脚本
  start-gm-server.cmd                 启动本地 GM 图片管理服务
```

每条时间线都拥有自己的数据、图片清单和资源目录；不要再把某条时间线的资源放到其他时间线目录或根目录。通用的页面结构、时间线尺寸和交互逻辑只放在 `common/`。

## 日常使用

### 浏览资料库

直接打开 `index.html` 即可浏览本地资料库。若需要使用 GM 图片管理、上传图片或删除图片，请使用下面的本地服务方式打开。

### 使用 GM 图片管理

1. 双击 `start-gm-server.cmd`。
2. 保持弹出的命令窗口运行。
3. 在浏览器打开 `http://127.0.0.1:5173/?gm=images`。
4. 在 GM 页面选择对应时间线和卡片，添加、替换、排序或删除图片。

GM 图片管理仅供本地维护使用。上传的图片会被复制到对应时间线的 `assets` 目录；删除图片会同时删除清单记录和未被其他卡片引用的本地文件。

## 图片规则

- 时间线图片的唯一清单是各时间线目录下的 `timeline-images.js`。
- 一张卡片配置一张图时，卡片只展示该图；配置多张图时，卡片支持循环切换，悬浮时展示全部图片。
- 图片应放在所属时间线的资源目录中：主机放入 `hardware/assets/consoles`，Pokemon 放入 `pokemon/assets/covers`，Final Fantasy 放入 `final-fantasy/assets/covers`，Xeno Series 放入 `XenoSeries/assets/covers`。
- 主动采集日本游戏图片时，优先使用其最早发行平台的日本地区封面；没有独立实体封面的内容可使用日本官网主视觉，并在图片名称中注明。
- 自动采集和批量整理只可替换 `seed-` 开头的预置图片，不得覆盖通过 GM 工具添加或替换的图片。
- 新增或调整图片优先使用 GM 图片管理工具，避免手动改清单与文件路径产生不一致。

## 资料维护约定

- 时间线日期使用作品或硬件在全球范围内**最早公开发售**的日期；若日期无法可靠确认，可按资料需要只显示到年月。
- 一级卡片是全站统一组件。涉及一级卡片的尺寸、字体、间距、图片区域、悬浮和展开逻辑的修改，应同步考虑所有时间线。
- 二级、三级卡片为具体时间线的详情层，可根据资料类型单独设计。
- 分类标签用于帮助识别作品归属和类型。例如 Final Fantasy 使用“正传 · RPG”“战略版 · 战棋”“水晶编年史 · 动作冒险”等格式。
- 游戏与硬件资料可从官方资料、可靠 Wiki、模拟器资料站、游戏数据库等来源交叉验证后补充。

## 维护脚本

`scripts/` 中的脚本用于批量采集与维护。常用脚本包括：

- `local-gm-server.js`：GM 图片管理服务。
- `download-images.js`：下载主机图片。
- `fetch-game-localizations.js` / `.ps1`：补充硬件代表游戏的中文名。
- `fetch-final-fantasy-covers.ps1`：补充 Final Fantasy 封面。
- `fetch-final-fantasy-logos.ps1`：补充 Final Fantasy 横向 Logo。
- `fetch-final-fantasy-wiki-artwork.ps1`：从 Final Fantasy Wiki 补充可供 GM 筛选的图片。
- `audit-release-data.js`：检查所有游戏系列的完整日期、平台年份和渲染顺序。
- `seed-timeline-image-manifest.js`：根据现有资源重建全部时间线的图片清单。该脚本会重写清单，通常只在明确需要重建时使用。

## 新增时间线

新增一个游戏系列或产品线时，应先建立 `timelines/<timeline-id>/`，并至少包含作品/产品数据文件、`timeline-images.js` 和 `assets/`。随后在 `index.html` 注册数据脚本与页面页签，并在 `common/app.js` 中接入该时间线特有的二级、三级详情内容。

一级卡片仍应复用 `common` 的统一时间线样式和布局逻辑。这样可以保证后续增加更多资料库时，页面仍像同一个网站，而不是多个独立页面的拼接。
