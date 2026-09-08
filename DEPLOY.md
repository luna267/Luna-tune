# 部署到 Vercel

本仓库里有两个可以独立部署的东西：

| 目录 | 是什么 | 需要构建 | 需要环境变量 |
|---|---|---|---|
| `landing/` | IOSF 单页站点（纯静态 HTML） | 不需要 | 不需要 |
| 仓库根目录 | 我的部门登记表（Next.js 应用） | 需要 | 需要（见下） |

一个 Vercel 项目只对应一个 Root Directory，所以这两个要建成**两个** Vercel 项目。

---

## A. 部署 `landing/`（静态单页）

`landing/index.html` 完全自包含：CSS、图标（data URI）、交互脚本全部内联，
没有任何外部请求，所以不需要构建步骤。

1. 打开 https://vercel.com/new ，选 **Import Git Repository** → `luna267/luna-tune`
2. 分支选 `claude/project-deploy-verbal-ghue33`（或先把它合并到 `main`）
3. 展开 **Build and Output Settings**，按下表填：

   | 设置项 | 值 |
   |---|---|
   | Root Directory | `landing` |
   | Framework Preset | `Other` |
   | Build Command | 留空（关掉 Override） |
   | Output Directory | 留空 |
   | Install Command | 留空 |

4. 点 **Deploy**

`landing/vercel.json` 已配好 `cleanUrls` 和缓存 / 安全响应头，导入后不用再改。
之后改 `landing/index.html` 并推送，Vercel 会自动重新部署。

### 自定义域名

项目建好后进 Settings → Domains 添加域名，按提示在 DNS 加一条
`CNAME` 指向 `cname.vercel-dns.com`（根域用 Vercel 给的 A 记录）。

---

## B. 部署根目录的 Next.js 应用

1. 同样从 https://vercel.com/new 导入本仓库，但 **Root Directory 留空**（即仓库根）
2. Framework Preset 会自动识别成 **Next.js**，构建设置全部保持默认
3. 在 **Environment Variables** 里加这两个（见 `.env.example`）：

   | 变量 | 值 | 说明 |
   |---|---|---|
   | `DATABASE_URL` | Neon 连接串 | 留空 = 用内存里的 12 条示例数据 |
   | `ACCESS_TOKEN` | 一串很长的随机字符串 | 留空 = 不设登录门 |

   两个都可以先留空，应用照样能跑（README 第 ① 步的状态）。

4. 点 **Deploy**

生成 `ACCESS_TOKEN` 的一种方式：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

设了之后，访问链接是 `https://<你的域名>/?key=<ACCESS_TOKEN>`，
进去一次后写 cookie，之后免输入。

---

## 为什么这一步需要你手动点

这个云端会话里没有 Vercel 的凭证：仓库自带的 `.mcp.json` 把 Vercel MCP 配好了，
但它要走一次 OAuth 授权，而 OAuth 弹窗只能在交互式会话里完成——
云端会话没法替你点「同意」。所以代码和配置我已经准备好并推上来了，
最后的导入 / Deploy 需要你在浏览器里点一下。

如果你想让我下次直接部署，两种办法：

- 在本机的 Claude Code 里跑 `/mcp`，授权 Vercel，之后我就能用 Vercel MCP 部署；
- 或者在 Vercel → Account Settings → Tokens 建一个 token，
  放进这个环境的 `VERCEL_TOKEN` 环境变量，我就能用 CLI 部署。
