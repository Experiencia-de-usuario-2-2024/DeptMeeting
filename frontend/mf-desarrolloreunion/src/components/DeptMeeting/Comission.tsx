import React from 'react';

interface ComissionProps {
    shortName: string;
    name: string;
    description: string;
    projectDateI: string;
    projectDateT: string;
    userOwner: string[];
    userMembers: string[];
    userMembersOriginal: string[];
}

const Comission: React.FC<{comission: ComissionProps}> = ({comission}) => {
    return (
        <div>
            <h2>{comission.name}</h2>
            <h3>{comission.description}</h3>
            {
                comission.userMembers.map((member, index) => (
                    <p key={index}>Miembro: {member}</p>))
            }
            <p>Fecha Límite: {comission.projectDateT}</p>
        </div>
    );
}

export default Comission;