"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { entity, listFields, statusOption } from "@/lib/entity";
import { t } from "@/lib/strings";
import type { FieldDef, RecordData, RecordRow } from "@/lib/types";

const PRIMARY_KEY = entity.fields[0].key;
const STATUS_FIELD = entity.fields.find((f) => f.type === "status");

type Mode = "view" | "edit" | "create";

function stamp(iso: string): string {
  // Deterministic (UTC) so server and client render identically.
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

function blankForm(): RecordData {
  const data: RecordData = {};
  for (const f of entity.fields) {
    data[f.key] = f.type === "status" && f.options?.length ? f.options[0].value : "";
  }
  return data;
}

function StatusCell({ fieldKey, value }: { fieldKey: string; value: string | number | null }) {
  const opt = statusOption(fieldKey, value);
  if (!opt) return <span className="empty-cell">—</span>;
  return (
    <span className={`status ${opt.tone}`}>
      <span className="dot" aria-hidden />
      {opt.label}
    </span>
  );
}

export function Ledger({
  initialRecords,
  gated,
  initialError,
}: {
  initialRecords: RecordRow[];
  gated: boolean;
  initialError: string | null;
}) {
  const [records, setRecords] = useState<RecordRow[]>(initialRecords);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("view");
  const [active, setActive] = useState<RecordRow | null>(null);
  const [form, setForm] = useState<RecordData>(blankForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/records", { cache: "no-store" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? t.loadError);
      setRecords(body.records);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    setFormError(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  const openView = (r: RecordRow) => {
    setActive(r);
    setMode("view");
    setForm({ ...r.data });
    setFormError(null);
    setOpen(true);
  };
  const openEdit = () => {
    if (!active) return;
    setForm({ ...active.data });
    setMode("edit");
  };
  const openCreate = () => {
    setActive(null);
    setForm(blankForm());
    setMode("create");
    setFormError(null);
    setOpen(true);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (STATUS_FIELD && statusFilter && r.data[STATUS_FIELD.key] !== statusFilter) return false;
      if (!q) return true;
      return entity.fields.some((f) => {
        if (f.type === "status") {
          const opt = statusOption(f.key, r.data[f.key]);
          return opt?.label.toLowerCase().includes(q);
        }
        return String(r.data[f.key] ?? "").toLowerCase().includes(q);
      });
    });
  }, [records, query, statusFilter]);

  async function save() {
    const missing = entity.fields.filter((f) => f.required && !String(form[f.key] ?? "").trim());
    if (missing.length) {
      setFormError(`${missing.map((f) => f.label).join("、")} ${t.required}`);
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const isCreate = mode === "create";
      const res = await fetch(isCreate ? "/api/records" : `/api/records/${active!.id}`, {
        method: isCreate ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: form }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? t.saveError);
      await refetch();
      if (isCreate) {
        closePanel();
      } else {
        setActive(body.record);
        setMode("view");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!active) return;
    if (!window.confirm(t.deleteConfirm)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/records/${active.id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? t.deleteError);
      await refetch();
      closePanel();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.deleteError);
    } finally {
      setSaving(false);
    }
  }

  const editing = mode === "edit" || mode === "create";
  const panelTitle =
    mode === "create" ? t.newRecordTitle : String(active?.data[PRIMARY_KEY] ?? entity.entityName);

  return (
    <div className="shell">
      <header className="topbar">
        <h1>{entity.appName}</h1>
        <span className="dept">{entity.department}</span>
        <span className="spacer" />
        {gated && (
          <form action="/api/signout" method="post">
            <button className="btn-text" type="submit">
              {t.signOut}
            </button>
          </form>
        )}
      </header>

      {error && (
        <div className="banner" role="alert">
          <span className="dot" aria-hidden />
          <span className="msg">
            {t.loadError}：{error}
          </span>
          <button className="btn-ghost" onClick={refetch}>
            {t.retry}
          </button>
        </div>
      )}

      <main className="canvas">
        <div className="ledger">
          <div className="filters">
            <div className="field grow">
              <label htmlFor="q">{t.search}</label>
              <input
                id="q"
                className="input"
                placeholder={t.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {STATUS_FIELD && (
              <div className="field">
                <label htmlFor="sf">{STATUS_FIELD.label}</label>
                <select
                  id="sf"
                  className="select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">{t.allStatuses}</option>
                  {STATUS_FIELD.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <span className="count">{t.recordCount(filtered.length)}</span>
            <button className="btn-primary" onClick={openCreate}>
              {t.newRecord}
            </button>
          </div>

          {loading && records.length === 0 ? (
            <SkeletonTable />
          ) : filtered.length === 0 ? (
            <div className="empty">
              <h2>{t.emptyTitle}</h2>
              <p>{records.length === 0 ? t.emptyBody : "没有匹配的记录，换个关键字或状态试试。"}</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="ledger-table">
                <thead>
                  <tr>
                    {listFields.map((f) => (
                      <th key={f.key}>{f.label}</th>
                    ))}
                    <th>{t.updatedAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className={active?.id === r.id && open ? "selected" : ""}
                      onClick={() => openView(r)}
                    >
                      {listFields.map((f) => (
                        <td key={f.key} className={f.key === PRIMARY_KEY ? "primary" : ""}>
                          <Cell field={f} value={r.data[f.key]} />
                        </td>
                      ))}
                      <td className="tnum">
                        <span className="muted">{stamp(r.updatedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <div className={`overlay ${open ? "open" : ""}`} onClick={closePanel} aria-hidden={!open} />
      <aside
        className={`panel ${open ? "open" : ""}`}
        role="dialog"
        aria-modal={open}
        aria-label={panelTitle}
      >
        <div className="panel-head">
          <h2>{panelTitle}</h2>
          {mode !== "create" && active && <span className="panel-meta tnum">{t.updatedAt} {stamp(active.updatedAt)}</span>}
        </div>

        <div className="panel-body">
          {entity.fields.map((f) =>
            editing ? (
              <FormField
                key={f.key}
                field={f}
                value={form[f.key]}
                onChange={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
              />
            ) : (
              <ReadField key={f.key} field={f} value={active?.data[f.key] ?? null} />
            )
          )}
          {formError && (
            <div className="banner" role="alert" style={{ margin: 0, padding: "0.75rem 1rem" }}>
              <span className="dot" aria-hidden />
              <span className="msg">{formError}</span>
            </div>
          )}
        </div>

        <div className="panel-foot">
          {editing ? (
            <>
              <button className="btn-primary" onClick={save} disabled={saving}>
                {saving ? t.saving : t.save}
              </button>
              <button
                className="btn-text"
                onClick={() => (mode === "create" ? closePanel() : setMode("view"))}
                disabled={saving}
              >
                {t.cancel}
              </button>
              <span className="spacer" />
              {mode === "edit" && (
                <button className="btn-danger" onClick={remove} disabled={saving}>
                  {t.delete}
                </button>
              )}
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={openEdit}>
                {t.edit}
              </button>
              <button className="btn-text" onClick={closePanel}>
                {t.close}
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function Cell({ field, value }: { field: FieldDef; value: string | number | null }) {
  if (field.type === "status") return <StatusCell fieldKey={field.key} value={value} />;
  const s = String(value ?? "").trim();
  if (!s) return <span className="empty-cell">—</span>;
  return field.key === PRIMARY_KEY ? <>{s}</> : <span className="muted">{s}</span>;
}

function ReadField({ field, value }: { field: FieldDef; value: string | number | null }) {
  return (
    <div className="field">
      <label>{field.label}</label>
      {field.type === "status" ? (
        <div style={{ paddingTop: "0.15rem" }}>
          <StatusCell fieldKey={field.key} value={value} />
        </div>
      ) : (
        <div
          style={{
            borderBottom: "1px solid var(--ghost)",
            paddingBottom: "0.5rem",
            color: String(value ?? "").trim() ? "var(--on-surface)" : "var(--outline-variant)",
            whiteSpace: field.type === "longtext" ? "pre-wrap" : "normal",
            lineHeight: 1.55,
          }}
        >
          {String(value ?? "").trim() || "—"}
        </div>
      )}
    </div>
  );
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | number | null;
  onChange: (v: string) => void;
}) {
  const v = value === null || value === undefined ? "" : String(value);
  return (
    <div className="field">
      <label htmlFor={`f-${field.key}`}>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      {field.type === "longtext" ? (
        <textarea
          id={`f-${field.key}`}
          className="textarea"
          placeholder={field.placeholder}
          value={v}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "status" ? (
        <select id={`f-${field.key}`} className="select" value={v} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={`f-${field.key}`}
          className="input"
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          placeholder={field.placeholder}
          value={v}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="table-wrap" aria-hidden>
      <table className="ledger-table">
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i}>
              {listFields.map((f) => (
                <td key={f.key}>
                  <div className="skeleton" style={{ width: `${50 + ((i * 7) % 40)}%` }} />
                </td>
              ))}
              <td>
                <div className="skeleton" style={{ width: "70%" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
