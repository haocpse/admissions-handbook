import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const defaultAvatar = "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=ffecb3&color=2d3a8c&size=128";

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const username = getUsernameFromToken();
        if (!username) {
            alert("Token không hợp lệ hoặc đã hết hạn");
            return;
        }

        axios.get(`/api/user/${username}`)
            .then(res => {
                setUser(res.data.data);
            })
            .catch(err => {
                console.error(err);
                alert("Không thể lấy thông tin người dùng. Vui lòng thử lại sau!");
            });
    }, []);

    function getUsernameFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.sub;
        } catch (err) {
            console.error("Lỗi khi giải mã token:", err);
            return null;
        }
    }

    if (!user) return <div className="text-center p-5">Đang tải thông tin...</div>;

    return (
        <>
            <Navbar />
            <div className="user-profile-page">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="profile-title">Thông tin cá nhân</h1>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/nguoi-dung/truong-yeu-thich")}
                    >
                        Trường yêu thích
                    </button>
                </div>

                <div className="profile-card">
                    <div className="profile-avatar-block">
                        <img
                            src={user.avatar || defaultAvatar}
                            alt="avatar"
                            className="profile-avatar"
                        />
                        {/* Không cho đổi ảnh */}
                    </div>

                    <div className="profile-field">
                        <span className="profile-label">Tên đăng nhập:</span>
                        <span className="profile-value">{user.username}</span>
                    </div>

                    <div className="profile-field">
                        <span className="profile-label">Họ tên:</span>
                        <span className="profile-value">{user.fullName}</span>
                    </div>

                    <div className="profile-field">
                        <span className="profile-label">Email:</span>
                        <span className="profile-value">{user.email}</span>
                        {/* Không cho xác thực hay cập nhật */}
                    </div>

                    <div className="profile-field">
                        <span className="profile-label">Số điện thoại:</span>
                        <span className="profile-value">{user.phone || "Chưa cập nhật"}</span>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
