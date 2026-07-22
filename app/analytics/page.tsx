import { PageHeader } from "@/components/PageHeader";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { getAnalyticsData } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Interactive factory and shop analytics with filters, KPIs, charts, low-stock alerts, transfer trends, and export-ready tables."
      />
      <AnalyticsDashboard data={data} />
    </>
  );
}
