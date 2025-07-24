import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import './FavoriteUniversity.css'
import { useNavigate } from "react-router-dom";

const FavoriteUniversity = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true); // bổ sung đây
                const response = await axios.get("/api/uni/v2/favorite");
                setFavorites(response.data.data || []);
                toast.success("Tải danh sách trường yêu thích thành công");
            } catch (error) {
                console.error("Lỗi khi tải danh sách trường yêu thích:", error);
                toast.error("Tải danh sách trường yêu thích thất bại");
            }
            finally {
                setLoading(false);
            }
        }
        fetchFavorites();
    }, []);


    const handleUnlike = async (universityId) => {
        try {
            await axios.delete(`/api/uni/favorite/${universityId}`);
            setFavorites(prev => prev.filter(u => u.universityId !== universityId));
            toast.success("Đã xoá trường khỏi danh sách yêu thích");
        } catch (error) {
            console.error("Lỗi khi unlike trường:", error);
            toast.error("Không thể xoá trường khỏi yêu thích");
        }
    };


    const filteredFavorites = favorites.filter(university =>
        university.universityName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);


    const currentItems = filteredFavorites.slice(
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


    const handleCardClick = (id) => {
        navigate(`/danh-sach-truong/${id}`);
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <ToastContainer position="top-right" autoClose={5000} />
            <Navbar />
            <main className="flex-grow-1 container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold fs-3 mb-0">
                        🎓 Danh sách trường yêu thích
                    </h1>
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: '320px' }}
                        placeholder="🔍 Tìm kiếm theo tên hoặc mã trường..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : filteredFavorites.length === 0 ? (
                    <p className="text-center text-secondary">Không tìm thấy trường phù hợp.</p>
                ) : (
                    <>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                            {currentItems.map(university => (
                                <div key={university.universityId} className="col">
                                    <div
                                        className="card h-100 shadow-sm rounded-4 card-hover position-relative"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleCardClick(university.universityId)}
                                    >
                                        <i
                                            className="fa-solid fa-heart position-absolute top-0 end-0 m-2 text-danger"
                                            style={{ fontSize: '1.4rem', zIndex: 1 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnlike(university.universityId);
                                            }}
                                            title="Bỏ yêu thích"
                                        ></i>

                                        <img
                                            src={university.thumbnail || "https://picsum.photos/200/150"}
                                            className="card-img-top rounded-top-4"
                                            alt={university.universityName}
                                            style={{ height: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {university.universityName} - {university.code}
                                            </h5>
                                            <p className="card-text text-muted">📍 {university.address}</p>
                                            {university.main && (
                                                <p className="card-text text-muted">⚡ {university.main}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default FavoriteUniversity;
