import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(config.api_url + 'login', { email, password });
      setMessage(response.data.message);
      setIsError(false);

      if (response.data.message === 'confirmation needed') {
        setMessage("You need to confirm your e-mail");
      } else {
        navigate(`/dashboard/${response.data.userid}`);
      }

    } catch (error) {
      setMessage(error.request.response);
      setIsError(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>
      {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
};

export default LoginForm;