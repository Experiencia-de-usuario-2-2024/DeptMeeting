import React, {useState} from "react";

interface DoubtProps {
    _id: string;
    description: string;
    participants: string[];
    number: number;
    position: string;
}

const Doubt: React.FC<{doubtElement: DoubtProps}> = ( {doubtElement} ) => {

        return (
            <div>
                <h3 style={{
                    marginLeft: '30px',
                    marginTop: "5px",
                    marginBottom: "5px",
                    whiteSpace: 'pre-line'
                }}>{doubtElement.number}.{doubtElement.position} Duda: {doubtElement.description}</h3>
                <h4 style={{marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>Dueño/a de la duda: {doubtElement.participants[0]}</h4>
            </div>
        );
}

export default Doubt;