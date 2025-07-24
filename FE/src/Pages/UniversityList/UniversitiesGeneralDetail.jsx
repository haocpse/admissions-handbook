import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './ListUniversitiesView.css';
import { jwtDecode } from 'jwt-decode';

const accentColor = '#225bbf';

const UniversitiesGeneralDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const preselectedCombo = location.state?.selectedCombo || '';
    const [selectedComboCode, setSelectedComboCode] = useState(preselectedCombo);
    const [hoveredStar, setHoveredStar] = useState(0); // ⭐ trạng thái hover
    const [selectedStar, setSelectedStar] = useState(0); // ⭐ đã chọn
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/uni/v1/${id}`);
                setData(res.data.data);
            } catch (err) {
                setError('Không thể tải dữ liệu trường.');
            } finally {
                setLoading(false);
            }
        };
        const checkFavorite = async () => {
            const token = localStorage.getItem("token");
            let decoded = "";
            if (token) {
                try {
                    decoded = jwtDecode(token);
                } catch (err) {
                    console.error("Lỗi khi giải mã token:", err);
                }
            }
            if(decoded === "") return;
            try {
                const res = await axios.post("/api/uni/v1/check-favorite", {
                    username: decoded.sub,
                    universityId: parseInt(id)
                });
                setIsFavorite(res.data.data === true);
            } catch (err) {
                console.error("Lỗi khi kiểm tra yêu thích", err);
            }
        };
        checkFavorite();
        fetchData();
    }, [id]);

    const reloadData = async () => {
        try {
            const res = await axios.get(`/api/uni/v1/${id}`);
            setData(res.data.data);
        } catch (err) {
            setError("Không thể tải lại dữ liệu.");
        }
    };

    const handleRate = async (star) => {
        try {
            await axios.post(`/api/uni/v1/rating/${data.universityId}`, { rating: star });
            setSelectedStar(star);
            await reloadData();
        } catch (err) {
            alert("Lỗi khi gửi đánh giá.");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="list-loader-container" style={{ minHeight: 300 }}>
                    <div className="list-loader"></div>
                </div>
                <Footer />
            </>
        );
    }
    if (error) {
        return (
            <>
                <Navbar />
                <div className="text-center text-danger my-4">{error}</div>
                <Footer />
            </>
        );
    }
    if (!data) return null;

    const allCombos = data.universityMajors.flatMap(major => major.combo || []);
    const uniqueComboCodes = [...new Set(allCombos.map(c => c.codeCombination))];

    const handleFavoriteToggle = async () => {
        try {
            if (isFavorite) {
                await axios.delete(`/api/uni/favorite/${data.universityId}`);
                setIsFavorite(false);
            } else {
                await axios.post(`/api/uni/favorite/${data.universityId}`);
                setIsFavorite(true);
            }
        } catch (err) {
            alert("Lỗi khi cập nhật yêu thích.");
        }
    };
    return (
        <>
            <Navbar />
            <div className="container py-5" style={{ minHeight: '70vh' }}>
                {/* Header */}
                <div className="row align-items-center mb-5">
                    {data.thumbnail && (
                        <div className="col-md-3 text-center mb-3 mb-md-0">
                            <img
                                src={data.thumbnail}
                                alt={data.universityName}
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: 200, objectFit: 'contain' }}
                            />
                        </div>
                    )}
                    <div className="col-md-6">
                        <h2 className="fw-bold" style={{ color: accentColor }}>
                            {data.universityName}{' '}
                            <span className="badge bg-primary">{data.code}</span>
                            {data.verified && (
                                <i
                                    className="fas fa-check-circle text-success ms-2"
                                    title="Đã xác thực"
                                    style={{ fontSize: '1.2rem', verticalAlign: 'middle' }}
                                ></i>
                            )}
                        </h2>
                        <p className="mb-1">
                            <strong>Địa chỉ:</strong>{' '}
                            {data.address || <span className="text-muted">Chưa cập nhật</span>}
                        </p>
                        <p className="mb-0">
                            <strong>Loại trường:</strong>{' '}
                            {data.main || <span className="text-muted">Chưa cập nhật</span>}
                        </p>
                        {/* Điểm đánh giá trung bình */}
                        {!isNaN(parseFloat(data.pointRating)) && isFinite(data.pointRating) ? (
                            <>
                                {Array.from({ length: 5 }, (_, i) => (
                                    <i
                                        key={i}
                                        className={`me-1 ${i < Math.round(parseFloat(data.pointRating)) ? "fas fa-star text-warning" : "far fa-star text-warning"
                                            }`}
                                    ></i>
                                ))}
                                <span className="ms-1 text-muted">({parseFloat(data.pointRating).toFixed(1)} / 5)</span>
                            </>
                        ) : (
                            <span className="text-muted">Chưa có</span>
                        )}

                        {/* ⭐⭐ Đánh giá tương tác ⭐⭐ */}
                        <div className="mt-1">
                            <label className="form-label fw-bold mb-1">Đánh giá của bạn:</label>
                            <div>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`fa-star me-1 ${(hoveredStar || selectedStar) >= star ? "fas text-warning" : "far text-muted"
                                            }`}
                                        style={{ cursor: "pointer", fontSize: "1.4rem" }}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        onClick={() => handleRate(star)}
                                    ></i>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="col-md-3 text-md-end text-center mt-3 mt-md-0">
                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate('/diem-chuan', {
                                    state: { universityId: data.universityId },
                                })
                            }
                        >
                            Xem điểm chuẩn
                        </button><br/>
                        <button
                            className={`mt-2 btn ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
                            onClick={handleFavoriteToggle}
                        >
                            {isFavorite ? "💔 Bỏ yêu thích" : "❤️ Thêm vào yêu thích"}
                        </button>
                    </div>
                </div>
                {/* Major list */}
                <h4 className="mb-3 fw-bold" style={{ color: accentColor }}>
                    Danh sách ngành đào tạo
                </h4>
                <div className="mb-3">
                    <select
                        id="comboFilter"
                        className="form-select"
                        value={selectedComboCode}
                        onChange={(e) => setSelectedComboCode(e.target.value)}
                    >
                        <option value="">-- Hiển thị tất cả --</option>
                        {[...new Map(
                            allCombos.map(c => [c.codeCombination, c])
                        )].map(([code, combo]) => (
                            <option key={code} value={code}>
                                {code} – {combo.subjectName.join(", ")}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle shadow-sm bg-white">
                        <thead className="table-primary">
                            <tr>
                                <th style={{ width: '20%' }}>Mã ngành</th>
                                <th style={{ width: '40%' }}>Tên ngành</th>
                                <th style={{ width: '40%' }}>Tổ hợp môn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.universityMajors
                                .filter(major =>
                                    !selectedComboCode ||
                                    major.combo.some(c => c.codeCombination === selectedComboCode)
                                )
                                .map((major) => (
                                    <tr key={major.majorId}>
                                        <td style={{ color: accentColor }}>
                                            <strong>{major.majorCode}</strong>
                                        </td>
                                        <td style={{ color: accentColor }}>
                                            <strong>{major.majorName}</strong>
                                        </td>
                                        <td>
                                            {major.combo.map((c) => (
                                                <div
                                                    key={c.codeCombination}
                                                    className="mb-1 d-flex align-items-start"
                                                >
                                                    <span
                                                        className="badge me-2"
                                                        style={{
                                                            background: accentColor,
                                                            color: '#fff',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {c.codeCombination}
                                                    </span>
                                                    <span style={{ color: '#333' }}>
                                                        {c.subjectName.join(', ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UniversitiesGeneralDetail; 