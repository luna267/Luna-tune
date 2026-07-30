import type { FieldDef } from "./types";

/**
 * 改这一个文件，就能把模板换成你部门的登记表。
 *
 * - HR（默认）：候选人登记表
 * - 财务：把 entityName 改成 "报销"，fields 换成 申请人 / 金额(number) / 类别 / 状态 / 日期(date)
 * - 法务：把 entityName 改成 "合同"，fields 换成 对方 / 类型 / 签署日(date) / 到期日(date) / 状态
 *
 * 列表只显示 inList: true 的字段；详情面板显示全部字段。
 */
export const entity = {
  appName: "我的部门登记表",
  entityName: "候选人",
  department: "HR · 招聘",
  fields: [
    { key: "name", label: "姓名", type: "text", inList: true, required: true, placeholder: "张三" },
    { key: "role", label: "应聘职位", type: "text", inList: true, placeholder: "后端工程师" },
    {
      key: "stage",
      label: "阶段",
      type: "status",
      inList: true,
      options: [
        { value: "screening", label: "待筛选", tone: "neutral" },
        { value: "interviewing", label: "面试中", tone: "active" },
        { value: "offer", label: "已 Offer", tone: "positive" },
        { value: "rejected", label: "已婉拒", tone: "negative" },
      ],
    },
    { key: "owner", label: "面试官", type: "text", inList: true, placeholder: "李四" },
    { key: "email", label: "邮箱", type: "text", placeholder: "name@example.com" },
    { key: "notes", label: "备注", type: "longtext", placeholder: "一句话评价、下一步安排……" },
  ] satisfies FieldDef[],
};

export const listFields = entity.fields.filter((f) => f.inList);

export function statusOption(fieldKey: string, value: string | number | null) {
  const field = entity.fields.find((f) => f.key === fieldKey);
  if (!field || field.type !== "status" || !field.options) return null;
  return field.options.find((o) => o.value === value) ?? null;
}
