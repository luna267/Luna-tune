import { entity } from "@/lib/entity";
import { t } from "@/lib/strings";

export default function LockedPage() {
  return (
    <main className="locked">
      <div className="locked-card">
        <div className="mark" aria-hidden />
        <h1>{t.lockedTitle}</h1>
        <p>
          {entity.appName} · {entity.department}
        </p>
        <p>{t.lockedBody}</p>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.82rem" }}>{t.lockedHint}</p>
        <code>https://your-app.vercel.app/?key=••••••••••••</code>
      </div>
    </main>
  );
}
