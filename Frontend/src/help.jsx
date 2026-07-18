// import react + faq

import React from 'react'
import FAQ from './faq'

// brand colors
const COLORS = {
  navy: "#0B3C5D",
  red: "#D9534F",
  dark: "#323232",
  white: "#FFFFFF",
}

// function that displays help page (FAQ section and ask a question form)
function Help() {
    
    return (
        <div style = {{
            padding: "24px"
        }}>

            <h2>Help</h2>

            <FAQ />

        </div>
    )
}

// exportable for other pages
export default Help