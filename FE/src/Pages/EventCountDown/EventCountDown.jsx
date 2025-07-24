
import React, { useEffect, useState } from "react";
import "./EventCountDown.css";
import DongHoCat from "../../assets/deadline.png";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EventCountDown = () => {
    const [eventData, setEventData] = useState({});
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const fetchEvents = async () => {
        try {
            const response = await axios.get("/api/uni/v1/countdown");
            const data = response.data.data;
            console.log("Fetched event data:", data);
            const getEventByContent = (key) => {
                const found = data.find(item => item.content.includes(key));
                return found ? { startTime: found.startTime, endTime: found.endTime } : { startTime: "", endTime: "" };
            };


            const eventMap = {
                ngayThiTotNghiep: getEventByContent("Ngày Thi tốt nghiệp THPT 2025"),
                ngayDangKiNguyenVong: getEventByContent("Ngày Đăng ký nguyện vọng xét tuyển ĐH 2025"),
                ngayCongBoDiemThi: getEventByContent("Ngày Công bố điểm thi tốt nghiệp THPT 2025"),
                ngayCongBoDiemChuanDot1: getEventByContent("Ngày Công bố điểm chuẩn Đại học 2025"),
                ngayDanhGiaNangLucHCMLan1: getEventByContent("Ngày Đánh Giá Năng Lực - tại Hồ Chí Minh - Đợt 1 2025"),
                ngayDanhGiaNangLucHCMLan2: getEventByContent("Ngày Đánh Giá Năng Lực - tại Hồ Chí Minh - Đợt 2 2025"),
                ngayDanhGiaNangLucHNLan1: getEventByContent("Ngày Đánh Giá Năng Lực - tại Hà Nội - Đợt 1 2025"),
                ngayDanhGiaNangLucHNLan2: getEventByContent("Ngày Đánh Giá Năng Lực - tại Hà Nội - Đợt 2 2025"),
            };

            setEventData(eventMap);
            toast.success("Tải dữ liệu sự kiện thành công!");
        } catch (error) {
            console.error("Lỗi khi tải sự kiện:", error);
            toast.error("Tải dữ liệu thất bại!");
        }
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <>
            <Navbar />

            <div className="container py-5">
                <ToastContainer />
                <h2 className="title mb-3" style={{ color: "#282E45", fontWeight: "800" }}>
                    ĐẾM NGƯỢC NGÀY THI VÀ CÁC SỰ KIỆN QUAN TRỌNG KHÁC
                </h2>
                <p className="description">
                    Đồng hồ đếm ngược ngày thi tốt nghiệp THPT, thi đánh giá năng lực, đánh giá tư duy và các ngày tết, ngày lễ noel giáng sinh, ngày trung thu và các sự kiện ngày lễ quan trọng sẽ trả lời các câu hỏi còn bao nhiêu ngày nữa?, mấy ngày nữa? tới sự kiện
                </p>

                <h5 className="section-title mt-5" style={{ color: "#282E45" }}>
                    Các Mốc Thời Gian Quan Trọng
                </h5>

                <div className="event-list">
                    {/* 1. Thi tốt nghiệp */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/ngay-thi-tot-nghiep"
                        color="green"
                        title={`Đếm ngược ngày Thi tốt nghiệp THPT ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayThiTotNghiep?.startTime)}
                        endTime={formatDateTime(eventData.ngayThiTotNghiep?.endTime)}
                        note="→ Xem chi tiết Lịch thi và lưu ý quan trọng"
                    />

                    {/* 2. Đăng ký nguyện vọng */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/ngay-dang-ki-nguyen-vong"
                        color="pink"
                        title={`Đếm ngược ngày Đăng ký nguyện vọng xét tuyển ĐH ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayDangKiNguyenVong?.startTime)}
                        endTime={formatDateTime(eventData.ngayDangKiNguyenVong?.endTime)}
                        note="→ Xem chi tiết Thời gian đăng ký và lưu ý quan trọng"
                    />

                    {/* 3. Công bố điểm thi */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/cong-bo-diem-thi"
                        color="orange"
                        title={`Đếm ngược ngày Công bố điểm thi tốt nghiệp THPT ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayCongBoDiemThi?.startTime)}
                        endTime={formatDateTime(eventData.ngayCongBoDiemThi?.endTime)}
                        note="→ Xem chi tiết Ngày công bố điểm và các bước tiếp theo"
                    />

                    {/* 4. Công bố điểm chuẩn */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/diem-chuan-dot-1"
                        color="blue"
                        title={`Đếm ngược ngày Công bố điểm chuẩn Đại học ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayCongBoDiemChuanDot1?.startTime)}
                        endTime={formatDateTime(eventData.ngayCongBoDiemChuanDot1?.endTime)}
                        note="→ Xem chi tiết Ngày công bố điểm và các bước tiếp theo"
                    />

                    {/* 5. ĐGNL HCM đợt 1 */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/dgnl-dot1-hcm"
                        color="red"
                        title={`Đếm ngược ngày Đánh Giá Năng Lực - HCM - Đợt 1 ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayDanhGiaNangLucHCMLan1?.startTime)}
                        endTime={formatDateTime(eventData.ngayDanhGiaNangLucHCMLan1?.endTime)}
                        note="→ Xem chi tiết lịch thi và lưu ý quan trọng"
                    />

                    {/* 6. ĐGNL HCM đợt 2 */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/dgnl-dot2-hcm"
                        color="purple"
                        title={`Đếm ngược ngày Đánh Giá Năng Lực - HCM - Đợt 2 ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayDanhGiaNangLucHCMLan2?.startTime)}
                        endTime={formatDateTime(eventData.ngayDanhGiaNangLucHCMLan2?.endTime)}
                        note="→ Xem chi tiết lịch thi và lưu ý quan trọng"
                    />

                    {/* 7. ĐGNL HN đợt 1 */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/dgnl-dot1-hn"
                        color="brown"
                        title={`Đếm ngược ngày Đánh Giá Năng Lực - Hà Nội - Đợt 1 ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayDanhGiaNangLucHNLan1?.startTime)}
                        endTime={formatDateTime(eventData.ngayDanhGiaNangLucHNLan1?.endTime)}
                        note="→ Xem chi tiết lịch thi và lưu ý quan trọng"
                    />

                    {/* 8. ĐGNL HN đợt 2 */}
                    <EventCard
                        navigate={navigate}
                        to="/dem-nguoc/dgnl-dot2-hn"
                        color="teal"
                        title={`Đếm ngược ngày Đánh Giá Năng Lực - Hà Nội - Đợt 2 ${currentYear}`}
                        startTime={formatDateTime(eventData.ngayDanhGiaNangLucHNLan2?.startTime)}
                        endTime={formatDateTime(eventData.ngayDanhGiaNangLucHNLan2?.endTime)}
                        note="→ Xem chi tiết lịch thi và lưu ý quan trọng"
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};
const EventCard = ({ navigate, to, color, title, startTime, endTime, note }) => {
    const calculateDaysLeft = (start) => {
        const parseDate = (str) => {
            const [day, month, year] = str.split('/');
            return new Date(`${year}-${month}-${day}`);
        };

        const startDate = parseDate(start);
        const now = new Date();

        if (isNaN(startDate)) return 0;

        // Đặt giờ về 0 để so sánh theo ngày
        startDate.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        const diffTime = startDate.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };


    return (
        <div className="event-card" onClick={() => navigate(to)}>
            <img src={DongHoCat} alt="Đồng hồ cát" className="event-icon" />
            <div className="event-info">
                <strong>{title}</strong>
                <p className="event-date">
                    {startTime && endTime
                        ? startTime === endTime
                            ? `Vào ngày ${startTime}`
                            : `Từ ${startTime} đến ${endTime}`
                        : "Đang cập nhật..."}
                </p>
                <p className="event-note">{note}</p>
            </div>
            <div className={`countdown-box ${color}`}>
                <span className="label">Còn</span>
                {startTime ? calculateDaysLeft(startTime) : 0}
                <span className="label">ngày</span>
            </div>

        </div>
    );
};


export default EventCountDown;
