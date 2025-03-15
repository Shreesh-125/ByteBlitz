import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Main from './Components/Main/Main';
import Profilepage from './Profilepage'
import Allsubmissionpage from './AllSubmissionpage/Allsubmissionpage';
import Conteststandingpage from './Conteststandingpage/Conteststandingpage';
const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/contests" element={<Main />} />
        <Route path="/problems" element={<Conteststandingpage />} />
        <Route path="/ranking" element={<Allsubmissionpage/>} />
        <Route path="/blogs" element={<Main />} />
        <Route path="/submissions" element={<Main/>} />
        <Route path="/profile" element={<Profilepage/>} />
        <Route path="/My_Friends" element={<Profilepage/>} />
        <Route path="/settings" element={<Profilepage/>} />
      </Routes>
    </Router>
  );
};

export default App;
``