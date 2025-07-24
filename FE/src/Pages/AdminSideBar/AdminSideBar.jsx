import React from "react";
import './AdminSideBar.css';
import { NavLink, Link } from "react-router-dom";

const AdminSideBar = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
    };

    return (
        <div className="sidebar">
            <header>
                <div className="image-text">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="text logo-text">
                            <span className="name">360 BOOK!</span>
                            <span className="profession">Web manager universities</span>
                        </div>
                    </Link>
                </div>
            </header>
            <hr style={{ color: "white" }} />

            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        <li className="nav-link">
                            <NavLink to="/admin/manage-dai-hoc">
                                <i className="fa-solid fa-school icon"></i>
                                <span className="text nav-text">Quản lý đại học</span>
                            </NavLink>
                        </li>
                        <li className="nav-link">
                            <NavLink to="/admin/manage-nganh-hoc">
                                <i className="fa-solid fa-book icon"></i>
                                <span className="text nav-text">Quản lý ngành học</span>
                            </NavLink>
                        </li>
                        <li className="nav-link">
                            <NavLink to="/admin/manage-to-hop-mon">
                                <i className="fa-solid fa-chalkboard icon"></i>
                                <span className="text nav-text">Quản lý tổ hợp môn</span>
                            </NavLink>
                        </li>
                        <li className="nav-link">
                            <NavLink to="/admin/manage-thoi-gian-thi">
                                <i className="fa-solid fa-calendar-days icon"></i>
                                <span className="text nav-text">Quản lý lịch thi</span>
                            </NavLink>
                        </li>
                        <li className="nav-link">
                            <NavLink to="/admin/manage-tin-tuc">
                                <i className="fa-solid fa-newspaper icon"></i>
                                <span className="text nav-text">Quản lý tin tức</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <hr style={{ color: "white" }} />

                <div>
                    <li className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <div className="logout-link bottom-content">
                            <i className="bx bx-log-out icon"></i>
                            <span className="text nav-text">Logout</span>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    );
};

export default AdminSideBar;
