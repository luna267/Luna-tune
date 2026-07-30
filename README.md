# 我的部门登记表

一个带登录的内部记录管理小程序：一张能增删改的数据表 + 一个登录门。
工作坊里你会用 AI（Claude Code）把它从「本地跑起来」一路带到「云数据库 + 公开网址」。

技术栈：Next.js + TypeScript + Neon(Postgres) + Vercel。换部门只改一个文件 `lib/entity.ts`。

---

## 四步走（在 Claude Code 里，每步贴一句中文）

### ① 本地跑起来
> 请在这个环境里把这个 Next.js 项目装好依赖并启动，给我一个可以预览的网址。

没有数据库时，应用自动用内存里的 12 条示例数据运行。看到候选人列表 = 成功。

### ② 迁移到 Neon 云数据库
> 帮我在 Neon 上新建一个数据库项目，名字叫 `我的英文名-dept`，区域选 Singapore。
> 然后用项目里的 `db/schema.sql` 建表、用 `db/seed.sql` 导入示例数据，
> 再把 Neon 的连接串配置到 `DATABASE_URL` 环境变量里。

确认：
> 帮我确认现在应用读到的是 Neon 上的数据，不是内存里的示例数据。

### ③ 加登录（优先「链接带密码」）
> 帮我加"带密码的访问链接"：生成一个很长的随机字符串作为访问密码，
> 配置到 `ACCESS_TOKEN` 环境变量。把带 `?key=` 的完整访问网址发给我。

> 进阶（其次）：用 Neon Auth 改成"邮箱收一次性验证码"登录。

### ④ 部署到 Vercel
> 帮我把这个项目部署到 Vercel，把 `DATABASE_URL` 和 `ACCESS_TOKEN` 也配置上去，
> 部署完成后把公开访问的网址发给我。

---

## 两个环境变量（见 `.env.example`）

| 变量 | 作用 | 什么时候设 |
|---|---|---|
| `DATABASE_URL` | Neon 连接串。**留空 = 用内存示例数据** | 第 ② 步 |
| `ACCESS_TOKEN` | 访问密码。**留空 = 不设登录门** | 第 ③ 步 |

两个都留空也能完整跑（第 ① 步的状态）。这正是设计意图：登录和数据库都靠配置开启，不用改代码，最不容易出错。

## 换成你的部门

打开 `lib/entity.ts`，改 `entityName` 和 `fields`：

- 财务：报销登记表 → 申请人 / 金额(number) / 类别 / 状态 / 日期(date)
- 法务：合同登记表 → 对方 / 类型 / 签署日(date) / 到期日(date) / 状态

列表只显示 `inList: true` 的字段，详情面板显示全部。改完让 Claude「提交代码」，Vercel 会自动重新部署。

## 关于 Neon / Vercel 连接（`.mcp.json`）

本仓库自带 `.mcp.json`，已配置好 Neon 和 Vercel 的远程 MCP。在 Claude Code（含云端 claude.ai/code）里打开本仓库后：

1. Claude 会提示「项目包含 2 个 MCP 服务器」，点同意。
2. 第一次用到时，运行 `/mcp` 会弹出 OAuth 授权页，分别授权 Neon、Vercel 即可。

不用自己在电脑上装任何东西。GitHub 由 Claude GitHub App 授权，也不用 SSH key。

## 本地手动跑（可选）

```bash
npm install
npm run dev      # http://localhost:3000
```
