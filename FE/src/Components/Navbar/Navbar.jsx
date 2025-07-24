import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo2 from '../../assets/logo2.png';
import iconNew from '../../assets/icon-new.png';
import './Navbar.css'
import { jwtDecode } from "jwt-decode";

const Navbar = () => {

    const [isLogined, setIsLogined] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let prevScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');

        const handleScroll = () => {
            if (!navbar) return;
            if (window.scrollY < prevScrollY) {
                navbar.style.top = '0';
            } else {
                navbar.style.top = '-100px';
            }
            prevScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLogined(true);
        }
    }, []);

    function getRoleFromToken() {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const roles = decodedToken.scope || decodedToken.roles || decodedToken.authorities;
            return roles;
        }
        return null;
    }

    const handleClickProfile = () => {
        const roles = getRoleFromToken();
        if (roles === "ADMIN") {
            navigate('/admin');
        } else if (roles === "USER") {
            navigate('/user/profile');
        } else {
            navigate('/login');
        }
    }
        const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <Link className="navbar-brand" to="/">
                <img src={logo2} alt="Logo" height="50" style={{ objectFit: "contain" }} />
            </Link>
            <Link className="navbar-brand fw-bold text-primary" to="/">
                360BOOK.com
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav" style={{ marginRight: "180px" }}>
                <ul className="navbar-nav ms-auto gap-4">
                    <li className="nav-item">
                        <Link className="nav-link" to="/tinh-diem">
                            <img
                                src={iconNew}
                                alt="New"
                                style={{ width: "30px", height: "auto", marginRight: "8px" }}
                            />
                            Tra cứu các loại điểm
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/danh-sach-truong">Danh sách trường</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/diem-chuan">Điểm chuẩn đại học</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/lich-thi">Lịch thi</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <span className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" style={{ color: "blue" }}>
                            Xem thêm
                        </span>
                        <ul className="dropdown-menu" style={{ borderRadius: "10px", marginTop: "20px" }}>
                            <li><Link className="dropdown-item" to="/dem-nguoc">Đếm ngược ngày thi</Link></li>
                            <li><Link className="dropdown-item" to="/hoi-va-dap">Hỏi xoáy đáp xoay</Link></li>
                            <li><Link className="dropdown-item" to="/tra-cuu-to-hop-mon">Tra cứu tổ hợp môn</Link></li>
                            <li><Link className="dropdown-item" to="/so-sanh">So sánh hai trường đại học</Link></li>
                        </ul>
                    </li>
                </ul>

            </div>
            <div className="d-flex align-items-center ms-auto">
                {isLogined ? (
                    <>
                        <button
                            className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2"
                            onClick={handleClickProfile}
                        >
                            <i className="fa-solid fa-user"></i> Cá nhân
                        </button>

                        <button
                            className="btn btn-outline-danger rounded-pill d-flex align-items-center gap-2"
                            onClick={handleLogout}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                        <i className="fa-solid fa-right-to-bracket me-2"></i> Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;