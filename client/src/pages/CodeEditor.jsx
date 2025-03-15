import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react';
import { codeSnippets } from '../utils/languagesConstants';

const CodeEditor = ({ language, value, setValue,theme }) => {
    const editorRef = useRef()
    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    }
    return (
        <div style={{border: "1px solid rgb(16, 5, 63)"}}>
            <Editor
                height="65vh"
                theme={theme}
                language={language}
                defaultValue={codeSnippets[language]}
                onMount={onMount}
                value={value}
                onChange={
                    (value) => setValue(value)
                }
                options={{
                    fontSize: 16, // Change this value to increase/decrease font size
                }}
                />
        </div>
    )
}

export default CodeEditor