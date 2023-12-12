import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function BottomCard(props) {
    const [hovered, setHovered] = React.useState(false);

    const cardStyle = {
        width: 260,
        height: 240, 
        borderRadius: "10px",
        overflow: "hidden", 
        transition: "transform 0.3s, box-shadow 0.3s", 
        boxShadow: hovered ? "0px 0px 10px 2px rgba(0, 0, 0, 0.5)" : "0px 0px 5px 1px rgba(0, 0, 0, 0.2)", 
        transform: hovered ? "scale(1.05)" : "scale(1)",
    };

    const linkStyle = {
        textDecoration: "none",
        color: "inherit",
    };

    const cardMediaStyle = {
        height: 160,
        objectFit: "cover",
        transition: "transform 0.3s",
        transform: hovered ? "scale(1.2)" : "scale(1)",
    };

    return (
        <Link
            to={props.link}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
        >
            <Card sx={cardStyle}>
                <CardMedia sx={cardMediaStyle} image={props.image} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.h1}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}
