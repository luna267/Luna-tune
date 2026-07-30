import { listRecords } from "@/lib/records";
import { Ledger } from "./ledger-client";

export const dynamic = "force-dynamic";

export default async function Page() {
  const gated = Boolean(process.env.ACCESS_TOKEN);
  try {
    const records = await listRecords();
    return <Ledger initialRecords={records} gated={gated} initialError={null} />;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "加载失败";
    return <Ledger initialRecords={[]} gated={gated} initialError={msg} />;
  }
}
