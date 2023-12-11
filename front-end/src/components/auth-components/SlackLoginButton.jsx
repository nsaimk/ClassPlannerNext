import React from 'react';
import { Button } from '@mui/material';
import Iconify from '../iconify/Iconify';
import { makeStyles } from "@material-ui/core/styles";


const slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID;
const backendUrl = process.env.REACT_APP_BACKEND_URL;



const SlackLoginButton = ({ onLoged, onError }) => {
    const slackAuthUrl = new URL('https://slack.com/oauth/v2/authorize');
    slackAuthUrl.searchParams.append('user_scope', 'users:read,users.profile:read,users:read.email');
    slackAuthUrl.searchParams.append('redirect_uri', `${backendUrl}/auth/redirect`);
    slackAuthUrl.searchParams.append('client_id', slackClientId);
    
    const openPopup = () => {
        const width = 600;
        const height = 800;
        const left = window.screenX + window.innerWidth / 2 - width / 2;
        const top = window.screenY + window.innerHeight / 2 - height / 2;

        return window.open(
            slackAuthUrl.href,
            '',
            `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );
    };

    const handleClick = () => {
        polling(openPopup());
    };

    const polling = (popup) => {
        const pollingInterval = setInterval(() => {
            if (!popup || popup.closed || popup.closed === undefined) {
                clearInterval(pollingInterval);
                onFailure('Popup has been closed by user');
            }

            const closeDialog = () => {
                clearInterval(pollingInterval);
                popup.close();
            };

            try {
                console.log(popup.location)
                if (!popup.location.hostname.includes('slack.com')) {
                    if (popup.location.search) {
                        const query = new URLSearchParams(popup.location.search);
                        const slackCode = query.get('code');


                        closeDialog();
                        if (slackCode) {
                            return onSuccess(slackCode);
                        }

                        onFailure(query.get('error'));
                    }
                }
            } catch (error) {
                console.error(error);
                // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
                // A hack to get around same-origin security policy errors in IE.
            }
        }, 500);
    };

    const onSuccess = (code) => {
        console.log(code);
        onLoged(code);
    };


    const onFailure = (error) => {
        onError(error);
    };

    
    return (
        <Button
            aria-label="Login"
            startIcon={<Iconify icon="devicon:slack" />}
            onClick={handleClick}
            style={{
                border:'1px solid red',
                color: 'red',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                '&:hover': {
                    backgroundColor: 'red',
                },
            }}
        >
            Signup With Slack
        </Button>
    );

};

export default SlackLoginButton;
