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

            <div style={{
                marginTop: "24px",
                textAlign: "right"
            }}>
                <button style={{
                    background: COLORS.red,
                    color: COLORS.white,
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px"
                }}>
                    Ask a Question
                </button>

            </div>

            {faqs.map(faq => (

                <div
                    key={faq.id}
                    style={{
                        marginTop: "41px",
                        display: "flex",
                        gap: "24px",
                        marginBottom: "20px", 
                        padding: "16px", 
                        background: "#f5f5f5", 
                        borderRadius: "4px"
                    }}
                >
                    <p style={{
                        color: COLORS.navy, 
                        fontWeight: "bold",
                        width: "40%",
                        flexShrink: 0,
                        margin: 0,
                        fontSize: "14px"
                        }}>{faq.question}</p>

                    <p style={{ 
                        margin: 0,
                        color: COLORS.dark,
                        fontSize: "16px"
                    }}>{faq.answer}</p>
                
                </div>
            ))}

        </div>
    )
}

//exportable for other pages
export default FAQ