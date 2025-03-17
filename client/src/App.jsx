import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Profilepage from './pages/Profilepage'
import Allsubmissionpage from './pages/Allsubmissionpage';
import Conteststandingpage from './pages/Conteststandingpage';
import Home from './pages/Home';
import Contestproblempage from './pages/Contestproblempage';
import Particularblog from './pages/Particularblog';
import Allblogs from './pages/Allblogs';
const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Home/>} />
        <Route path="/contests" element={<Contestproblempage/>} />
        <Route path="/problems" element={<Contestproblempage/>} />
        <Route path="/ranking" element={<Allsubmissionpage/>} />
        <Route path="/blogs" element={<Allblogs/>} />
        <Route path="/submissions" element={<Home/>} />
        <Route path="/profile" element={<Profilepage/>} />
        <Route path="/My_Friends" element={<Profilepage/>} />
        <Route path="/settings" element={<Profilepage/>} />
        <Route path="/standings" element={<Conteststandingpage />} />
        <Route path="/contestproblems" element={<Contestproblempage/>} />
        <Route path="/blogs/:id" element={<Particularblog />} />
      </Routes>
    </Router>
  );
};

export default App;