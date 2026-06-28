import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { supabase } from '../supabase_client.js';
import "./Login.css"

export default function Login() {
	const [signUp, setSignUp] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ type: '', text: '' });
	const navigate = useNavigate();

	const handleAuth = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage({ type: '', text: '' });
		try {
			if (signUp) {// check if sign up 
				const { data, error } = await supabase.auth.signUp({ email, password });// send api call to supabase to handle sign up 
				if (error) {
					throw error;
				}
				setMessage({ type: 'success', text: 'Success! Check your email for a confirmation.' }); // check email to login after signing up 
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password }); // sign in and supabase checks the users table to then manage the auth 
				if (error) {
					throw error;
				}
				setMessage({ type: 'success', text: 'Logged in successfully!' });
				navigate("/dashboard")
				// navigates to the login table page once the user has successfully logged in
				// TODO make a home page for the user to go to after logging in
				// TODO add a way for the user to signup, by inputting credentials
				navigate("/table")

			}
		} catch (error) {
			setMessage({ type: 'error', text: error.message });
		} finally {
			setLoading(false);
		}
	};

	return (

		<div className='login-container'>
			<div className='login-card'>
				<h2 className='login-title'>
					{signUp ? 'Sign Up' : 'Log In'}
				</h2>
				{message.text && (
					<div className={`message ${message.type}`}>
						{message.text}
					</div>
				)}
				<form onSubmit={handleAuth} className='login-form'>
					<div className='form-group'>
						<label>Email Address </label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="******@example.com"
							required
						/>
					</div>
					<div className='form-group'>
						<label>Password </label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="*********"
							required
						/>
					</div>
					<button type="submit" disabled={loading}>
						{loading ? 'Processing...' : signUp ? 'Sign Up' : 'Log In'}
					</button>
				</form>

				<p className='toggle-text'>
					{!signUp ? 'No Account? ' : " Have Account? "}
					<span
						onClick={() => {
							setSignUp(!signUp);
							setMessage({ type: '', text: '' });
						}}
					>
						{!signUp ? 'Sign Up' : 'Log In '}
					</span>
				</p>
			</div>
		</div >
	);
}
