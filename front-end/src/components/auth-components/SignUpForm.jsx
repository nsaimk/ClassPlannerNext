import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import SlackLoginButton from "./SlackLoginButton";


export default function SignUpForm({ handleSlackSignup }) {
    return (
        <Container style={{ display: 'flex', marginTop: "120px", flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <img
                    src="https://www.samsltd.co.uk/app/uploads/2020/10/remote-learning-zoom-call.jpg"
                    alt="Platform Logo"
                    style={{ width: '80%' , marginRight:'60px', marginTop: "5px", marginBottom:"10px", borderRadius:"15px"}}
                />
            </div>
            <div style={{marginRight: "180px" }}>
                <div style={{ marginBottom: '30px' }}>
                <Typography component="h1" variant="h4">
                    Welcome to Our Platform!
                </Typography>
                <Typography component="h4" variant="h6">
                    Explore our courses and upcoming classes.
                </Typography>
                </div>
                <div>
                <SlackLoginButton
                    onLoged={handleSlackSignup}
                    onError={(error) => {
                        alert(error);
                    }}
                />
                </div>
            </div>
        </Container>
    );
}
