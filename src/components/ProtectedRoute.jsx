//This file prevents anyone typing /admin to access the admin dashboard
import {Navigate} from "react-router-dom";

function ProtectedRoute ({children, allowedRole}) {
    const user =JSON.parse(localStorage.getItem("maji_user"));
    if (!user) return <Navigate to="/login"/>;
    if(allowedRole && user.role !==allowedRole) {
        return <Navigate to="/" />;
    }

  return children;
}
export default ProtectedRoute;