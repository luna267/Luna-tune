# landing — IOSF 单页站点

一个完全自包含的静态页面：`index.html` 里内联了全部 CSS、字体图标（data URI）和交互脚本，
没有任何外部资源依赖。所以部署时**不需要构建步骤**。

## 部署到 Vercel（静态，无需构建）

在 Vercel 新建项目时按下面填：

| 设置项 | 值 |
|---|---|
| Root Directory | `landing` |
| Framework Preset | `Other` |
| Build Command | 留空 |
| Output Directory | 留空（默认就是 Root Directory 本身） |
| Install Command | 留空 |

`vercel.json` 已经配好 `cleanUrls` 和缓存/安全响应头，导入后直接 Deploy 即可。

## 改内容

直接编辑 `index.html`。提交推送后 Vercel 会自动重新部署。
