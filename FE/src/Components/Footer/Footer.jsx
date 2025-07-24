import React from "react";
import './Footer.css';
import logo from '../../assets/BGSEARCH.png';
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer" style={{ backgroundColor: "#225BBF" }}>
            <div className="container py-2">
                <div className="row align-items-start">

                    {/* Logo và slogan */}
                    <div className="col-md-3 text-center mb-3">
                        <img src={logo} alt="LOGO" className="footer-img mb-2" style={{ width: "50%" }} />
                        <p className="fw-bold small">360 BOOK !<br />YOUR SCORE YOUR CAREER</p>
                    </div>

                    {/* Cột 1 */}
                    <div className="col-md-3 border-start border-white ps-4">
                        <ul className="list-unstyled small">
                            <li><span className="arrow">➤</span><Link to="/danh-sach-truong"> Danh sách ĐH</Link></li>
                            <li><span className="arrow">➤</span><Link to="/diem-chuan"> Xem điểm chuẩn ĐH</Link></li>
                            <li><span className="arrow">➤</span><Link to="/tra-cuu-to-hop-mon" > Tổ hợp xét tuyển Đại học 2025</Link></li>
                        </ul>
                    </div>

                    {/* Cột 2 */}
                    <div className="col-md-3 border-start border-white ps-4">
                        <ul className="list-unstyled small">
                            <li><span className="arrow">➤</span><Link to="/lich-thi" > Lịch thi</Link></li>
                            <li><span className="arrow">➤</span><Link to="/tinh-diem" > Công cụ tính điểm tốt nghiệp THPT</Link></li>
                            <li><span className="arrow">➤</span><Link to="/dem-nguoc" > Đếm ngược ngày thi</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div className="col-md-3 border-start border-white ps-4">
                        <ul className="list-unstyled small">
                            <li><span className="arrow">➤</span> Tel: 0707.804.907</li>
                            <li><span className="arrow">➤</span> Email: 360book@gmail.com</li>
                            <li><span className="arrow">➤</span> Văn phòng: Gò Vấp</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright dưới cùng */}
            <div className="text-center small py-2 border-top border-secondary" style={{ backgroundColor: "#21639E", color: "#849CE2" }}>
                <p className="mb-0">&copy; 2025 All Rights Reserved</p>
            </div>
        </footer>
    );

};

export default Footer;