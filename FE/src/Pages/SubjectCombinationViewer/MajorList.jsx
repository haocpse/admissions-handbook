import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./MajorList.css";

// Mock data
const mockMajorData = {
    "A00": {
        name: "Toán - Lý - Hóa",
        majors: [
            {
                id: 1,
                name: "Công nghệ thông tin",
                universities: [
                    { name: "Đại học FPT", baseScore: 21.5 },
                    { name: "Đại học Bách Khoa", baseScore: 23.0 }
                ]
            },
            {
                id: 2,
                name: "Kỹ thuật phần mềm",
                universities: [
                    { name: "Đại học FPT", baseScore: 21.0 },
                    { name: "Đại học Công nghệ", baseScore: 22.5 }
                ]
            },
            {
                id: 3,
                name: "Điện tử",
                universities: [
                    { name: "Đại học Bách Khoa", baseScore: 22.0 },
                    { name: "Đại học Công nghệ", baseScore: 21.5 }
                ]
            }
        ]
    },
    "A01": {
        name: "Toán - Lý - Anh",
        majors: [
            {
                id: 4,
                name: "CNTT Tiếng Anh",
                universities: [
                    { name: "Đại học FPT", baseScore: 22.0 }
                ]
            },
            {
                id: 5,
                name: "Kinh tế đối ngoại",
                universities: [
                    { name: "Đại học Ngoại Thương", baseScore: 24.5 }
                ]
            }
        ]
    }
};

const MajorList = () => {
    const { comboId } = useParams();
    const comboData = mockMajorData[comboId];

    if (!comboData) {
        return (
            <>
                <Navbar />
                <div className="container py-4">
                    <div className="alert alert-warning">
                        Không tìm thấy tổ hợp môn {comboId}
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container py-4">
                <div className="major-list-header">
                    <h2>Ngành học xét tuyển tổ hợp {comboId}</h2>
                    <p className="text-muted">
                        {comboData.name} - {comboData.majors.length} ngành
                    </p>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {comboData.majors.map(major => (
                        <div key={major.id} className="col">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{major.name}</h5>
                                    <div className="university-list">
                                        <h6 className="text-muted mb-3">Các trường đào tạo:</h6>
                                        <ul className="list-unstyled">
                                            {major.universities.map((uni, index) => (
                                                <li key={index} className="mb-2">
                                                    <div className="d-flex justify-content-between">
                                                        <span>{uni.name}</span>
                                                        <span className="badge bg-primary">{uni.baseScore}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <Link
                                        to={`/major-details/${major.id}`}
                                        className="btn btn-outline-primary w-100"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MajorList;