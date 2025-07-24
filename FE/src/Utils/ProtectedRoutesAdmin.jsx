import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoutesAdmin = () => {
    const roles = getRoleFromToken();
    console.log(roles);

    return roles && (roles.includes("ADMIN") || roles.includes("STAFF")) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    );
};

function getRoleFromToken() {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // Nếu scope là chuỗi duy nhất (ví dụ: "ADMIN"), bọc vào mảng
            const roles = decodedToken.scope
                ? Array.isArray(decodedToken.scope)
                    ? decodedToken.scope
                    : [decodedToken.scope]
                : [];
            return roles;
        } catch (e) {
            console.error("Lỗi khi giải mã token:", e);
        }
    }
    return null;
}

export default ProtectedRoutesAdmin