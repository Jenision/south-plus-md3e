<!-- spell-checker: disable -->

<div align="center">
  <h1>South Plus MD3E</h1>
</div>
<br>
<div align="center">

「 南+ Material Design 3 Expressive 重构脚本 」

</div>

[📦 安装](#安装)

[⚙ 设置](#设置)

[📚 功能](#功能)

[👻 兼容性](#兼容性)

[🐛 版本历史与更新日志](#版本历史与更新日志)

[📌 更新计划](#更新计划)

[📕 文档站点](#文档站点)

[📖 参与开发](#参与项目)

[❤ 捐助](#捐助)

# 安装
需要浏览器装有 [Tampermonkey](https://tampermonkey.net/)、[Violentmonkey](https://violentmonkey.github.io/) 或 [ScriptCat](https://docs.scriptcat.org/) 插件, 下方表格中挑一个链接安装.

**注意事项**
- **⚠ 使用正式版 (GitHub 源) 须翻墙.**
- 支持南+ (South Plus / North Plus / White Plus / Level Plus / Spring Plus / Summer Plus / Snow Plus / Soul Plus / Blue Plus / East Plus / imoutolove.me 等官方镜像站), 打开任意镜像站即可自动生效.
- 零外部字体/图标 CDN 依赖, 内联 Material Symbols Rounded SVG 图标与中文无衬线字体栈.
- 也可直接手动新建脚本, 将仓库内的 [`south-plus-md3e.user.js`](./south-plus-md3e.user.js) 全部内容粘贴保存.

| 正式版 (jsDelivr 源)                                                                            | 正式版 (GitHub 源)                                                                             | 预览版 |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| [安装](https://cdn.jsdelivr.net/gh/Jenision/south-plus-md3e@main/south-plus-md3e.user.js)       | [安装](https://raw.githubusercontent.com/Jenision/south-plus-md3e/main/south-plus-md3e.user.js) |        |

# 设置
脚本启用后, 点击右上角或左下角设置图标即可随时调整色板与偏好:

- 色彩模式: 浅色 / 深色 / 跟随系统
- Expressive 动态色板: 樱粉 / 电光紫 / 钴蓝 / 青柠茶绿 / 落日琥珀
- 界面布局: 左侧 Navigation Rail 展开/收起、舒适/紧凑密度与推广过滤

## 快捷键

| 按键 | 功能 |
| :--- | :--- |
| `/` | 聚焦顶部搜索 / 页内过滤栏 |
| `g` | 打开 / 关闭全部版块目录抽屉 |
| `r` | （看帖页）滚动并聚焦快速回复框 |
| `t` | 回到页面顶部 |
| `[` / `]` | 上一页 / 下一页 |
| `Esc` | 关闭灯箱、设置弹窗、抽屉或浮层菜单 |

# 功能
将 **南+ (South Plus / North Plus / White Plus / Level Plus 等镜像站)** 全面重构为 **Google Material Design 3 Expressive (MD3E)** 视觉风格与现代交互操作逻辑的油猴脚本.

1. **原汁原味的 MD3E 视觉与动态变形 (Shape Morphing & Spring Motion)**
   - 5 套内置 Expressive 动态色板（樱粉 / 电光紫 / 钴蓝 / 青柠茶绿 / 落日琥珀）, 完整支持浅色 / 深色 / 跟随系统模式.
   - Pill 药丸按钮、Squircle 悬浮操作按钮 (FAB)、连接式分段按钮组 (Connected Segmented Buttons)、分组列表 (Grouped Surface List) 悬停/按压动态圆角变形与 Material Ripple 涟漪.
   - 零外部字体/图标 CDN 依赖, 内联 Material Symbols Rounded SVG 图标与中文无衬线字体栈.
   - 针对深色模式自动修正帖子内传统 `<font color="#000000">` 等高对比度失效问题.

2. **现代 App Shell 导航与操作逻辑**
   - **自定义 MD3E 几何品牌徽标**: 顶栏与左侧导航栏采用几何圆角方框 + 南+星标组合 SVG Emblem, 支持悬停弹簧微交互.
   - **左侧 Navigation Rail**: 可展开/收起（80px ↔ 248px, 移动端自动转为抽屉）, 根据页面上下文动态切换主操作按钮（发帖 / 快速回复 / 聚焦编辑 / 探索版块）, 集成「屏蔽配置」(`#peacemakerconfig`) 原生面板.
   - **吸顶毛玻璃 Top App Bar**: 品牌胶囊、面包屑导航、停靠式胶囊搜索/过滤栏（实时过滤当前页内容, 回车全站搜索）、账号积分胶囊弹窗（跨页面持久化积分与签名缓存, 支持在无 `#infobox` 的内页完整显示头像、SP币、HP、魄与最后登录）.
   - **全部版块目录抽屉**: 跨页面缓存主版块与子版块树, 支持关键词即时检索任意主版块或子版块（如 `GALGAME汉化区`、`同人音声`、`茶楼`）.

3. **全页面类型重构并保留完整原生功能**
   - **首页 (`index.php`)**: 站点动态概览 Hero、公告条、实时动态聚合 Bento 分段看板（支持静默后台预加载、120 秒 `sessionStorage` 会话缓存与骨架屏占位, 彻底消除切换栏目时的 `5 → 18` 跳变闪屏, 并自动补全截断标题）、可折叠版块分类卡片与子版块 Chip.
   - **列表模式 (`thread.php`)**: 版块 Hero、列表/图墙一键切换、默认折叠版块公告与置顶帖、分类 Filter Chips、原生排序表单联动、MD3E 分组主题行与胶囊分页栏.
   - **图墙模式 (`thread_new.php`)**: 响应式封面图墙网格、裁剪/完整比例切换、悬停放大灯箱预览、智能解析标题标签（`新汉化` / `自购` / `无码` / `合集` / 容量 / 网盘）、一键收藏并提示 Snackbar.
   - **帖子详情 (`read.php`)**: 帖子 Hero（字号切换 / 上下主题 / 只看楼主 / 复制链接）、水平作者卡片与头像弹窗、响应式高清大图灯箱画廊、自动识别未购买/已购买状态（已购帖子显示绿色「已购买」解锁横幅而非「购买主题」按钮）、完整迁移原生 `form[name="FORM"]` 快速回复区, 以及右下角楼层电梯悬浮栏与回复 FAB.
   - **发帖 / 编辑页 (`post.php`)**: 保留全部原生 `WYSIWYD` 编辑器（WindCode / 所见即所得切换、工具栏按钮、草稿箱）、表情侧栏、发布选项、出售/加密与附件上传, 统一重构为双栏 MD3E 创作卡片与版规提示横幅.
   - **个人中心 (`u.php`)**: 大尺寸头像与等级徽章 Hero、原地迁移 `#honor`/`#sethonor` 个性签名编辑、横向标签导航与双栏动态/回复/主题卡片.
   - **短消息中心 (`message.php`)**: 左侧导航胶囊栏 + 右侧原生 `#set-content-wrap` 收发件箱, 完整保留 `showTabs`、`CheckAll`、`checkset()` 与批量下载/删除交互.
   - **社区论坛任务 (`plugin.php?H_name-tasks`)**: Hero + 四态分段切换器 + Expressive 任务卡片网格与可折叠任务说明.
   - **全站搜索与结果页 (`search.php` / `search2.php`)**: 重构高级搜索表单为 Expressive 大圆角卡片; 搜索结果列表去除旧式刺眼白条面包屑与 GIF 状态列, 重构为带版块标签的 MD3E 分组主题行与 SVG 状态图标.
   - **操作提示与跳转页（如购买成功）**: 独立居中 MD3E 状态卡片与进度指示条.

# 配置
## 最低配置

## 推荐配置

# 兼容性

## 脚本管理器

### [Tampermonkey](https://tampermonkey.net/) / [Violentmonkey](https://violentmonkey.github.io/) / [ScriptCat](https://docs.scriptcat.org/)
兼容.

### [Greasemonkey](https://www.greasespot.net/)

### [AdGuard](https://adguard.com/zh_cn/adguard-windows/overview.html)

## 浏览器

支持**最新版** Chrome, Edge, Firefox 等现代浏览器.

# 版本历史与更新日志

# 更新计划

# 文档站点

# 开发者

<a href="https://github.com/Jenision/south-plus-md3e/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Jenision/south-plus-md3e" />
</a>

## 参与项目

## 更换 CDN

# 隐私声明
本脚本零外部依赖, 所有偏好设置与缓存数据均保存在浏览器本地, 不会向任何第三方服务器收集或上传用户数据.

# 开源许可

MIT License.

# 第三方开源组件

# 相关推荐

----

<a id="捐助"></a>

**喜欢的话就点个⭐Star 吧(°∀°)ﾉ**

**或者也可以考虑捐助支持一下哦(｀・ω・´)**

支付宝

<img alt="支付宝" src="./images/alipay.jpg" width="400">

微信

<img alt="微信" src="./images/wechat.jpg" width="400">

----

# 我写的其他一些玩意

## [South Plus Fluent 2](https://github.com/Jenision/south-plus-fluent2)
将南+重构为新一代 Microsoft Fluent 2 Design System (Windows 11 Bloom Mica) 风格的油猴脚本

## [South Plus Liquid Glass](https://github.com/Jenision/south-plus-liquid-glass)
将南+重构为 Apple Liquid Glass (macOS Tahoe 26 / iOS 26) 光学液态玻璃风格的油猴脚本

----
