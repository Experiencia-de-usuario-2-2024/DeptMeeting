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
            <Inline space="space.200">
                <Textfield
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    name="basic"
                    id="basic-textfield"
                    value={value}
                />
                <Button style={{height:39.97 }} iconBefore={<SendIcon label="" size="medium" />} onClick={() => send(value)} appearance="primary"></Button>
            </Inline>
            <br />
        </>
    );
}