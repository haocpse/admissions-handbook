import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ManageNews.css";

const ManageNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        link: "",
        categoryId: ""
    });

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/categories/getAll");
            let arr = [];

            if (Array.isArray(res.data?.data?.categories)) {
                arr = res.data.data.categories;
            }

            const mapped = arr.map(cat => ({
                id: cat.categoryId,
                name: cat.categoryName
            }));
            setCategories(mapped);
        } catch {
            setCategories([]);
            toast.error("Không thể tải danh mục!");
        }
    };

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/news/GetAll");
            let arr = [];
            if (Array.isArray(response.data?.data?.newDetailResponseList)) {
                arr = response.data.data.newDetailResponseList;
            }
            setNewsList(arr);
            setLoading(false);
        } catch (err) {
            console.error("FETCH FAILED", err);
            setLoading(false);
            toast.error("Tải danh sách tin tức thất bại");
            setNewsList([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchNews();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => setFormData({ link: "", categoryId: "" });

    const handleAddNews = async (e) => {
        e.preventDefault();
        if (!formData.link || !formData.categoryId) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            await axios.post("/api/news/create", {
                link: formData.link,
                categoryId: formData.categoryId
            });
            toast.success("Thêm tin tức thành công!");
            setShowModal(false);
            resetForm();
            fetchNews();
        } catch {
            toast.error("Thêm tin tức thất bại!");
        }
    };

    const handleDeleteNews = async (newsId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
        try {
            await axios.delete(`/api/news/delete/${newsId}`); // ✅ Sửa đúng endpoint ở đây
            toast.success("Xóa bài viết thành công!");
            fetchNews();
        } catch {
            toast.error("Xóa bài viết thất bại!");
        }
    };

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : "Không rõ danh mục";
    };

    return (
        <div className="manage-news">
            <ToastContainer position="top-right" autoClose={4000} />
            <div className="manage-news-header">
                <h1>📰 Quản lý Tin tức</h1>
            </div>
            <div className="manage-news-controls">
                <button className="add-btn" onClick={() => setShowModal(true)}>
                    + Tạo thêm news
                </button>
            </div>
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="news-grid">
                    {Array.isArray(newsList) && newsList.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📰</div>
                            <h3>Không có dữ liệu</h3>
                        </div>
                    ) : (
                        newsList.map((news) => (
                            <div key={news.newId} className="news-card">
                                <div className="news-content">
                                    {news.thumbnail && (
                                        <div style={{ marginBottom: 10 }}>
                                            <img
                                                src={news.thumbnail}
                                                alt="thumbnail"
                                                style={{ maxWidth: 180, borderRadius: 8, display: "block" }}
                                            />
                                        </div>
                                    )}
                                    {news.title && (
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Tiêu đề:</strong> {news.title}
                                        </div>
                                    )}
                                    <div>
                                        <strong>Link:</strong>{" "}
                                        <a href={news.link} target="_blank" rel="noopener noreferrer">
                                            {news.link}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>Chuyên mục:</strong>{" "}
                                        {news.categoryName || "Không rõ danh mục"}
                                    </div>
                                    <div>
                                        <strong>Bình luận:</strong>{" "}
                                        {news.comments && Array.isArray(news.comments) && news.comments.length > 0 ? (
                                            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                                                {news.comments.map((cmt, idx) => (
                                                    <li key={idx} style={{ marginBottom: 4 }}>
                                                        {typeof cmt === "string" ? cmt : JSON.stringify(cmt)}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Không có bình luận</span>
                                        )}
                                    </div>
                                    <div style={{ marginTop: 12 }}>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteNews(news.newId)}
                                            style={{
                                                background: "#ff4d4f",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "6px 16px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="manage-news-modal-content">
                        <div className="modal-header">
                            <h2>Thêm bài viết mới</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddNews} className="modal-form">
                            <div className="form-group">
                                <label>Link bài viết *</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="Nhập link bài viết"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Chuyên mục *</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">-- Chọn chuyên mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="submit-btn">
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageNews;
