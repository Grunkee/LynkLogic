import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";
import "./AnalyticsDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

function ChartCard({ title, children }) {
  return (
    <div className="analytics-card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function AnalyticsDashboard() {
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [compliance, setCompliance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function fetchTable(table, setter) {
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.log(`${table} Error:`, error);
    } else {
      setter(data || []);
    }
  }

  async function loadDashboardData() {
    await Promise.all([
      fetchTable("route", setRoutes),
      fetchTable("driver_hours", setDrivers),
      fetchTable("compliance_items", setCompliance),
    ]);

    setLoading(false);
  }

  const routeChart = {
    labels: routes.map((route) => route.route_name),
    datasets: [
      {
        label: "Estimated Distance (KM)",
        data: routes.map((route) => route.estimated_distance),
        backgroundColor: "#0B3C5D",
      },
      {
        label: "Estimated Duration (Minutes)",
        data: routes.map((route) => route.estimated_duration),
        backgroundColor: "#D9534F",
      },
    ],
  };

  const driverChart = {
    labels: drivers.map((driver) => driver.driver_name),
    datasets: [
      {
        label: "Hours Worked",
        data: drivers.map((driver) => driver.hours),
        backgroundColor: "#0B3C5D",
      },
      {
        label: "Completed Routes",
        data: drivers.map((driver) => driver.completed_routes),
        backgroundColor: "#D9534F",
      },
    ],
  };

const statusCounts = drivers.reduce((counts, driver) => {
  const status = driver.delivery_status || "Unknown";

  counts[status] = (counts[status] || 0) + 1;

  return counts;
}, {});

const deliveryStatusChart = {
  labels: Object.keys(statusCounts),
  datasets: [
    {
      label: "Delivery Status",
      data: Object.values(statusCounts),
      backgroundColor: Object.keys(statusCounts).map((status) => {
        switch (status) {
          case "Completed":
            return "#5CB85C";

          case "Delayed":
            return "#D9534F";

          case "On Schedule":
            return "#0B3C5D";

          default:
            return "#F0AD4E";
        }
      }),
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

  const complianceCounts = compliance.reduce((counts, item) => {
    counts[item.kind] = (counts[item.kind] || 0) + 1;
    return counts;
  }, {});

  const complianceChart = {
    labels: Object.keys(complianceCounts),
    datasets: [
      {
        label: "Compliance Items",
        data: Object.values(complianceCounts),
        backgroundColor: [
          "#0B3C5D",
          "#D9534F",
          "#5CB85C",
          "#F0AD4E",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading Analytics Dashboard...</div>;
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>LynkLogic Analytics Dashboard</h1>
        <p>
          Monitor route efficiency, driver performance, and delivery
          operations.
        </p>
      </div>

      <div className="analytics-grid">
        <ChartCard title="Route Optimization">
          <Bar data={routeChart} options={chartOptions} />
        </ChartCard>

        <ChartCard title="Driver Performance">
          <Bar data={driverChart} options={chartOptions} />
        </ChartCard>

        <ChartCard title="Delivery Status">
          <Pie data={deliveryStatusChart} options={chartOptions} />
        </ChartCard>

        <ChartCard title="Compliance">
          <Pie data={complianceChart} />
        </ChartCard>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
