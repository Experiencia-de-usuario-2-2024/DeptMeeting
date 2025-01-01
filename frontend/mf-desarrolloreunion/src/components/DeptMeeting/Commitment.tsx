import React, { useEffect, useState } from 'react';

interface CommitmentProps {
    _id: string;
    description: string;
    number: number;
    position: string;
    dateLimit: string;
    timeLimit: string;
    participants: string[];
}
const Commitment: React.FC<CommitmentProps> = (commitmentElement) => {

        const [commitment, setCommitment] = useState('');
        const [owner, setOwner] = useState('');

        useEffect(() => {
            setCommitment(commitmentElement.description);
            setOwner(commitmentElement.participants[0]);
        }, []);

        return (
            <div>
                <h3 style={{
                    marginLeft: '30px',
                    marginTop: "5px",
                    marginBottom: "5px",
                    whiteSpace: 'pre-line'
                }}>{commitmentElement.number}.{commitmentElement.position} Compromiso: {commitment}</h3>
                <h4 style={{
                    marginLeft: '30px',
                    marginTop: "5px",
                    marginBottom: "5px",
                    whiteSpace: 'pre-line'
                }}>Encargado/a: {owner}</h4>
                <h4 style={{
                    marginLeft: '30px',
                    marginTop: "5px",
                    marginBottom: "5px",
                    whiteSpace: 'pre-line'
                }}>Fecha y hora para el cumplimiento: {commitmentElement.dateLimit.split("-").reverse().join("-").replace(/^\d{4}/, (y) => y.slice(2))} a las {commitmentElement.timeLimit}</h4>
            </div>
        );
}

export default Commitment;