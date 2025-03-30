import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProblemNav from '../ui/ProblemNav';
import ProblemDescription from './ProblemDescription';
import styles from '../styles/Problempage.module.css';
import CodeEditor from './CodeEditor';
import { codeSnippets } from '../utils/languagesConstants';
import CodeResults from './CodeResults';
import ProblemSubmission from './ProblemSubmission';
import { getProblemInfo } from '../servers/contestProblem';
import Loader from '../ui/Loader';
import ContestProblemNav from '../ui/ContestProblemNav';
import { useSocket } from '../context/SocketContext';


const ContestProblemDescriptionPage = () => {
  const { problemId,contestId } = useParams(); // Get problemId from URL params
   const {socket,setSocket,isrunning}=useSocket();
    console.log("socket",socket);
    const navigate = useNavigate();

    if(isrunning==null && socket==null){
      navigate("../", { replace: true });
    }
    

    useEffect(() => {
      if (!socket) return;

      // Handle socket events
      const handleOutput = (data) => {
          console.log("Output received:", data);
      };

      socket.on('see_output', handleOutput);
      
      // Join problem-specific room if needed
      socket.emit('join_problem', { contestId, problemId });

      return () => {
          socket.off('see_output', handleOutput);
          // Leave problem room if needed
          socket.emit('leave_problem', { contestId, problemId });
      };
  }, [socket, contestId, problemId]);

    
  

  // Fetch problem data using React Query
  const { data: problem, isLoading, isError, error } = useQuery({
    queryKey: ['problem', { problemId, contestId }], // Unique key for the query
    queryFn: () => getProblemInfo({ problemId, contestId }), // Fetch function
    enabled: !!problemId && !!contestId, // Only fetch if both problemId and contestId are available
  });
    // console.log(problem);
    
  const [language, setLanguage] = useState('cpp');
  const [value, setValue] = useState(codeSnippets['cpp']);
  const [customInput, setCustomInput] = useState('');
  const [isExecuted, setIsExecuted] = useState(null);
  const [yourOutput, setYourOutput] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);
  const [theme, setTheme] = useState('vs-dark');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState('no');
  const [submission, setSubmission] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [isEditor, setIsEditor] = useState(false);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSelectLanguage = (lang) => {
    setLanguage(lang);
    setValue(codeSnippets[lang]);
  };

  // Show loading state while data is being fetched
  if (isLoading) return <Loader/>;

  // Show error state if fetching fails
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className={styles.problemNav}>
        <ContestProblemNav
          value={value}
          language={language}
          onSelectLanguage={onSelectLanguage}
          setIsExecuted={setIsExecuted}
          setTheme={setTheme}
          setIsSubmitting={setIsSubmitting}
          setHasSubmitted={setHasSubmitted}
          setSubmission={setSubmission}
          isMobile={isMobile}
          isEditor={isEditor}
          setIsEditor={setIsEditor}
          isSubmissionPage={false}
          customInput={customInput}
          yourOutput={yourOutput}
          setYourOutput={setYourOutput}
          setIsSuccess={setIsSuccess}
          submission={submission}
        />
      </div>
      <div className={styles.problemAll}>
        <div className={styles.leftSection}>
          {isMobile && isEditor ? (
            <>
              <CodeEditor
                language={language}
                value={value}
                setValue={setValue}
                theme={theme}
              />
              <CodeResults
                customInput={customInput}
                setCustomInput={setCustomInput}
                isExecuted={isExecuted}
                yourOutput={yourOutput}
                isSuccess={isSuccess}
              />
            </>
          ) : hasSubmitted === 'no' ? (
            <ProblemDescription
              problem={problem}
              isSubmitting={isSubmitting}
              hasSubmitted={hasSubmitted}
            />
          ) : (
            <ProblemSubmission
              hasSubmitted={hasSubmitted}
              submission={submission}
            />
          )}
        </div>
        <div className={`${styles.rightSection} ${styles.Scrollbar}`}>
          <CodeEditor
            language={language}
            value={value}
            setValue={setValue}
            theme={theme}
          />
          <CodeResults
            customInput={customInput}
            setCustomInput={setCustomInput}
            isExecuted={isExecuted}
            yourOutput={yourOutput}
            isSuccess={isSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestProblemDescriptionPage;