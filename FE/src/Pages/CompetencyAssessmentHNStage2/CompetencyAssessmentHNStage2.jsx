import React, { useEffect, useState } from "react";
import "./CompetencyAssessmentHNStage2.css";
import DongHoCat from "../../assets/deadline.png";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const CompetencyAssessmentHNStage2 = () => {
   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [targetDate, setTargetDate] = useState(null);

    const fetchNgayDanhGiaNangLucHNLan2 = async () => {
        try {
            const response = await axios.get("/api/uni/v1/countdown");
            const item = response.data.data.find(
                (item) => item.content === "Ngày Đánh Giá Năng Lực - tại Hà Nội - Đợt 2 2025"
            );
            if (item) {
                setTargetDate(new Date(item.startTime));
                toast.success("Fetch thành công");
            } else {
                toast.error("Không tìm thấy ngày đăng ký nguyện vọng");
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi khi fetch ngày đăng ký nguyện vọng");
        }
    };
    useEffect(() => {
        fetchNgayDanhGiaNangLucHNLan2();
    }, []);

    useEffect(() => {
        if (!targetDate || isNaN(targetDate.getTime())) return;

        const timer = setInterval(() => {
            const now = new Date();
            const distance = targetDate.getTime() - now.getTime();

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const currentYear = new Date().getFullYear();
    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <Navbar />
            <div className="countdown-detail-teal-container">
                <div className="countdown-content-wrapper">
                    <h2 className="countdown-title">Đếm ngược ngày Đánh Giá Năng Lực Đợt 2 - HCM {currentYear}</h2>
                    <div className="countdown-box teal">
                        <span className="label">Còn</span>
                        <span className="number">{timeLeft.days}</span>
                        <span className="label">ngày</span>
                    </div>

                    <div className="countdown-box-wrapper">
                        <div className="countdown-box-detail">
                            <div className="countdown-item">
                                <span>{timeLeft.days}</span>
                                <small>Ngày</small>
                            </div>
                            <div className="countdown-item">
                                <span>{timeLeft.hours}</span>
                                <small>Giờ</small>
                            </div>
                            <div className="countdown-item">
                                <span>{timeLeft.minutes}</span>
                                <small>Phút</small>
                            </div>
                            <div className="countdown-item">
                                <span>{timeLeft.seconds}</span>
                                <small>Giây</small>
                            </div>
                        </div>
                    </div>

                    <img src={DongHoCat} alt="Đồng hồ cát" className="countdown-image" />
                    <p className="countdown-description">
                        Điểm yếu lớn nhất của chúng ta nằm ở việc buông bỏ. Cách chắc chắn nhất để thành công là luôn cố gắng thêm một lần nữa”
                    </p>
                    <p>
                        @360Book
                    </p>
                </div>

            </div>
            <div className="exam-info-wrapper">
                <h3 className="exam-info-title">Đếm ngược ngày Công bố điểm chuẩn Đại học {currentYear}</h3>
                <p className="exam-info-text">
                    Thời gian công bố điểm chuẩn đại học {currentYear}: Theo lịch tuyển sinh Đại học {currentYear}, điểm trúng tuyển đại học 2025 sẽ được công bố từ ngày 20/8 đến 17h ngày 22/8/2025. Đây là khoảng thời gian quan trọng đối với hàng triệu sĩ tử sau kỳ thi tốt nghiệp THPT và xét tuyển đại học.
                </p>
                <p>
                    &raquo; <a href="/diem-chuan" style={{ color: "#007BFF", textDecoration: "underline" }}>
                        Cập nhật điểm chuẩn đại học {currentYear} liên tục – nhanh chóng – chính xác ngay tại đây
                    </a>
                </p>
            </div >
            <Footer />
        </>
    );

};

export default CompetencyAssessmentHNStage2;
