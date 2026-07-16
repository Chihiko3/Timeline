# GameConsole

## Local GM image service

The hidden GM image manager requires the local service. Double-click
`start-gm-server.cmd`, keep its command window open, then visit
`http://127.0.0.1:5173/?gm=images`.

一个本地使用的游戏主机与掌机资料库网站。

打开 `index.html` 即可使用。当前第一版按品牌、年份、硬件类型和代表游戏整理，可搜索主机、品牌和游戏，并能在每台硬件下写本地备注。

页面会优先使用 `assets/consoles` 里的本地图片；如果本地图片不存在，会尝试从 Wikipedia 自动匹配缩略图，并把匹配结果缓存在本机浏览器里。没有网络或没匹配到时会显示本地占位图。

图片匹配优先使用 `image-sources.js` 里为每台主机指定的精确 Wikipedia 页面，避免不同主机共用同一张系列图。

如需批量保存图片到本地，可运行：

```powershell
node scripts/download-images.js
```

游戏资料现在分成两类：`护航 / 早期主推` 和 `特色 / 高讨论`。这部分内容维护在 `curated-games.js`，方便按策划视角继续调整。

硬件资料现在分成两层：`data.js` 记录平台世代，`platform-variants.js` 记录每个平台下的型号、改版、扩展和衍生机。页面搜索会同时覆盖平台名、型号名和游戏名。

时间线按品牌分组显示；每个品牌下按年份排列平台，平台下面的同谱系型号默认收起，可展开查看。
Console collection
