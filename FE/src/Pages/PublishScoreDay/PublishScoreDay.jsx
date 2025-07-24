import React, { useEffect, useState } from "react";
import "./PublishScoreDay.css";
import DongHoCat from "../../assets/deadline.png";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const PublishScoreDay = () => {
     const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [targetDate, setTargetDate] = useState(null);

    const fetchNgayCongBoDiemThi = async () => {
        try {
            const response = await axios.get("/api/uni/v1/countdown");
            const item = response.data.data.find(
                (item) => item.content === "Ngày Công bố điểm thi tốt nghiệp THPT 2025"
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
        fetchNgayCongBoDiemThi();
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
            <div className="countdown-detail-orange-container">
                <div className="countdown-content-wrapper">
                    <h2 className="countdown-title">Đếm ngược Công bố điểm thi tốt nghiệp THPT {currentYear}</h2>
                    <div className="countdown-box orange">
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
                        “Giáo dục là vũ khí mạnh nhất mà bạn có thể sử dụng để thay đổi thế giới.”
                    </p>
                    <p>
                        @360Book
                    </p>
                </div>

            </div>
            <div className="exam-info-wrapper">
                <h3 className="exam-info-title">Đếm ngược ngày Công bố điểm thi tốt nghiệp THPT {currentYear}</h3>
                <p className="exam-info-text">
                    <strong>
                        Khi nào công bố điểm thi tốt nghiệp THPT 2025?
                    </strong>
                </p>
                <p>
                    Theo lịch công tác từ Bộ Giáo dục và Đào tạo, điểm thi tốt nghiệp THPT {currentYear} sẽ được công bố vào ngày 16/7/2025 trên toàn quốc. Đây là thời điểm được hàng triệu học sinh và phụ huynh mong chờ để xác định kết quả học tập sau 12 năm đèn sách, cũng như xét tuyển vào các trường đại học, cao đẳng.
                </p>
                <p className="exam-info-text">
                    <strong>
                        Sau khi biết điểm thi THPT {currentYear} cần làm gì?
                    </strong>
                </p>
                <p className="exam-info-text" >
                    <strong> Đối chiếu kết quả</strong>  với điểm chuẩn dự kiến các trường để điều chỉnh nguyện vọng (nếu cần)<br></br>

                    Thí sinh được <strong>phúc khảo bài thi </strong> trong thời gian quy định nếu cảm thấy điểm chưa phản ánh đúng năng lực<br></br>

                    Bắt đầu chuẩn bị các bước tiếp theo như <strong> nộp lệ phí xét tuyển</strong>  , theo dõi lịch tuyển sinh và xác nhận nhập học.<br></br>

                    <strong>Điểm thi tốt nghiệp THPT {currentYear}</strong> – Bước ngoặt lớn mở ra cánh cửa đại học. Theo dõi thường xuyên để cập nhật sớm và chính xác nhất!
                </p>
            </div >
            <Footer />
        </>
    );

};

export default PublishScoreDay;
