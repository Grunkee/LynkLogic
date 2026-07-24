import { useEffect, useState } from "react";
import { supabase } from "../supabase_client";
import "./DriverPerformance.css";
import {
  User,
  Clock3,
  Truck,
  CircleCheckBig,
  Search
} from "lucide-react";

// Brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
};

function DriverPerformance() {

  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDrivers();
  }, []);


  async function loadDrivers() {

    const { data, error } = await supabase
      .from("driver_hours")
      .select("*");


    if (error) {
      console.log(error);
      return;
    }

    setDrivers(data);
  }


return (
  <div className="dashboard">

<div className="page-title">

  <div>
    <h1>Driver Performance Dashboard</h1>

    <p>
      Monitor delivery performance across your fleet.
    </p>

  </div>

</div>

    <div className="stats">

      <div className="card">
        <h3>Total Drivers</h3>
        <h2>{drivers.length}</h2>
      </div>

      <div className="card">
        <h3>Total Hours</h3>
        <h2>
          {drivers.reduce((sum, d) => sum + d.hours, 0)}
        </h2>
      </div>

      <div className="card">
        <h3>Routes Completed</h3>
        <h2>
          {drivers.reduce((sum, d) => sum + d.completed_routes, 0)}
        </h2>
      </div>

      <div className="card">
        <h3>Delayed Drivers</h3>
        <h2>
          {
            drivers.filter(
              d => d.delivery_status === "Delayed"
            ).length
          }
        </h2>
      </div>

    </div>

    <div className="table-card">

      <div className="table-header">

        <h2>Driver Performance</h2>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      <table>

<thead>

<tr>

    <th>
        <div className="table-heading">
            <User size={18} />
            <span>Driver</span>
        </div>
    </th>

    <th>
        <div className="table-heading">
            <Clock3 size={18} />
            <span>Hours</span>
        </div>
    </th>

    <th>
        <div className="table-heading">
            <Truck size={18} />
            <span>Routes</span>
        </div>
    </th>

    <th>
        <div className="table-heading">
            <CircleCheckBig size={18} />
            <span>Status</span>
        </div>
    </th>

</tr>

</thead>

        <tbody>

          {drivers
            .filter(driver =>
              Object.values(driver)
                .join(" ")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((driver) => (

            <tr key={driver.id}>

              <td>{driver.driver_name}</td>

              <td>{driver.hours}</td>

              <td>{driver.completed_routes}</td>

              <td>

                <span
                  className={
                    driver.delivery_status === "Completed"
                      ? "badge completed"
                      : "badge delayed"
                  }
                >
                  {driver.delivery_status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
);
}

export default DriverPerformance;
