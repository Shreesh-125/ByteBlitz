import { Route, Routes } from "react-router-dom";
import Contests from "./pages/Contests";
import Ranking from "./pages/Ranking";
import Problems from "./pages/Problems";
import Home from "./pages/Home";
import Navbar from "./ui/Navbar";
import Problempage from "./pages/Problempage";
import ProblemAllSubmissionsPage from "./pages/ProblemAllSubmissionsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import ForgotPassword from "./pages/ForgotPassword"

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/contests' element={<Contests/>}/>
        <Route path='/ranking' element={<Ranking/>}/>
        <Route path='/problems' element={<Problems/>}/>
        <Route path='/problems/20' element={<Problempage/>}/>
        <Route path='/problems/20/submissions' element={<ProblemAllSubmissionsPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
      </Routes>
    </>
  );
}

export default App;