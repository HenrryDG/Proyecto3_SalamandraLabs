import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Inicio"
        description="Página de inicio"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* Métricas generales */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Métricas</h3>
          <EcommerceMetrics />

          {/* Ventas mensuales */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Ventas mensuales</h3>
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* Objetivo mensual */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Objetivo mensual</h3>
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          {/* Gráfica de estadísticas */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Estadísticas</h3>
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* Tarjeta demográfica */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Demografía</h3>
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          {/* Órdenes recientes */}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Órdenes recientes</h3>
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
