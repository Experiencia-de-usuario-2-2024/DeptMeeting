import React, {useState} from 'react';
import Textfield from '@atlaskit/textfield';
import Button from '@atlaskit/button';
import { Inline } from '@atlaskit/primitives';
import SendIcon from '@atlaskit/icon/glyph/send'



export default function MessagesInput({
        send
    }: {
        send: (val:string) => void
    }) {


    const [value, setValue] = React.useState('');
    return(
        <>
            <Inline space="space.200" style={{ width: '100%', display: 'flex' }}>
                <Textfield
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    name="basic"
                    id="basic-textfield"
                    value={value}
                    style={{ flex: 1 }}
                />
                <Button 
                    style={{ 
                        height: 39.97,
                        backgroundColor: '#00A499',
                        marginLeft: '8px'
                    }} 
                    iconBefore={<SendIcon label="" size="medium" />} 
                    onClick={() => {
                        send(value);
                        setValue('');
                    }} 
                    appearance="primary"
                ></Button>
            </Inline>
            <br />
        </>
    );
}