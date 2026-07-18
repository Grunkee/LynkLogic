//import react + supabase

import React, { useState, useEffect } from 'react'
import { supabase } from './supabase_client'

// brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
}

// function for faq section under help page
function FAQ() {

    // stores the list of questions
    const [faqs, setFAQS] = useState([])

    //function for getting deliveries from database
    useEffect(() => {
        async function fetchFAQS() {
            const {data} = await supabase
                .from("faq")
                .select("*")
            if(data) setFAQS(data)
        }
        fetchFAQS()
    }, [])

    //display of FAQ section

    return (

        <div style={{
            padding: "24px"
        }}>

            <h2 style={{
                color: COLORS.navy
            }}>Frequently Asked Questions</h2>

            {faqs.map(faq => (
                <div
                    key={faq.id}
                    style={{
                        marginBottom: "20px", 
                        padding: "16px", 
                        background: "#f5f5f5", 
                        borderRadius: "4px"
                    }}
                >
                    <p style={{
                        color: COLORS.navy, 
                        fontWeight: "bold" 
                        }}>{faq.question}</p>

                    <p>{faq.answer}</p>
                
                </div>
            ))}
        </div>
    )
}

//exportable for other pages
export default FAQ