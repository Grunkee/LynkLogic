//import react + supabase

import React, { useState } from 'react'
import { supabase } from './supabase_client'

//function for assigning loads
function AssignLoad({ onClose }) {

    const [truckDriver, setTruckDriver] = useState("")
    const [pickupLocation, setPickupLocation] = useState("")
    const [deliveryLocation, setDeliveryLocation] = useState("")
    const [status, setStatus] = useState("")
    const [date, setDate] = useState("")

    //function for submit button
    async function submitButton() {

        //save values to supabase
        const { error } = await supabase
            .from("loads")
            .insert({
                driver_id: truckDriver,
                pickup_location: pickupLocation,
                deliver_location: deliveryLocation,
                status: status,
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
            if (onClose) onClose()
        }
    }

    //fields for submitting new load
    return (
        <div>
            <h2>Assign New Load</h2>
            <input
                placeholder="Truck Driver Name"
                value={truckDriver}
                onChange={(e) => setTruckDriver(e.target.value)}
            />
            <input
                placeholder="Pickup Location"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
            />
            <input
                placeholder="Delivery Location"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
            />
            <input
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            />
            <input
                placeholder="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={submitButton}>
                Add Load
            </button>
        </div>
    )
}

//exportable for loadtable page
export default AssignLoad