import React, {useState} from 'react';



export default function Messages({messages}: {messages: string[]}) {
    return(
        <div>
            {messages.map((message, index) =>(
                <>
                    <div style={{marginBottom: "10px"}} key={index}>{message}</div>
                </>
            ))}
        </div>
    );
}