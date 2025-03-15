import React, { useState } from 'react'
import ProblemNav from '../ui/ProblemNav'
import ProblemDescription from './ProblemDescription'
import styles from '../styles/Problempage.module.css'
import CodeEditor from './CodeEditor';
import { codeSnippets } from '../utils/languagesConstants';
import CodeResults from './CodeResults';
import ProblemSubmission from './ProblemSubmission';

const Problempage = () => {
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

    const onSelectLanguage = (lang) => {
        setLanguage(lang);
        setValue(codeSnippets[lang])
    }
    return (
        <div>
            <div className={styles.problemNav}>
                <ProblemNav value={value} language={language} onSelectLanguage={onSelectLanguage} setIsExecuted={setIsExecuted} setTheme={setTheme} setIsSubmitting={setIsSubmitting} setHasSubmitted={setHasSubmitted} setSubmission={setSubmission} />
            </div>
            <div className={styles.problemAll}>
                <div className={styles.leftSection}>
                    {
                        hasSubmitted === "no" ?
                        <ProblemDescription sampleInput={sampleInput} sampleOutput={sampleOutput} isSubmitting={isSubmitting} hasSubmitted={hasSubmitted}/> :
                        <ProblemSubmission hasSubmitted={hasSubmitted} submission={submission} /> 
                    }
                </div>
                <div className={`${styles.rightSection} ${styles.Scrollbar}`}>
                    <CodeEditor language={language} value={value} setValue={setValue} theme={theme} />
                    <CodeResults customInput={customInput} setCustomInput={setCustomInput} isExecuted={isExecuted} yourOutput={yourOutput} isSucess={isSucess} />
                </div>
            </div>
        </div>
    )
}

export default Problempage