//import react + supabase

import React, { useState, useEffect } from 'react'
import { supabase } from './supabase_client'

// brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
};

//function for assigning loads
function AssignLoad({ onClose }) {

    const [truckDriver, setTruckDriver] = useState("")
    const [pickupLocation, setPickupLocation] = useState("")
    const [deliveryLocation, setDeliveryLocation] = useState("")
    const [date, setDate] = useState("")
    const [listOfDrivers, setListOfDrivers] = useState([])

    //function for getting drivers from database
    useEffect(() => {
        async function fetchDrivers() {
            const {data} = await supabase
                .from("drivers")
                .select("driver_id, first_name, last_name")
            if(data) setListOfDrivers(data)
        }
        fetchDrivers()
    }, [])

    //function for submit button
    async function submitButton() {

        //save values to supabase
        const { error } = await supabase
            .from("loads")
            .insert({
                driver_id: truckDriver,
                pickup_location: pickupLocation,
                delivery_location: deliveryLocation,
                status: "Pending",
                date: date
            })

        //errors, alert when something goes wrong
        if (error) {
            console.error(error)
            alert("Please try again. Something went wrong.")
        }

        //no errors, alert the load was assigned, then close the popup
        else {
            alert("The new load was assigned.")
            onClose()
        }
    }

    //fields for submitting new load
    return (
       
        <div style={{
            background: COLORS.white, 
            padding: "24px",
            textAlign: "center" 
        }}>

            <h2 style={{ 
                color: COLORS.navy, 
                marginBottom: "16px" 
            }}>Assign New Load</h2>

            <select
                value={truckDriver}
                onChange={(e) => setTruckDriver(e.target.value)}
                style={{ 
                    display: "block", 
                    width: "100%", 
                    padding: "10px", 
                    marginBottom: "12px", 
                    margin: "0 auto 12px auto",
                    border: `1px solid ${COLORS.navy}`, 
                    borderRadius: "4px", 
                    fontSize: "14px", 
                    color: COLORS.dark, 
                    background: COLORS.white,
                    boxSizing: "border-box"
                }}
            >
                <option value="">Choose Driver</option>
                {listOfDrivers.map(driver => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                        {driver.first_name} {driver.last_name}
                    </option>

                ))}
            </select>

            <input
                placeholder="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                style={{ 
                    display: "block", 
                    width: "100%", 
                    padding: "10px", 
                    marginBottom: "12px", 
                    border: `1px solid ${COLORS.navy}`, 
                    borderRadius: "4px", 
                    fontSize: "14px", 
                    color: COLORS.dark, 
                    background: COLORS.white,
                    boxSizing: "border-box" 
                }}
            />

            <input
                placeholder="Delivery Location"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                style={{ 
                    display: "block", 
                    width: "100%", 
                    padding: "10px", 
                    marginBottom: "12px", 
                    border: `1px solid ${COLORS.navy}`, 
                    borderRadius: "4px", 
                    fontSize: "14px", 
                    color: COLORS.dark, 
                    background: COLORS.white,
                    boxSizing: "border-box" 
                }}
            />

            <input
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ 
                    display: "block", 
                    width: "100%", 
                    padding: "10px", 
                    marginBottom: "12px", 
                    border: `1px solid ${COLORS.navy}`, 
                    borderRadius: "4px", 
                    fontSize: "14px", 
                    color: COLORS.dark, 
                    background: COLORS.white,
                    boxSizing: "border-box" 
                }}
            />

            <button
                onClick={submitButton}
                style = {{
                    background: COLORS.red, 
                    color: COLORS.white, 
                    padding: "10px 20px", 
                    border: "none", 
                    cursor: "pointer", 
                    borderRadius: "4px", 
                    fontSize: "14px", 
                }}
            
            >
                Add Load
            </button>

        </div>
    )
}

//exportable for loadtable page
export default AssignLoad