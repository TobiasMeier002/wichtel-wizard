import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { useNavigate, useParams } from 'react-router-dom';

const UserDataForm = () => {
  const [password, setPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [lastname, setLastname] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const { email, confirmUri } = useParams();

  const emailConfirmed = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(config.api_url + 'updateUser', { email, password, surname, lastname, confirmUri, emailConfirmed});
      setMessage(response.data.message);
      setIsError(false);
    } catch (error) {
      setMessage(error.response.data);
      setIsError(true);
    }
  };

  return (
    <div className="form-root register">
      <h1>Finish setting up your account for {email}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Surname"
          required
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Lastname"
          required
        />

        <button type="submit">Register</button>
      </form>
      {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
};

export default UserDataForm;
