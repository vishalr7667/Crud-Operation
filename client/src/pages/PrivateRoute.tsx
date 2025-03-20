import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const PrivateRoute: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return <Navigate to="/login" replace />;
    }

    return authContext.auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
