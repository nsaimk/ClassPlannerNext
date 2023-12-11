import React, { useEffect, useState } from 'react';
import Navbar from "../components/barComponents/Navbar";
import { makeStyles } from '@mui/styles';
import ClassCard from "../components/classes/ClassCard";
import UserGuard from "../auth/UserGuard";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const url = process.env.REACT_APP_BACKEND_URL

const Main = () => {
    const classes = useStyles();
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/session`);
                const result = await response.json();
                setData(result);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (

        <UserGuard>
            <div className="main-container" style={{
                marginTop: "200px"
            }}>
                <Navbar />
                {data.map((s) => (
                    <ClassCard
                        key={s.id}
                        sessionId={s.id}
                        className={classes.root}
                        date={s.date}
                        time_start={s.time_start}
                        time_end={s.time_end}
                        who_leading={s.who_leading}
                        city={s.city}
                        location={s.location}
                        module_name={s.module_name}
                        module_week={s.module_week}
                        syllabus_link={s.syllabus_link}
                    />
                ))}
            </div>
        </UserGuard>
    );
};

export default Main;