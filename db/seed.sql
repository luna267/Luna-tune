-- 示例数据。第 2 步迁移后导入，让云数据库里先有 12 条候选人记录。
-- 换部门后这份数据就不适用了，按 lib/entity.ts 的新字段重写即可。

insert into records (id, data, updated_at) values
('r01', '{"name":"陈思远","role":"后端工程师","stage":"interviewing","owner":"李娜","email":"siyuan.chen@example.com","notes":"二面已过，安排终面。Go / 分布式背景扎实。"}'::jsonb, '2026-05-28T09:12:00Z'),
('r02', '{"name":"王雨桐","role":"产品经理","stage":"offer","owner":"周扬","email":"yutong.wang@example.com","notes":"已发 Offer，等回复。沟通能力强。"}'::jsonb, '2026-05-27T15:40:00Z'),
('r03', '{"name":"刘子豪","role":"数据分析师","stage":"screening","owner":"李娜","email":"zihao.liu@example.com","notes":"简历不错，待约初面。"}'::jsonb, '2026-05-29T11:05:00Z'),
('r04', '{"name":"Aarav Sharma","role":"前端工程师","stage":"rejected","owner":"周扬","email":"aarav.s@example.com","notes":"经验偏初级，本轮不推进。"}'::jsonb, '2026-05-26T10:20:00Z'),
('r05', '{"name":"林晓彤","role":"UI 设计师","stage":"interviewing","owner":"孙琪","email":"xiaotong.lin@example.com","notes":"作品集亮眼，安排和团队聊。"}'::jsonb, '2026-05-30T08:55:00Z'),
('r06', '{"name":"赵明哲","role":"后端工程师","stage":"screening","owner":"李娜","email":"mingzhe.zhao@example.com","notes":"待筛选。"}'::jsonb, '2026-05-25T14:30:00Z'),
('r07', '{"name":"Maria Gonzalez","role":"市场专员","stage":"offer","owner":"孙琪","email":"maria.g@example.com","notes":"口碑好，已发 Offer。"}'::jsonb, '2026-05-31T16:48:00Z'),
('r08', '{"name":"吴佳怡","role":"产品经理","stage":"rejected","owner":"周扬","email":"jiayi.wu@example.com","notes":"方向不匹配。"}'::jsonb, '2026-05-24T09:00:00Z'),
('r09', '{"name":"黄俊杰","role":"数据分析师","stage":"interviewing","owner":"李娜","email":"junjie.huang@example.com","notes":"SQL 实测通过，约终面。"}'::jsonb, '2026-06-01T13:22:00Z'),
('r10', '{"name":"徐若曦","role":"前端工程师","stage":"screening","owner":"孙琪","email":"ruoxi.xu@example.com","notes":"React 经验 3 年，待约。"}'::jsonb, '2026-05-23T17:10:00Z'),
('r11', '{"name":"Daniel Kim","role":"运维工程师","stage":"interviewing","owner":"周扬","email":"daniel.kim@example.com","notes":"K8s 背景，二面中。"}'::jsonb, '2026-06-01T10:05:00Z'),
('r12', '{"name":"郑雅文","role":"市场专员","stage":"screening","owner":"孙琪","email":"yawen.zheng@example.com","notes":"应届，潜力不错。"}'::jsonb, '2026-05-22T11:35:00Z')
on conflict (id) do nothing;
