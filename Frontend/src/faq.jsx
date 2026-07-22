// import react + supabase
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

    // stores the list of faqs
    const [faqs, setFAQS] = useState([])

    // controls whether the question form popup is open or closed
    const [showForm, setShowForm] = useState(false)

    // stores what the user types into the form
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [question, setQuestion] = useState("")

    // grab faqs from supabase when page loads
    useEffect(() => {
        async function fetchFAQS() {
            const { data } = await supabase
                .from("faq")
                .select("*")
            if (data) setFAQS(data)
        }
        fetchFAQS()
    }, [])

    // runs when user clicks submit — saves question to supabase
    async function handleSubmit() {

        // make sure all fields are filled in
        if (!name || !email || !question) {
            alert("Please fill in all fields.")
            return
        }

        // save to new_questions table in supabase
        const { error } = await supabase
            .from("new_questions")
            .insert({
                name: name,
                email: email,
                question: question
            })

        if (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } else {
            alert("Your question has been submitted!")
            // clear the form and close the popup
            setName("")
            setEmail("")
            setQuestion("")
            setShowForm(false)
        }
    }

    return (

        <div style={{ padding: "24px" }}>

            <h2 style={{ color: COLORS.navy }}>Frequently Asked Questions</h2>

            {/* ask a question button */}
            <div style={{ marginTop: "24px", textAlign: "right" }}>
                <button
                    onClick={() => setShowForm(true)}
                    style={{
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

            {/* faq list */}
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

            {/* question form popup — only shows when showForm is true */}
            {showForm && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.5)"
                }}>
                    <div style={{
                        background: COLORS.white,
                        width: "400px",
                        margin: "100px auto",
                        padding: "24px",
                        borderRadius: "4px",
                        position: "relative"
                    }}>

                        {/* close button */}
                        <button
                            onClick={() => setShowForm(false)}
                            style={{
                                position: "absolute",
                                right: 12, top: 12,
                                background: "none",
                                border: "none",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}>
                            ✕
                        </button>

                        <h3 style={{ color: COLORS.navy, marginBottom: "16px" }}>Ask a Question</h3>

                        {/* name field */}
                        <input
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: "4px" }}
                        />

                        {/* email field */}
                        <input
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "10px", marginBottom: "12px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: "4px" }}
                        />

                        {/* question field */}
                        <textarea
                            placeholder="Your Question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            rows={4}
                            style={{ width: "100%", padding: "10px", marginBottom: "16px", boxSizing: "border-box", border: "1px solid #ddd", borderRadius: "4px", resize: "none" }}
                        />

                        {/* submit button */}
                        <button
                            onClick={handleSubmit}
                            style={{
                                background: COLORS.red,
                                color: COLORS.white,
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px",
                                width: "100%"
                            }}>
                            Submit
                        </button>

                    </div>
                </div>
            )}

        </div>
    )
}

// exportable for other pages
export default FAQ