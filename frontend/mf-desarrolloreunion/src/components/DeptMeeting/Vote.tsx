import React, {useState, useEffect} from "react";
import Button from "@atlaskit/button";
import ProgressBar from "@atlaskit/progress-bar";
import SectionMessage from "@atlaskit/section-message";
import axios from "axios";
import {jwtDecode} from "jwt-decode";


const tokenUser = localStorage.getItem('tokenUser');
const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
const correoElectronico = decodedToken.email;

interface VoteELementProps {
    _id: string;
    description: string;
    number: number;
    position: string;
    dateLimit: string;
    vote:   {
        type: string,
        options: [ {option: string, votes: number} ],
        voters: [ {voter: string, option: string} ],
        result: string,
    }
}



const Vote: React.FC<VoteELementProps> = ({ voteElement }) => {
    const [options, setOptions] = useState<string[]>([]);
    const [votes, setVotes] = useState<number[]>(Array(options.length).fill(0));
    const [voted, setVoted] = useState(false);
    const totalVotes = votes.reduce((a, b) => a + b, 0);

    const handleVote = (index: number) => {
        if (!voted) {
            const updatedVotes = [...votes];
            updatedVotes[index] += 1;
            setVotes(updatedVotes);
            setVoted(true);
            SaveVote(index);
        }
    };

    const SaveVote = async (index: number) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEAWY}/element/${voteElement._id}`, {
                    voter: {
                        email: correoElectronico,
                        option: options[index],
                    },
                },
            );
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        console.log("votacion element: ", voteElement);
        if (voteElement) {
            setOptions(voteElement.vote.options.map((option) => option.option));
            setVotes(voteElement.vote.options.map((option) => option.votes));
            console.log("El correo electronico es: ", correoElectronico);
        }
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
            <h2 style={{ textAlign: "center" }}>{voteElement.description}</h2>

            {voted && (
                <SectionMessage title="¡Gracias por votar!" appearance="confirmation">
                    Tu voto ha sido guardado.
                </SectionMessage>
            )}

            {options.map((option, index) => (
                <div
                    key={index}
                    style={{
                        marginBottom: "15px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span style={{ fontWeight: 500 }}>{option}</span>
                        <Button
                            appearance="primary"
                            isDisabled={voted}
                            onClick={() => handleVote(index)}
                        >
                            Vote
                        </Button>
                    </div>
                    <ProgressBar
                        value={totalVotes === 0 ? 0 : votes[index] / totalVotes}
                    />
                    <span>
            {votes[index]} vote{votes[index] !== 1 && "s"} (
                        {totalVotes === 0
                            ? "0%"
                            : ((votes[index] / totalVotes) * 100).toFixed(2) + "%"})
          </span>
                </div>
            ))}
        </div>
    );
};


export default Vote;
