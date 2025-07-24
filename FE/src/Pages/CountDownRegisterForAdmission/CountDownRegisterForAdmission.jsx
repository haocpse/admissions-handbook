import React, { useEffect, useState } from "react";
import "./CountDownRegisterForAdmission.css";
import DongHoCat from "../../assets/deadline.png";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const CountDownRegisterForAdmission = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [targetDate, setTargetDate] = useState(null);

    const fetchDangKyNguyenVong = async () => {
        try {
            const response = await axios.get("/api/uni/v1/countdown");
            const item = response.data.data.find(
                (item) => item.content === "Ngày Đăng ký nguyện vọng xét tuyển ĐH 2025"
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
        fetchDangKyNguyenVong();
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
            <div className="countdown-detail-pink-container">
                <div className="countdown-content-wrapper">
                    <h2 className="countdown-title">Đếm ngược ngày Đăng Ký Nguyện Vọng ĐH {currentYear}</h2>
                    <div className="countdown-box pink">
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
                        "Giấc mơ không có ngày hết hạn. Hãy hít thở sâu và tiếp tục cố gắng."
                    </p>
                    <p>
                        @360Book
                    </p>
                </div>

            </div>
            <div className="exam-info-wrapper">
                <h3 className="exam-info-title">Đếm ngược ngày Đăng ký nguyện vọng xét tuyển ĐH {currentYear}</h3>
                <p className="exam-info-text">
                    Theo kế hoạch từ Bộ Giáo dục và Đào tạo, thời gian đăng ký nguyện vọng xét tuyển Đại học {currentYear} sẽ diễn ra từ ngày 16/7 đến 17h ngày 28/7/2025. Đây là giai đoạn quan trọng quyết định cơ hội trúng tuyển vào các trường đại học, cao đẳng trên toàn quốc.
                </p>
                <p className="exam-info-text">
                    Đây là kỳ thi quan trọng không chỉ để xét công nhận tốt nghiệp THPT mà còn là căn cứ để xét tuyển vào đại học, cao đẳng năm {currentYear}.
                </p>
                <p className="exam-info-text"><strong>Hình thức đăng ký nguyện vọng xét tuyển {currentYear}:</strong></p>
                <p>
                    Tất cả thí sinh sẽ đăng ký và điều chỉnh nguyện vọng trực tuyến trên hệ thống tuyển sinh của Bộ GD&ĐT tại địa chỉ: <a href="https://thisinh.thitotnghiepthpt.edu.vn" target="_blank">https://thisinh.thitotnghiepthpt.edu.vn</a><br /><br />

                    Thí sinh có thể:<br /><br />

                    – Thêm, bớt, sắp xếp lại thứ tự nguyện vọng<br />
                    – Điều chỉnh mã trường, mã ngành, tổ hợp xét tuyển<br />
                    – Sử dụng kết quả thi tốt nghiệp THPT, chứng chỉ ngoại ngữ, điểm học bạ hoặc điểm thi đánh giá năng lực (nếu trường cho phép)
                </p>

                <p className="exam-info-text"><strong>Những lưu ý khi đăng ký nguyện vọng xét tuyển Đại học {currentYear}</strong></p>
                <p>
                    Đăng ký không giới hạn số lượng nguyện vọng, nhưng cần <strong> sắp xếp nguyện vọng theo thứ tự ưu tiên thực sự mong muốn.</strong><br />
                    Cẩn thận khi nhập <strong> mã trường - mã ngành - mã tổ hợp</strong> để tránh sai sót.<br />
                    Sau khi hoàn tất, thí sinh cần xác nhận và lưu lại thông tin, tránh việc bị mất dữ liệu.
                </p>

                <p className="exam-info-text"><strong>Kinh nghiệm chọn nguyện vọng hiệu quả</strong></p>
                <ul>
                    <li>
                        Tìm hiểu kỹ điểm chuẩn các năm trước để đưa ra lựa chọn phù hợp với học lực
                        &raquo; <a href="/diem-chuan">Xem điểm chuẩn ĐH các năm tại đây</a>
                    </li>
                    <li>
                        Phân chia nguyện vọng theo chiến lược: nguyện vọng an toàn – vừa sức – thử thách.
                    </li>
                    <li>
                        Ưu tiên cao nhất nên là ngành học thực sự yêu thích và phù hợp với định hướng nghề nghiệp lâu dài.
                    </li>
                    <li>
                        Tìm hiểu kỹ thông tin tuyển sinh của các trường để xem năm nay trường tuyển ngành nào, tổ hợp nào, phương thức nào
                    </li>
                </ul>

                <p>
                    <strong>Đăng ký nguyện vọng xét tuyển Đại học {currentYear}</strong> – Bước đi quan trọng mở cánh cửa tương lai.
                    Hãy chuẩn bị kỹ lưỡng để nắm chắc cơ hội vào trường Đại học mơ ước!
                </p>


            </div >
            <Footer />
        </>
    );

};

export default CountDownRegisterForAdmission;
