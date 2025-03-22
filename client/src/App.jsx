import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './ui/Navbar';
import Profilepage from './pages/Profilepage'
import Allsubmissionpage from './pages/Allsubmissionpage';
import Conteststandingpage from './pages/Conteststandingpage';
import Contestproblempage from './pages/Contestproblempage';
import Particularblog from './pages/Particularblog';
import Allblogs from './pages/Allblogs';
import Contests from "./pages/Contests";
import Ranking from "./pages/Ranking";
import Problems from "./pages/Problems";
import Home from "./pages/Home";
import Problempage from "./pages/Problempage";
import ProblemAllSubmissionsPage from "./pages/ProblemAllSubmissionsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/*" element={<Home/>} />
        <Route path="/contests/problems" element={<Contestproblempage/>} />
        <Route path="/ranking" element={<Allsubmissionpage/>} />
        <Route path="/blogs" element={<Contestproblempage/>} />
        <Route path="/profile" element={<Profilepage/>} />
        <Route path="/My_Friends" element={<Profilepage/>} />
        <Route path="/settings" element={<Profilepage/>} />
        <Route path="/standings" element={<Conteststandingpage />} />
        <Route path="/contestproblems" element={<Contestproblempage/>} />
        <Route path="/blogs/:id" element={<Particularblog />} />
          
        <Route path='/contests' element={<Contests/>}/>
        <Route path='/problems' element={<Problems/>}/>
        <Route path='/problems/20' element={<Problempage/>}/>
        <Route path='/problems/20/submissions' element={<ProblemAllSubmissionsPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
      </Routes>
    </Router>
  );
};

export default App;