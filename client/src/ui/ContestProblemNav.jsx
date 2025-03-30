import React, { useEffect, useState } from "react";
import styles from "../styles/ProblemNav.module.css";
import { LANGUAGE_VERSION, languagetoIdMap } from "../utils/languagesConstants";
import { Link, useParams } from "react-router-dom";

import axios from "axios";

import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { submitCode } from "../servers/problem";
import toast from "react-hot-toast";
import { getVerdictMessage } from "../utils/ContestUtils";

const languages = Object.entries(LANGUAGE_VERSION);

const ContestProblemNav = ({
  language,
  onSelectLanguage,
  value,
  setIsExecuted,
  setTheme,
  setIsSubmitting,
  setHasSubmitted,
  isMobile,
  isEditor,
  setIsEditor,
  isSubmissionPage,
  customInput,
  setYourOutput,
  setIsSuccess,
  setSubmission
}) => {

  const {problemId,contestId}= useParams();
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const {socket,isRegister,isrunning}=useSocket(); 
  const user = useSelector((state) => state.auth.user);

  // Query for ended Contest Submit code
  const { refetch } = useQuery({
    queryKey: ["submitCode", { languageId: languagetoIdMap[language], value, problemId }],
    queryFn: () => submitCode({
      languageId: languagetoIdMap[language],
      value,
      problemId,
    }),
    enabled: false, // Prevent auto-execution
  });

  // code submission
  const handleSubmitCode = () => {
    if(isrunning && !isRegister){
      toast.error("You are not Registered,Cannot submit Code");
      return;
    }
    setIsSubmitting(true);
    setIsEditor(false);
    setIsSubmitting(true);
    setHasSubmitted("pending");

    if (socket) {
      const data = {
        problemId: problemId,
        code: value,
        language: language,
        userId: user._id,
        contestId: contestId,
      };
  
      socket.emit("submit_code", data);
      console.log("Code submitted");
      
  
      socket.on("see_output", (data) => {
        
        setSubmission(data);
        
        if (data?.status) {
          const verdict = data.status.id;
          const resultMessage = getVerdictMessage(verdict);
  
          setHasSubmitted(resultMessage);
        } else {
          setHasSubmitted("Error: Invalid Response");
        }
        setIsSubmitting(false);
      });
    } else {
      // Use the refetch function that was defined at the top level
     

      refetch().then(({ data }) => {
        console.log("Submission response:", data);
        setSubmission(data);
  
        if (data?.status) {
          const verdict = data.status.id;
          const resultMessage = getVerdictMessage(verdict);
  
          setHasSubmitted(resultMessage);
        } else {
          setHasSubmitted("Error: Invalid Response");
        }
        setIsSubmitting(false);
      }).catch((error) => {
        console.error("Submission error:", error);
        setHasSubmitted("Submission failed");
        setIsSubmitting(false);
      });
    }
  };
  

  // for custom testcase 
  const handleRunCode = async() => {
    setIsExecuted(false)
    try {
      const languagecode=languagetoIdMap[language];
      
    const response= await axios.post(`/api/v1/problem/customTestCase`,{ languagecode, value,customInput })
      
      setYourOutput(response.data.response.output);
      setIsSuccess(!response.data.response.isError)
      
    } catch (error) {
      console.log(error);
      setIsSuccess(false)
      setYourOutput("");
    } finally{
      setIsExecuted(true);
    }
    
  };

  const handleStatement=()=>{
    setIsEditor(false);
    setIsExecuted(null);
    setHasSubmitted('no');
  }

  return (
    <div className={styles.nav}>
      <div className={styles.leftNav}>
        <Link className={styles.linkStyle} to={`/contests/${contestId}/problems/${problemId}`}>
          <span onClick={handleStatement}>Statement</span>
        </Link>
        <Link className={styles.linkStyle} to={`/contest/${problemId}/submissions`}>
          <span onClick={() => setIsEditor(false)}>Submissions</span>
        </Link>
        {isMobile && isSubmissionPage === false ? (
          <Link className={styles.linkStyle} to={`/contest/${problemId}`}>
            <span onClick={() => setIsEditor(true)}>Editor</span>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className={styles.rightNav}>
        {!isMobile || isEditor ? (
          <>
            <div className={styles.editorSelections}>
              <div className={styles.Select}>
                <label htmlFor="language">Language:</label>
                <select
                  name="language"
                  id="language"
                  onChange={(e) => onSelectLanguage(e.target.value)}
                >
                  {languages.map(([language, version]) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.codeButtons}>
              <div className={styles.codeButton} onClick={handleRunCode}>
                Run Code
              </div>
              <div className={styles.codeButton} onClick={handleSubmitCode}>
                Submit Code
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ContestProblemNav;
