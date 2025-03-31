import React, { useState, useEffect } from 'react'
import ProblemNav from '../ui/ProblemNav'
import ProblemDescription from './ProblemDescription'
import styles from '../styles/Problempage.module.css'
import CodeEditor from './CodeEditor';
import { codeSnippets } from '../utils/languagesConstants';
import CodeResults from './CodeResults';
import ProblemSubmission from './ProblemSubmission';
import SubmissionsList from './SubmissionsList';
import { useLocation, useParams } from 'react-router-dom';

const Problempage = () => {
    const {problemId}= useParams();
    const [language, setLanguage] = useState('cpp')
    const [value, setValue] = useState(codeSnippets['C++'])
    const [sampleInput, setSampleInput] = useState(`3\n4\n1 2 -1 -2\n2\n-1 -1\n4\n-2 3 0 2`)
    const [sampleOutput, setSampleOutput] = useState(`2\n0\n3\n`)
    const [customInput, setCustomInput] = useState(`3\n4\n1 2 -1 -2\n2\n-1 -1\n4\n-2 3 0 2`)
    const [isExecuted, setIsExecuted] = useState(false)
    const [yourOutput, setYourOutput] = useState('yes')
    const [isSucess, setIsSuccess] = useState(true) // whether code executed has errors or not
    const [theme, setTheme] = useState("vs-dark")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState("no") //becomes true after you make a submissions
    const [submission, setSubmission] = useState(null) //fetch the submission for this particular problem
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
        setValue(codeSnippets[lang])
    }
    return (
        <div>
            <div className={styles.problemAll}>
                <div className={`${styles.leftSection} ${styles.Scrollbar}`}>
                    <SubmissionsList/>
                </div>
               
            </div>
        </div>
    )
}

export default Problempage