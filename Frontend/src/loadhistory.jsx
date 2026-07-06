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

// function for load history (loads a list of past deliveries)
function PastDeliveries() {

    // stores the list of delivered loads
    const [deliveredLoads, setDeliveredLoads] = useState([])

    //function for getting deliveries from database
    useEffect(() => {
        async function fetchDeliveredLoads() {
            const {data} = await supabase
                .from("loads")
                .select("*, drivers(first_name, last_name)")
                .eq("status", "Delivered")
            if(data) setDeliveredLoads(data)
        }
        fetchDeliveredLoads()
    }, [])

    //fields for seeing list of past deliveries
    return (
       
        <div style={{
            background: COLORS.white, 
            padding: "24px",
            textAlign: "center" 
        }}>

            <h2 style={{ 
                color: COLORS.navy, 
                marginBottom: "16px" 
            }}>Delivery History</h2>

            <table style = {{
                width: "100%",
                borderCollapse: "collapse" 
                }}>

                <thead>
                    <tr style={{
                        background: COLORS.navy,
                        color: COLORS.white }}>
                        
                        <th style={{ 
                            padding: "10px",
                            textAlign: "left" 
                            }}>Load ID
                        </th>

                        <th style={{
                            padding: "10px",
                            textAlign: "left" 
                            }}>Driver
                        </th>

                        <th style={{
                            padding: "10px",
                            textAlign: "left" 
                            }}>Pickup
                        </th>

                        <th style={{
                            padding: "10px",
                            textAlign: "left"
                            }}>Delivery
                        </th>

                        <th style={{ 
                            padding: "10px",
                            textAlign: "left"
                            }}>Date
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {deliveredLoads.map(load => (
                        <tr key={load.load_id} style={{
                            borderBottom: "1px solid #ddd" 
                            }}>
                            
                            <td style={{
                                padding: "11px"
                                }}>LD{load.load_id}
                            </td>

                            <td style={{
                                padding: "11px"
                                }}>{load.drivers.first_name} {load.drivers.last_name}
                            </td>

                            <td style={{
                                padding: "11px"
                                }}>{load.pickup_location}
                            </td>
                           
                            <td style={{
                                padding: "11px"
                                }}>{load.delivery_location}
                            </td>

                            <td style={{
                                padding: "11px"
                                }}>{load.date}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

//exportable for customer loads page
export default PastDeliveries