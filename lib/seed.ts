import type { RecordRow } from "./types";

// 第 1 步的"示例假数据"。没有 DATABASE_URL 时，应用就用这份数据在内存里跑。
// 迁移到 Neon 后，由数据库提供数据，这份不再使用。
export const seedRecords: RecordRow[] = [
  { id: "r01", updatedAt: "2026-05-28T09:12:00Z", data: { name: "陈思远", role: "后端工程师", stage: "interviewing", owner: "李娜", email: "siyuan.chen@example.com", notes: "二面已过，安排终面。Go / 分布式背景扎实。" } },
  { id: "r02", updatedAt: "2026-05-27T15:40:00Z", data: { name: "王雨桐", role: "产品经理", stage: "offer", owner: "周扬", email: "yutong.wang@example.com", notes: "已发 Offer，等回复。沟通能力强。" } },
  { id: "r03", updatedAt: "2026-05-29T11:05:00Z", data: { name: "刘子豪", role: "数据分析师", stage: "screening", owner: "李娜", email: "zihao.liu@example.com", notes: "简历不错，待约初面。" } },
  { id: "r04", updatedAt: "2026-05-26T10:20:00Z", data: { name: "Aarav Sharma", role: "前端工程师", stage: "rejected", owner: "周扬", email: "aarav.s@example.com", notes: "经验偏初级，本轮不推进。" } },
  { id: "r05", updatedAt: "2026-05-30T08:55:00Z", data: { name: "林晓彤", role: "UI 设计师", stage: "interviewing", owner: "孙琪", email: "xiaotong.lin@example.com", notes: "作品集亮眼，安排和团队聊。" } },
  { id: "r06", updatedAt: "2026-05-25T14:30:00Z", data: { name: "赵明哲", role: "后端工程师", stage: "screening", owner: "李娜", email: "mingzhe.zhao@example.com", notes: "待筛选。" } },
  { id: "r07", updatedAt: "2026-05-31T16:48:00Z", data: { name: "Maria Gonzalez", role: "市场专员", stage: "offer", owner: "孙琪", email: "maria.g@example.com", notes: "口碑好，已发 Offer。" } },
  { id: "r08", updatedAt: "2026-05-24T09:00:00Z", data: { name: "吴佳怡", role: "产品经理", stage: "rejected", owner: "周扬", email: "jiayi.wu@example.com", notes: "方向不匹配。" } },
  { id: "r09", updatedAt: "2026-06-01T13:22:00Z", data: { name: "黄俊杰", role: "数据分析师", stage: "interviewing", owner: "李娜", email: "junjie.huang@example.com", notes: "SQL 实测通过，约终面。" } },
  { id: "r10", updatedAt: "2026-05-23T17:10:00Z", data: { name: "徐若曦", role: "前端工程师", stage: "screening", owner: "孙琪", email: "ruoxi.xu@example.com", notes: "React 经验 3 年，待约。" } },
  { id: "r11", updatedAt: "2026-06-01T10:05:00Z", data: { name: "Daniel Kim", role: "运维工程师", stage: "interviewing", owner: "周扬", email: "daniel.kim@example.com", notes: "K8s 背景，二面中。" } },
  { id: "r12", updatedAt: "2026-05-22T11:35:00Z", data: { name: "郑雅文", role: "市场专员", stage: "screening", owner: "孙琪", email: "yawen.zheng@example.com", notes: "应届，潜力不错。" } },
];
