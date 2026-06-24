import React, { useState } from 'react';
import { supabase } from '../supabase_client.js';

export default function Login() {
  const [signUp, setSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
        if (error){ 
            throw error;
        }
        setMessage({ type: 'success', text: 'Logged in successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>{signUp ? 'Sign Up' : 'Log In'}</h2>
        {message.text && (
          <div>
            {message.text}
          </div>
        )}
        <form onSubmit={handleAuth}>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="******@example.com"
              required
            />
          </div>
          <div>
            <label>Password</label>
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

        <p>
          {signUp ? 'No account? ' : " Have account?"}
          <span 
            onClick={() => {
              setSignUp(!signUp);
              setMessage({ type: '', text: '' });
            }}
          >
            {signUp ? 'Sign Up' : ' Log In '}
          </span>
        </p>
      </div>
    </div>
  );
}
