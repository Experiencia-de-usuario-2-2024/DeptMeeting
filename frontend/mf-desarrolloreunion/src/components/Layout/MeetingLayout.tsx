import React, {useContext, useState, useEffect} from "react";
import MeetingManagementContext from "../MeetingManagementContext";
import {Box, Inline} from "@atlaskit/primitives";
import Button from "@atlaskit/button";
import ProgressBar from "./ProgressBar";
import AvatarGroup from "@atlaskit/avatar-group";
import MessagesInput from "../MessageInput";
import Messages from "../Messages";
import CommentIcon from "@atlaskit/icon/glyph/comment";
import Popup from "@atlaskit/popup";

const MeetingLayout = () => {
    const { reunionState } = useContext(MeetingManagementContext);
    const { reunion } = reunionState;

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        child: {
            flex: 1,
            display: 'flex',
            marginTop: '15px',
            justifyContent: 'space-around',
        },
        favorite: {
            flex:3,
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.child}>
                <AvatarGroup appearance="stack" data={[{key: 1, name: "jose"}]} borderColor="#388BFF"
                             size="large" maxCount={4}/>
                <Button
                    style={{height: 44}}
                    iconBefore={<CommentIcon label="" size="medium"/>}
                    appearance="primary">
                    <p style={{marginTop: 3, marginBottom: 0}}>chat</p>{' '}
                </Button>
                <Button
                    style={{height: 44}}
                    appearance="primary"
                    isDisabled={!reunion.googleMeetLink}
                    onClick={() => window.open(reunion.googleMeetLink, '_blank')}
                >
                    <p style={{marginTop: 3}}>Google Meet</p>
                </Button>
            </div>
            <div style={styles.child}></div>
            <div style={styles.favorite}>
                <ProgressBar reunionState={reunion.state}/>
            </div>
            <div style={{...styles.child, flex: 2}}>

            </div>
        </div>
    );
}

export default MeetingLayout;