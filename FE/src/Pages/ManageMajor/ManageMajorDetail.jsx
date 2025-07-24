import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './ManageMajorDetail.css'
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const ManageMajorDetail = () => {
    const { id } = useParams();
    const [majorList, setMajorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [newMaNganh, setNewMaNganh] = useState("");
    const [newTenNganh, setNewTenNganh] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingMajor, setEditingMajor] = useState(null);
    const [updatedTenNganh, setUpdatedTenNganh] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [isAdmin, setIsAdmin] = useState(false);


    const fetchNganhHoc = async () => {
        try {
            const response = await axios.get(`/api/uni/v1/major`);
            setMajorList(response.data.data);
            toast.success("Tải danh sách ngành học thành công");
        } catch (error) {
            toast.error("Tải danh sách ngành học thất bại");
            console.error("Lỗi khi tải chi tiết ngành học:", error);

        } finally {
            setLoading(false);
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
                console.error("Lỗi giải mã token:", err);
            }
        }
    }, []);


    useEffect(() => {
        fetchNganhHoc();
    }, [id]);


    const handleAddMajor = async () => {
        try {
            if (!newTenNganh) {
                toast.error("Vui lòng nhập đầy đủ thông tin mã ngành và tên ngành");
                return;
            }
            console.log({
                majorName: newTenNganh
            });
            const response = await axios.post(`/api/uni/major`, {
                name: newTenNganh,
            });

            if (response.data.code === 200) {
                toast.success("Thêm ngành học thành công");



                const newMajor = {
                    majorId: response.data.data.id || response.data.data.majorId, // tùy theo backend trả id
                    majorName: newTenNganh,
                    totalUni: 0 // đảm bảo hiển thị đúng
                };

                setMajorList(prev => [...prev, newMajor]);
                setNewTenNganh("");
                setShowModal(false);
            } else {
                toast.error("Thêm ngành học thất bại");
            }
        }
        catch (error) {
            console.error("Lỗi khi thêm ngành học:", error);
            toast.error("Thêm ngành học thất bại");
        }
    }

    const handleDeleteMajor = async (majorId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa ngành này không?")) return;

        try {
            const response = await axios.delete(`/api/uni/v1/major/${majorId}`);
            if (response.data.code === 200) {
                toast.success("Xóa ngành học thành công");
                setMajorList(prev => prev.filter(m => m.majorId !== majorId));
            } else {
                toast.error("Xóa ngành học thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa ngành học:", error);
            toast.error("Xóa ngành học thất bại");
        }
    };

    const handleEditClick = (major) => {
        setEditingMajor(major);
        setUpdatedTenNganh(major.majorName);
        setShowEditModal(true);
    };

    const handleUpdateMajor = async () => {
        if (!updatedTenNganh) {
            toast.error("Tên ngành không được để trống");
            return;
        }

        try {
            const response = await axios.put(`/api/uni/v1/major/${editingMajor.majorId}`, {
                name: updatedTenNganh
            });

            if (response.data.code === 200) {
                toast.success("Cập nhật ngành học thành công");
                setMajorList(prev =>
                    prev.map(m =>
                        m.majorId === editingMajor.majorId
                            ? { ...m, majorName: updatedTenNganh }
                            : m
                    )
                );
                setShowEditModal(false);
                setEditingMajor(null);
            } else {
                toast.error("Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Lỗi cập nhật ngành:", error);
            toast.error("Cập nhật thất bại");
        }
    };

    const filteredMajors = majorList.filter(major =>
        major.majorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredMajors.length / itemsPerPage);
    const currentItems = filteredMajors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="manage-major-detail bg-light min-vh-100 p-4">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="d-flex justify-content-center align-items-center mb-4 gap-2" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                <span>📘Quản lý Ngành Học</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div className="mb-2">
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: '400px' }}
                        placeholder="🔍 Tìm kiếm ngành học..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); 
                        }}
                    />
                </div>
                {isAdmin && (
                    <div className="buttons mb-2">
                        <button className="btn" onClick={() => setShowModal(true)}>
                            <span></span>
                            <p data-start="good luck!" data-text="start!" data-title="Thêm Ngành"></p>
                        </button>
                    </div>
                )}
            </div>


            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th className="text-center">STT</th>
                            <th className="text-center">Tên ngành</th>
                            <th className="text-center">Số lượng trường xét tuyển</th>
                            <th className="text-center">HĐ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((major, index) => (
                            <tr key={major.majorId}>
                                <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                <td className="text-center">{major.majorName}</td>
                                <td className="text-center">{major.totalUni}</td>
                                <td className="text-center">
                                    {major.totalUni === 0 ? (
                                        <>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(major)}>
                                                Sửa
                                            </button>
                                            {isAdmin && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMajor(major.majorId)}>
                                                    Xóa
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-muted">Không thể xóa/sửa</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            )}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
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

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4 bg-white rounded shadow">
                        <h5 className="mb-3 text-center">📘 Thêm Ngành Học</h5>
                        <div className="form-group mb-3">
                            <label><i className="fas fa-book me-2"></i>Tên Ngành</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newTenNganh}
                                onChange={(e) => setNewTenNganh(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleAddMajor}>Thêm</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content p-4 bg-white rounded shadow">
                        <h5 className="mb-3 text-center">✏️ Sửa Ngành Học</h5>
                        <div className="form-group mb-3">
                            <label><i className="fas fa-book me-2"></i>Tên Ngành</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedTenNganh}
                                onChange={(e) => setUpdatedTenNganh(e.target.value)}
                            />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleUpdateMajor}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMajorDetail;


