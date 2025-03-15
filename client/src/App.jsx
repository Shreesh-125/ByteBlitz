import { Route, Routes } from "react-router-dom";
import Contests from "./pages/Contests";
import Ranking from "./pages/Ranking";
import Problems from "./pages/Problems";
import Home from "./pages/Home";
import Navbar from "./ui/Navbar";
import Problempage from "./pages/Problempage";
import ProblemAllSubmissionsPage from "./pages/ProblemAllSubmissionsPage";


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
      </Routes>
    </>
  );
}

export default App;
