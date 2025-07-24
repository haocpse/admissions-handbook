import Slider from "react-slick";
import "./AdmissionSlider.css";
import HocBa from "../../assets/hoc-ba.png";
import Hsa from "../../assets/hsa.png";
import Hsca from "../../assets/h-sca.png";
import Ielts from "../../assets/ielts.png";
import Spt from "../../assets/spt.png";
import Tsa from "../../assets/tsa.png";
import Vact from "../../assets/vact.png";

const data = [
    {
        icon: Hsa,
        title: "Đánh giá năng lực đại học quốc gia Hà Nội",
        description: "Thêm cơ hội trúng tuyển từ phương thức xét điểm thi HSA đánh giá năng lực ĐH Quốc gia Hà Nội của 100 trường Đại học.",
    },
    {
        icon: Vact,
        title: "Đánh giá năng lực ĐHQG TP HCM",
        description: "360Book tổng hợp đầy đủ các trường xét tuyển bằng điểm ĐGNL của ĐHQG TP HCM.",
    },
    {
        icon: Tsa,
        title: "Đánh giá tư duy",
        description: "Gần 40 trường đại học sử dụng kết quả thi Đánh giá tư duy để xét tuyển năm 2025.",
    },
    {
        icon: HocBa,
        title: "Xét tuyển học bạ",
        description: "360Book tổng hợp đầy đủ danh sách trường xét học bạ năm 2025 giúp học sinh tăng cơ hội đỗ đại học sớm nhất.",
    },
    {
        icon: Spt,
        title: "Đánh giá năng lực Trường ĐHSP Hà Nội",
        description: "Danh sách các trường sử dụng kết quả thi đánh giá năng lực của Trường Đại học Sư phạm Hà Nội để xét tuyển đại học.",
    },
    {
        icon: Hsca,
        title: "Đánh giá năng lực Trường ĐHSP HCM",
        description: "Tuyensinh247 tổng hợp đầy đủ danh sách trường xét điểm thi đánh giá năng lực ĐH Sư phạm TPHCM năm 2025 giúp học sinh tăng cơ hội Đỗ Đại học sớm nhất.",
    },
    {
        icon: Ielts,
        title: "Bài thi IELTS",
        description: "Danh sách các trường đại học thông báo ưu tiên xét tuyển, tuyển thẳng và quy đổi điểm tiếng Anh đối với thí sinh có chứng chỉ IELTS.",
    },
];


const AdmissionSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 },
            },
            {
                breakpoint: 992,
                settings: { slidesToShow: 2 },
            },
        ],
    };


    return (
        <div className="container my-5">
            <h2 className="text-center fw-bold mb-3 text-uppercase">
                Thông tin tuyển sinh mới nhất 2025
            </h2>
            <p className="text-center mb-4">
                Bộ Giáo dục và Đào tạo đã công bố danh mục 17 phương thức xét tuyển đại học năm 2025 như: Xét kết quả thi tốt nghiệp THPT, học bạ, đánh giá năng lực, tư duy, v.v...
            </p>
            <Slider {...settings}>
                {data.map((item, index) => (
                    <div key={index} className="px-2">
                        <div
                            className="p-4 rounded shadow-sm h-100 bg-white border text-center d-flex flex-column justify-content-between"
                            style={{ minHeight: "360px" }} // hoặc height: "100%"
                        >
                            <div>
                                <div className="mb-3">
                                    <img
                                        src={item.icon}
                                        alt={item.title}
                                        style={{ width: "260px", height: "90px", objectFit: "contain" }}
                                    />
                                </div>
                                <h5 className="fw-bold text-primary mb-2">{item.title}</h5>
                                <p className="text-muted small">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default AdmissionSlider;
