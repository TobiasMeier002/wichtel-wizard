import React, { useState } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { useNavigate, useParams } from 'react-router-dom';

const Create = () => {
  const [name, setName] = useState('');
  const [pricelimit, setPriceLimit] = useState('');
  const [eventdate, setEventDate] = useState('');
  const [message, setMessage] = useState('');
  const [eventid, setEventId] = useState('');
  const [showLabelCreated, setShowLabelCreated] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const { userId } = useParams();
  let creatoruserid = userId;

  const handleCreateEvent = async (e) => {
    navigate(`/event/create/${userId}`);
  }

  const handleBacktoDashboard = async (e) => {
    navigate(`/dashboard/${userId}`);
  }

  const handleEventDetailLink = async (e) => {
    navigate(`/editEvent/${userId}/${eventid}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(config.api_url + 'events/register', { name, creatoruserid, pricelimit, eventdate });

      if (response.data && response.data.eventid) {
        setEventId(response.data.eventid);
        setShowLabelCreated(true);
      }

      setMessage(response.data.message);
      setIsError(false);

    } catch (error) {
      setMessage(error.request.response);
      setIsError(true);
    }
  };

  return (
    <div>
      {showLabelCreated ? (
        <>
          <div className="info-label">Your event has been created! Edit your event to add participants</div>

          <div className="info-container">
            <button onClick={handleEventDetailLink}>Edit Event</button>

            <button onClick={() => handleBacktoDashboard ()}>
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"/></svg>
              Dashboard</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => handleBacktoDashboard ()}>
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"/></svg>
            Dashboard</button>

          <h1>Create event</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Event name"
              required
            />

            <input
              type="number"
              value={pricelimit}
              onChange={(e) => setPriceLimit(e.target.value)}
              placeholder="Price limit"
              required
            />

            <input
              type="date"
              value={eventdate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />

            <button type="submit">Create Event</button>
          </form>
          {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
        </>
      )}
    </div>
  );
};

export default Create;