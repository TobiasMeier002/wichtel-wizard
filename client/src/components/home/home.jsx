import React,{ useEffect, useState }     from 'react';
import axios                  from 'axios';
import RegistrationForm       from '../registration/registration'
import LoginForm              from '../login/login'

import '../../app.css'

export function Home() {
  const [view, setView] = useState('start');
  const [entryAnimation, setEntryAnimation] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(false);

  const changeView = (newView, isExiting) => {
    if (isExiting) {
      setExitAnimation(true);
      setTimeout(() => {
        setView(newView);
      }, 0);
    } else {
      setView(newView);
    }
  };

  useEffect(() => {
    if (view === 'register' || view === 'login') {
      setEntryAnimation(true);
      setTimeout(() => setEntryAnimation(false), 400); // Same here
    }
  }, [view]);

  let className = '';
  if (view === 'register') {
    className = 'register-animation';
  } else if (view === 'login') {
    className = 'login-animation';
  }
  if (entryAnimation) {
    className += ' animate-in';
  }
  if (exitAnimation) {
    className += ' animate-out';
  }

  if (view === 'start') {
    return (
      <div>
      <div className="header-login">
        <h1>Wichtel Wizard</h1>
      </div>

        <div className="login-wrapper form-root">
          <button type="submit" onClick={() => changeView('login', false)}>Login</button>
          <button type="submit" onClick={() => changeView('register', false)}>Register</button>
        </div>
        {/*<RegistrationForm/>*/}
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div className={className}>
        <button onClick={() => changeView('start', true)}>
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"/></svg>
          Home</button>

        <span className="header-wrapper">
          <h1>Create account</h1>
        </span>

        <RegistrationForm/>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className={className}>
        <button onClick={() => changeView('start', true)}>
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"/></svg>
          Home</button>

        <span className="header-wrapper">
        <h1>Login</h1>
      </span>

        <LoginForm/>
      </div>
    );
  }
}