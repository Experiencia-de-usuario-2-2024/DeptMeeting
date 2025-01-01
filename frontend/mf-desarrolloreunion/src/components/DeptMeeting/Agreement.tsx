import React, {useState, useEffect} from "react";

interface AgreementProps {
    _id: string;
    description: string;
    number: number;
    position: string;
}

const Agreement: React.FC<AgreementProps> = (agreementElement ) => {
    return (
        <div>
            <h3 style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>{agreementElement.number}.{agreementElement.position} Acuerdo: {agreementElement.description}</h3>
        </div>
    );
}

export default Agreement;