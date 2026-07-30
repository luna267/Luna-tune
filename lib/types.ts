export type FieldType = "text" | "longtext" | "number" | "date" | "status";

export type StatusTone = "neutral" | "active" | "positive" | "negative";

export interface StatusOption {
  value: string;
  label: string;
  tone: StatusTone;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  /** Show this field as a column in the main list. */
  inList?: boolean;
  required?: boolean;
  options?: StatusOption[];
  /** Optional placeholder for the edit form. */
  placeholder?: string;
}

export type RecordData = Record<string, string | number | null>;

export interface RecordRow {
  id: string;
  data: RecordData;
  updatedAt: string;
}
