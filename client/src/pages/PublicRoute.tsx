import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const PublicRoute: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <Navigate to="/login" replace />;
    }

    return authContext.auth ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
