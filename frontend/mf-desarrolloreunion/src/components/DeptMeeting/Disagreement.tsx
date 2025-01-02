import React, {useState} from "react";

interface DisagreementProps {
    _id: string;
    description: string;
    number: number;
    position: string;
    disagreement: {
        firtPosition: {responsible: string, description: string},
        secondPosition: {responsible: string, description: string},
    };
}
const Disagreement: React.FC<{disagreementElement: DisagreementProps}> = ( {disagreementElement} ) => {


    return (
        <div>
            <h3 style={{
                marginLeft: '30px',
                marginTop: "5px",
                marginBottom: "5px",
                whiteSpace: 'pre-line'
            }}>{disagreementElement.number}.{disagreementElement.position} Desacuerdo: {disagreementElement.description}</h3>
            <h4 style={{marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>Dueño/a de
                la primera postura: {disagreementElement.disagreement.firtPosition.responsible}</h4>
            <h4 style={{marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>Primera postura: {disagreementElement.disagreement.firtPosition.description}</h4>
            <h4 style={{marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>Dueño/a de la segunda postura: {disagreementElement.disagreement.secondPosition.responsible}</h4>
            <h4 style={{marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>Segunda postura: {disagreementElement.disagreement.secondPosition.description}</h4>
        </div>
    );
}

export default Disagreement;