import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ManageMajor = () => {
    const [universities, setUniversities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();


    const fetchUniversity = async () => {
        try {
            const response = await axios.get('/api/uni/v1');
            setUniversities(response.data.data || []);
            toast.success("Tải danh sách trường đại học thành công");
        } catch (error) {
            console.error("Lỗi khi tải danh sách trường đại học:", error);
            toast.error("Tải danh sách trường đại học thất bại");
        }
    };

    useEffect(() => {
        fetchUniversity();
    }, []);


    const filteredUniversities = universities.filter(u =>
        u.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
    const currentItems = filteredUniversities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handleCardClick = (university) => {
        navigate(`/admin/manage-nganh-hoc/${university.universityId}`, { state: { tenTruong: university.universityName, maTruong: university.code } });
    };


    return (
        <div className="manage-university bg-light min-vh-100 p-4">
            <ToastContainer position="top-right" autoClose={5000} />
            <h1 className="mb-4 text-center">🎓Quản lý Ngành Học</h1>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <input
                    type="text"
                    className="form-control mb-2"
                    style={{ maxWidth: '300px' }}
                    placeholder="🔍 Tìm kiếm theo tên hoặc mã trường..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>


            <div className="row">
                {currentItems.length === 0 ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : (
                    currentItems.map((university, index) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={university.universityId}>
                            <div
                                className="card h-100 shadow-sm card-hover"
                                onClick={() => handleCardClick(university)}
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={university.thumbnail || `https://picsum.photos/200/150?random=${index}`}
                                    className="card-img-top"
                                    alt={university.universityName}
                                    style={{ height: "150px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{university.universityName} - {university.code}</h5>
                                    <p className="card-text text-muted">📍 {university.address}</p>
                                    {university.main && <p className="card-text text-muted">⚡ {university.main}</p>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
export default ManageMajor;

