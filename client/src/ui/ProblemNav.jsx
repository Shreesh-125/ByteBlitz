import React, { useEffect, useState } from "react";
import styles from "../styles/ProblemNav.module.css";
import { LANGUAGE_VERSION, languagetoIdMap } from "../utils/languagesConstants";
import { Link, useParams } from "react-router-dom";

import axios from "axios";
import { submitCode } from "../servers/problem";
import { useQuery } from "@tanstack/react-query";
import { getVerdictMessage } from "../utils/ContestUtils";

const languages = Object.entries(LANGUAGE_VERSION);

const ProblemNav = ({
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
  problemId,
  setSubmission
}) => {


  const [shouldSubmit, setShouldSubmit] = useState(false);
  
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['submission', {value, languageId: languagetoIdMap[language], problemId}],
    queryFn: () => submitCode({value, languageId: languagetoIdMap[language], problemId}),
    enabled: false, // Disable automatic fetching
  });

  const handleRunCode = async() => {
    setIsExecuted(false)
    try {
      const languagecode=languagetoIdMap[language];
       const token = localStorage.getItem('token'); 

    const response= await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/problem/customTestCase`,{ languagecode, value,customInput }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    
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

  useEffect(() => {
    if (shouldSubmit) {
      refetch()
        .then(({ data }) => {  
          console.log(data);  
          
          if (data &&  data.status) {
            const verdict = data.status.id;
             const resultMessage = getVerdictMessage(verdict);
             setSubmission(data);
             console.log(data);
             
              setHasSubmitted(resultMessage);
          } else {
            throw new Error("Unexpected response format");
          }
          
          setIsSubmitting(false);
        })
        .catch((error) => {
          console.error("Submission error:", error);
          setIsSubmitting(false);
          setHasSubmitted("error");
        });
        
      setShouldSubmit(false);
    }
  }, [shouldSubmit, refetch]);

  const handleSubmitCode = () => {
   setIsSubmitting(true);
    setIsEditor(false);
    setHasSubmitted("pending");
    setShouldSubmit(true); // This will trigger the refetch
  };

  const handleStatement=()=>{
    setIsEditor(false);
    setIsExecuted(null);
    setHasSubmitted('no');
  }

  return (
    <div className={styles.nav}>
      <div className={styles.leftNav}>
        <Link className={styles.linkStyle} to={`/problems/${problemId}`}>
          <span onClick={handleStatement}>Statement</span>
        </Link>
        <Link className={styles.linkStyle} to={`/problems/${problemId}/submissions`}>
          <span onClick={handleStatement}>Submissions</span>
        </Link>
        {isMobile && isSubmissionPage === false ? (
          <Link className={styles.linkStyle} to={`/problems/${problemId}`}>
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

export default ProblemNav;
