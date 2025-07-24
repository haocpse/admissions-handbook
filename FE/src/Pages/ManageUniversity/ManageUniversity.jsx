import React, { useEffect, useState } from "react";
import './ManageUniversity.css';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AddUniversityPopUp from "./AddUniversityPopUp";
import UpdateUniversityPopUp from "./UpdateUniversityPopUp";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ManageUniversity = () => {
    const navigate = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [universityToEdit, setUniversityToEdit] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);



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
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.scope === "ADMIN") {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Lỗi khi giải mã token:", err);
            }
        }
    }, []);

    useEffect(() => {
        fetchUniversity();
    }, []);

    const handleCreateUniversity = async (formData) => {
        try {
            const dataToSend = new FormData();
            dataToSend.append("universityName", formData.tenTruong);
            dataToSend.append("code", formData.maTruong);
            dataToSend.append("address", formData.diaChi);
            dataToSend.append("main", formData.theManh);
            if (formData.thumbnail) {
                dataToSend.append("thumbnail", formData.thumbnail);
            }
            console.log(formData)
            await axios.post('/api/uni', dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Tạo mới thành công!");
            setShowModal(false);
            fetchUniversity();
        } catch (error) {
            console.error("Lỗi khi tạo mới:", error);
            toast.error("Tạo mới thất bại!");
        }
    };



    // ê đít
    const handleEditClick = (university) => {
        setUniversityToEdit(university);
        setShowUpdateModal(true);
    };


    const handleUpdateUniversity = async (updatedForm) => {
        try {
            const dataToSend = new FormData();
            dataToSend.append("universityName", updatedForm.tenTruong);
            dataToSend.append("code", updatedForm.maTruong);
            dataToSend.append("address", updatedForm.diaChi);
            dataToSend.append("main", updatedForm.theManh);

            if (updatedForm.thumbnail) {
                dataToSend.append("thumbnail", updatedForm.thumbnail);
            }

            await axios.put(`/api/uni/${updatedForm.id}`, dataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Cập nhật thành công!");
            setShowUpdateModal(false);
            setUniversityToEdit(null);
            fetchUniversity();
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            toast.error("Cập nhật thất bại!");
        }
    };



    const filteredUniversities = universities.filter(u =>
        u.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
    const currentItems = filteredUniversities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleViewClick = (universityId) => {
        navigate(`/admin/universities/${universityId}`);
    };

    return (
        <div className="manage-university bg-light min-vh-100 p-4">
            <ToastContainer position="top-right" autoClose={5000} />
            <h1 className="mb-4 text-center">🎓Quản lý Trường Đại Học</h1>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <input
                    type="text"
                    className="form-control mb-2"
                    style={{ maxWidth: '400px' }}
                    placeholder="🔍 Tìm kiếm theo tên hoặc mã trường..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                {isAdmin && (
                    <div className="buttons mb-2">
                        <button className="btn" onClick={() => setShowModal(true)}>
                            <span></span>
                            <p data-start="good luck!" data-text="start!" data-title="Tạo mới"></p>
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <AddUniversityPopUp
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateUniversity}
                />
            )}

            <div className="row">
                {currentItems.length === 0 ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : (
                    currentItems.map((university, index) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={university.universityId}>
                            <div className="card h-100 shadow-sm card-hover">
                                <img
                                    src={university.thumbnail ? encodeURI(university.thumbnail) : `https://picsum.photos/200/150?random=${index}`}
                                    alt={university.universityName}
                                    style={{ height: "150px", objectFit: "cover" }}
                                    onError={e => {
                                        e.currentTarget.src = `https://picsum.photos/200/150?random=${index}`;
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{university.universityName} - {university.code}</h5>
                                    <p className="card-text text-muted">📍 {university.address}</p>
                                    {university.main && <p className="card-text text-muted">⚡ {university.main}</p>}

                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => handleEditClick(university)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleViewClick(university.universityId)}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showUpdateModal && universityToEdit && (
                <UpdateUniversityPopUp
                    university={universityToEdit}
                    onClose={() => setShowUpdateModal(false)}
                    onUpdate={handleUpdateUniversity}
                />
            )}

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
};

export default ManageUniversity;
