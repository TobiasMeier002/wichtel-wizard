import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home }      from './components';
import Dashboard     from './components/dashboard/dashboard'
import Create        from './components/create/create'
import Edit          from './components/edit/edit'
import UserDataForm  from './components/userdata/userdata'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard/:userId" element={<Dashboard />} />
        <Route path="/addEvent/:userId" element={<Create />} />
        <Route path="/userconfirmed" element={<div> <h1>Your account has been confirmed! <a href="/">Login now</a></h1></div>} />

        <Route path="/confirm/:email/:confirmUri" element={<UserDataForm />} />

        <Route path="/confirmed" element={<div> <h1>Your invitation was accepted! <a href="/">Login now</a></h1></div>} />
        <Route path="/declined" element={<div> <h1>Your invitation was declined! If you change your mind you can always <a href="/">create an account</a></h1></div>} />

        <Route path="/editEvent/:userId/:eventId" element={<Edit />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;