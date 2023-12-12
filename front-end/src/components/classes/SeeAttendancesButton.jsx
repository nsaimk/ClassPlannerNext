import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from "../../utils/axios"
const SeeAttendancesButton = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [attendances, setAttendances] = useState([]);

    
    const handleButtonClick = async () => {
        const sessionId = props.sessionId;

        try {
            const body = {
                sessionId: sessionId,
     
            }

            const response = await axios.get(`/attendance/${sessionId}`, body);

            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const attendanceData = response.data;
            setAttendances(attendanceData);
            setModalVisible(true);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    
    return (
        <>
            <Button
                variant="primary"
                onClick={handleButtonClick}
                style={{
                    backgroundImage: 'linear-gradient(100deg,#36454f  0%, #36454f 74%)',
                    padding: '15px 35px',
                    borderRadius: '50px',
                    color: '#fff',
                    border: 'none',
                }}
            >
                See Attendances
            </Button>
            <Modal show={modalVisible} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ATTENDANCES</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Who is leading: </b>
                    {props.whoLeading}
                </Modal.Body>
                <Modal.Body>{attendances.map((attendance) => (
                    <div key={attendance.id}>
                        {attendance.slack_firstname} {attendance.slack_lastname} ------------------
                        {attendance.name} 
                    </div>
                ))}</Modal.Body>
            </Modal>
        </>
    );
};

export default SeeAttendancesButton;
