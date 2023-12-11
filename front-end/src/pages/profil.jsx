import React, { useState, useEffect } from "react";
import ProfileDetails from "../components/profile/profileDetails";
import UserGuard from "../auth/UserGuard";
import Navbar from "../components/barComponents/Navbar";
import axios from '../utils/axios';
import "../styles/Profile.scss";
import { useAuthContext } from "../auth/useAutContext";

export default function Profile() {
    const [user, setUser] = useState({
        slack_firstname: "",
        slack_lastname: "",
        default_role: "",
        slack_photo_link: "",
        slack_title: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const response = await axios.get("/profile");
                /* console.log(response); */

                if (response.statusText !== "OK") {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const userData = response.data;
                console.log("user data:::",userData)
                setUser(userData);
                setLoading(false);
                setError(null);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Error fetching user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

    return (
        <UserGuard>
            <div>
                <Navbar />
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {!loading && <ProfileDetails user={user} />}
            </div>
        </UserGuard>
    );
}
