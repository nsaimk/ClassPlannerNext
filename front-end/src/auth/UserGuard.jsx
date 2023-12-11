import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAutContext";

export default function UserGuard({ children }) {
    const navigate = useNavigate();
    const { isInitialized, isAuthenticated } = useAuthContext()

    if (!isInitialized) {
        return children
    }
    if (!isAuthenticated) {
        navigate("/")                                                                                                                                                                                                                                                                                                                           
    }
    return children

}

