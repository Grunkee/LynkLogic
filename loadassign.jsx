//import react + supabase

import React, {useState} from 'react'
import {createClient} from '@supabase/supabase-js'

//connect to supabase
const supabase = createClient (process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

//function for assigning loads
function AssignLoad() {

    const[truckDriver, setTruckDriver] = useState("")
    const[pickupLocation, setPickupLocation] = useState("")
    const[deliveryLocation, setDeliveryLocation] = useState("")
    const[status, setStatus] = useState("")
    const[date, setDate] = useState("")

    //function for submit button
    async function submitButton() {

        //save values to supabase
        const{error} = await supabase
            .from("loads")
            .insert({ truck_driver: truckDriver,
                pickup_location: pickupLocation,
                delivery_location: deliveryLocation,
                status: status,
                date: date})
    
        //errors, alert when something goes wrong
        if (error) {
            alert("Please try again. Something went wrong.")
        }

        //no errors, alert the load was assigned
        else {
            alert("The new load was assigned.")
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
            <button onClick={submitButton} >
                Add Load
            </button>
        </div>
    )
}

//exportable for loadtable page
export default AssignLoad