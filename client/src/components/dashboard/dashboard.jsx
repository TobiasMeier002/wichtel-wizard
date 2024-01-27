import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { useNavigate, useParams } from 'react-router-dom';

const Dashboard = () => {
  const [events, setEvents] = useState([]); // State to store the events
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleCreateEvent = () => {
    navigate(`/addEvent/${userId}`);
  }

  const fetchUserEvents = async () => {
    try {
      const response = await axios.get(`${config.api_url}/${userId}/getEvents`);
      setEvents(response.data);

      setIsError(false);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "An error occurred");
      setIsError(true);
    }
  };

  const handleEditEvent = (eventId) => {
    navigate(`/editEvent/${userId}/${eventId}`);
  };

  useEffect(() => {
    fetchUserEvents();
  }, [userId]);

  return (
    <div>
      <h1>My Wichtel Wizard Events</h1>

      {events.length > 0 && (
        <p className="message">Create or edit events that are not assigned yet.</p>
      )}

      {events.length > 0 ? (
        events.map((event, index) => (
          <div className={`single-event ${event.eventstatus === "assigned" ? "assigned" : ""}`} key={index}>
            <h3>{event.Eventname}</h3>
            {event.receiver_name && <p>Your Wichtel is: {event.receiver_name}</p>}

            {event.eventstatus !== "assigned" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                onClick={() => handleEditEvent(event.eventid)}
              >
                <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/>
              </svg>
            )}
          </div>
        ))
      ) : (
        <div className="message"><p>No events found</p></div>
      )}

      <button onClick={handleCreateEvent}>Create New Event</button>

      {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
};

export default Dashboard;
