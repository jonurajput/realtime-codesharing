import React, { useEffect, useState } from 'react'
import "./codeEditor.css"
import Editor from "@monaco-editor/react";
import JSrunner from "javascript-code-runner"
import ACTIONS from '../../Action';
import { AiOutlineClose } from "react-icons/ai";
const CodeEditor = ({socketRef,coderef}) => {
  const [code, setCode] = useState()
  const [output, setOutput] = useState({});
  const [show,setShow]=useState(false)
  const [data,setData]=useState()
  const runCode = () => {
    setShow(true)
    const { result, message } = JSrunner(data);
    setOutput({ result, message })
   }

   const send=(value)=>{
     coderef(value)
     setData(value)
    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
      value
    });
   
   }

 useEffect(()=>{
   socketRef.current?.on(ACTIONS.CODE_CHANGE,({value1})=>{
    setCode(value1)
    
   })
   return ()=>{
    socketRef.current?.off(ACTIONS.CODE_CHANGE);
   }
 },[socketRef.current])

  return (

    <div className='code_editor'>
      <Editor
        height="90vh"
        width="100%"
        theme='vs-dark'
        defaultLanguage="javascript"
        defaultValue=""
        value={code}
        onChange={send}
        
      />
      <button className="editor_button" onClick={runCode}>Run </button>
     {show? <div className="editor_console">
     <span><AiOutlineClose color='black' size="25px" onClick={()=>setShow(false)}/></span>
        <p className="result"> {output?`Output: ${output.result}`:""}</p>
        <p className="error"> {output?`Error: ${output.message}`:""}</p>
      </div>:""}
    </div>
  )
}

export default CodeEditor
