import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuthContext } from "../../auth/useAutContext";

const AdminButton = () => {

    const { user } = useAuthContext();
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));

            if (decodedToken.roles == 'admin') {
                setAdmin(true);
            }
        }
    }, []);

    return (
        <div>
            {isAdmin && (
                <Link to="/create">
                    <Button variant="contained">Add & Edit</Button>
                </Link>
            )}
        </div>
    );
};

export default AdminButton;
