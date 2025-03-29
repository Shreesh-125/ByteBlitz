import React, { useEffect, useState } from "react";
import styles from "../styles/ProblemNav.module.css";
import { LANGUAGE_VERSION, languagetoIdMap } from "../utils/languagesConstants";
import { Link } from "react-router-dom";

import axios from "axios";
import { submitCode } from "../servers/problem";
import { useQuery } from "@tanstack/react-query";

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
  problemId
}) => {

  const [shouldSubmit, setShouldSubmit] = useState(false);
  
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['submission', {value, languageId: languagetoIdMap[language], problemId}],
    queryFn: () => submitCode({value, languageId: languagetoIdMap[language], problemId}),
    enabled: false, // Disable automatic fetching
  });

  const handleRunCode = async() => {
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

  useEffect(() => {
    if (shouldSubmit) {
      refetch()
        .then(({ data }) => {  
          console.log(data);  
          
          
          if (data &&  data.status) {
            const verdict = data.status.id;
            
            switch (verdict) {
              case 3:
                setHasSubmitted("accepted");
                break;
              case 4:
                setHasSubmitted("Wrong Answer");
                break;
              case 5:
                setHasSubmitted("Time Limit Exceeded");
                break;
              case 6:
                setHasSubmitted("Compilation Error");
                break;
              case 7:
                setHasSubmitted("Runtime Error");
                break;
              case 13:
                setHasSubmitted("internal server error");
                break;
              case 14:
                setHasSubmitted("Execution Time Limit Exceeded");
                break;
              case 15:
                setHasSubmitted("Memory Limit Exceeded (MLE)");
                break;
              default:
                setHasSubmitted("Runtime Error");
                break;
            }
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

  return (
    <div className={styles.nav}>
      <div className={styles.leftNav}>
        <Link className={styles.linkStyle} to={`/problems/${problemId}`}>
          <span onClick={() => setIsEditor(false)}>Statement</span>
        </Link>
        <Link className={styles.linkStyle} to={`/problems/${problemId}/submissions`}>
          <span onClick={() => setIsEditor(false)}>Submissions</span>
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
