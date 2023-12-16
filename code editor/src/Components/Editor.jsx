import React from 'react'
import MonacoEditor from 'react-monaco-editor';


const Editor = () => {
    return (
        <div>
            <div className='flex-1  bg-gray-900 text-white'>
                <MonacoEditor
                    height="100vh"
                    width="100%"
                    language="javascript"
                    theme="vs-dark"

                />
            </div>
        </div>
    )
}

export default Editor