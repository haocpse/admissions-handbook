import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./ListUniversitiesView.css";

const strengthOptions = [
    { value: "", label: "Tất cả lĩnh vực" },
    { value: "Education", label: "Giáo dục" },
    { value: "STEM", label: "Khoa học - Công nghệ - Kỹ thuật - Toán" },
    { value: "Health_Medicine", label: "Y tế & Sức khỏe" },
    { value: "Language_Social_Sciences", label: "Ngôn ngữ & Khoa học Xã hội" },
    { value: "Economics_Law_Management", label: "Kinh tế - Luật - Quản lý" },
    { value: "Multidisciplinary", label: "Đa ngành" },
    { value: "Arts_Design", label: "Nghệ thuật & Thiết kế" },
    { value: "Agriculture_Environment", label: "Nông nghiệp & Môi trường" },
];

const ListUniversitiesView = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStrength, setSelectedStrength] = useState("");
    const { type, id } = useParams(); // hoặc chỉ id nếu đường dẫn là strength/:id
    const location = useLocation();
    const selected = location.state?.selected;

    useEffect(() => {
        axios.get("/api/uni/v1")
            .then((res) => {
                setUniversities(res.data.data);
                toast.success("Tải lên danh sách thành công");
                setLoading(false);
            })
            .catch((err) => {
                setUniversities([]);
                toast.error("Tải lên danh sách thất bại");
                setLoading(true); // loader vẫn hiển thị khi lỗi
                console.error(err);
            });


    }, []);

    useEffect(() => {
        if (selected?.value) {
            setSelectedStrength(selected.value);
        }
    }, [selected]);

    const listUniversity = universities.filter(university =>
        university.universityName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedStrength === "" || university.main === selectedStrength)
    );

    const totalPages = Math.ceil(listUniversity.length / itemsPerPage);



    const currentItems = listUniversity.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const filtered = universities.filter(u => u.main === id);

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} />
            <Navbar />
            <div className="university-list-container">
                <h2 className="university-list-title">Danh sách trường đại học</h2>
                <div className="d-flex gap-3 flex-wrap align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: '320px' }}
                        placeholder="🔍 Tìm kiếm theo tên hoặc mã trường..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select
                        className="form-select"
                        style={{ maxWidth: '280px' }}
                        value={selectedStrength}
                        onChange={(e) => setSelectedStrength(e.target.value)}
                    >
                        {strengthOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="row">
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                ) : (
                    <div className="university-list-grid">
                        {currentItems.map((uni) => (
                            <div key={uni.universityId} className="university-list-card">
                                <img src={uni.thumbnail} alt={uni.universityName} className="university-list-thumbnail" />
                                <h3 className="university-list-name">{uni.universityName}</h3>
                                <Link to={`/danh-sach-truong/${uni.universityId}`} className="university-list-detail-link">Xem chi tiết</Link>
                            </div>
                        ))}
                    </div>
                )}
                {/* Pagination */}
                <nav className="mt-4 d-flex justify-content-center">
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <li key={idx + 1} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(idx + 1)}>{idx + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <Footer />
        </>
    );
};

export default ListUniversitiesView; 