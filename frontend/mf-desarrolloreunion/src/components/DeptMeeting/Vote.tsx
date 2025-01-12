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
    number?: number;
    position?: string;
    dateLimit?: string;
    vote:   {
        type: string,
        options: {option: string, votes: number, _id: string}[],
        voters: {voter: string, option: string}[],
        result: string,
    };
}



const Vote: React.FC<{voteElement: VoteELementProps}> = ( {voteElement }) => {
    const [options, setOptions] = useState<string[]>([]);
    const [votes, setVotes] = useState<number[]>(Array(options.length).fill(0));
    const [voted, setVoted] = useState(false);
    const [correoElectronico, setCorreoElectronico] = useState<string | null>(null);
    const totalVotes = votes.reduce((a, b) => a + b, 0);
    const [tokenUser, setTokenUser] = useState<string | null>(null);


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
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_GATEWAY}/api/element/${voteElement._id}/vote`,
                {
                    email: correoElectronico,
                    option: options[index],
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    },
               },
            );
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const tokenUser = localStorage.getItem('tokenUser');
        setTokenUser(tokenUser);
        const decodedToken: any = tokenUser ? jwtDecode(tokenUser) : null;
        if( decodedToken && voteElement){
            setCorreoElectronico(decodedToken.email);
            console.log("El token es: ", decodedToken.email);
            if (voteElement.vote.voters.some((voter) => voter.voter === decodedToken.email)) {
                setVoted(true);
            }
            setOptions(voteElement.vote.options.map((option) => option.option));
            setVotes(voteElement.vote.options.map((option) => option.votes));
            console.log("El correo electronico es: ", correoElectronico);
        }
    }, []);

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
            <h2 style={{ textAlign: "center" }}>{voteElement.number? voteElement.number : ""}{voteElement.position? "." +voteElement.position + " " : ""}{voteElement.description}</h2>

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
                        <span style={{ fontWeight: 700 }}>{option}</span>
                        <Button
                            style={{ margin: "7px"}}
                            appearance="primary"
                            isDisabled={voted}
                            onClick={() => handleVote(index)}
                        >
                            Votar
                        </Button>
                    </div>
                    <ProgressBar
                        value={totalVotes === 0 ? 0 : votes[index] / totalVotes}
                    />
                    <span>
            {votes[index]} voto{votes[index] !== 1 && "s"} (
                        {totalVotes === 0
                            ? "0%"
                            : ((votes[index] / totalVotes) * 100).toFixed(1) + "%"})
          </span>
                </div>
            ))}
        </div>
    );
};


export default Vote;
