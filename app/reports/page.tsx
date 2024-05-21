
import { DonutChartHero } from "@/components/dashboard/DonutChartHero";
import LineChart from "@/components/dashboard/LineChart";

export default function Reports() {
  return (
    <div className="w-full h-full">
      <LineChart />
      <DonutChartHero />
    </div>
    
  );
}