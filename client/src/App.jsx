import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./ui/Navbar";
import Profilepage from "./pages/Profilepage";
import Allsubmissionpage from "./pages/Allsubmissionpage";
import Conteststandingpage from "./pages/Conteststandingpage";
import Contestproblempage from "./pages/Contestproblempage";
import Particularblog from "./pages/Particularblog";
import Allblogs from "./pages/Allblogs";
import Contests from "./pages/Contests";
import Ranking from "./pages/Ranking";
import Problems from "./pages/Problems";
import Home from "./pages/Home";
import Problempage from "./pages/Problempage";
import ProblemAllSubmissionsPage from "./pages/ProblemAllSubmissionsPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import OauthLogin from "./pages/OuthLogin";
import ContestProblemDescriptionPage from "./pages/ContestProblemDescriptionPage";
import { SocketProvider } from "./context/SocketContext";
import ProblemDescription from "./pages/ProblemDescription";
import SubmissionList from "./pages/SubmissionsList";

// Create a QueryClient with global staleTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (300,000ms)
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/contests/:contestId/problems" element={<Contestproblempage />}>
              <Route path=":problemId" element={<ContestProblemDescriptionPage />} />
              {/* <Route path=":provlemId/submissions" element={<ProblemAllSubmissionsPage />} /> */}
          </Route>
          {/* <Route
            path="/contests/:contestId/problems/:problemId"
            element={<ContestProblemDescriptionPage />}
          /> */}
          <Route path="/ranking" element={<Allsubmissionpage />} />
          <Route path="/blogs" element={<Allblogs />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/My_Friends" element={<Profilepage />} />
          <Route path="/settings" element={<Profilepage />} />
          <Route path="/standings" element={<Conteststandingpage />} />
          <Route path="/contestproblems" element={<Contestproblempage />} />
          <Route path="/blogs/:id" element={<Particularblog />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:problemId" element={<Problempage />}>
            <Route index element={<ProblemDescription />} />
            <Route path="submissions" element={<SubmissionList/>} />
          </Route> 
          {/* <Route
            path="/problems/:problemId/submissions"
            element={<ProblemAllSubmissionsPage />}
          /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth" element={<OauthLogin />} />
        </Routes>
      </Router>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "14px",
            padding: "16px 24px",
            backgroundColor: "#ffffff",
            color: "#333333",
          },
        }}
      />
      </SocketProvider>
    </QueryClientProvider>
  );
}
export default App;
