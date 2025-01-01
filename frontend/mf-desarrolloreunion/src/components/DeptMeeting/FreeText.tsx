import React, {useEffect, useState} from 'react';

interface TextProps {
    _id: string;
    description: string;
    participants: string[];
}

const FreeText: React.FC<TextProps> = (textElement) => {

    const [text, setText] = useState('');
    const [owner, setOwner] = useState('');

    useEffect(() => {
        setText(textElement.description);
        setOwner(textElement.participants[0]);
    }, []);

    return (
        <div>
            <h4 style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>{text}</h4>
            <h4 style={{ marginLeft: '30px', marginTop: "5px", marginBottom: "5px", whiteSpace: 'pre-line'}}>Dueño/a del texto libre: {owner}</h4>
        </div>
    );
}

export default FreeText;