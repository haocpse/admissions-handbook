
import React, { useEffect, useState } from "react";
import "./UniCompare.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const accentColor = "#225bbf";

const UniCompare = () => {
  const [universities, setUniversities] = useState([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [uni1, setUni1] = useState(null);
  const [uni2, setUni2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/uni/v1");
        setUniversities(res.data.data || []);
      } catch (err) {
        setError("Không thể tải danh sách trường.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchUniversityById = async (id, setter) => {
    try {
      const res = await axios.get(`/api/uni/v1/${id}`);
      setter(res.data.data);
    } catch (err) {
      console.error(`Lỗi khi lấy dữ liệu trường ID ${id}:`, err);
    }
  };

  useEffect(() => {
    if (selected1) {
      fetchUniversityById(selected1, setUni1);
    } else {
      setUni1(null);
    }
  }, [selected1]);

  useEffect(() => {
    if (selected2) {
      fetchUniversityById(selected2, setUni2);
    } else {
      setUni2(null);
    }
  }, [selected2]);

  // Lấy ngành điểm cao nhất/thấp nhất cho từng phương thức
  const getMajorStatsByType = (uni) => {
    if (!uni || !uni.universityMajors || uni.universityMajors.length === 0) return {};
    const typeStats = {};
    uni.universityMajors.forEach((major) => {
      major.scoreOverview?.forEach((y) => {
        y.scoreDetails?.forEach((s) => {
          if (typeof s.score === 'number') {
            if (!typeStats[s.type]) {
              typeStats[s.type] = { max: { major, score: s.score }, min: { major, score: s.score } };
            } else {
              if (s.score > typeStats[s.type].max.score) {
                typeStats[s.type].max = { major, score: s.score };
              }
              if (s.score < typeStats[s.type].min.score) {
                typeStats[s.type].min = { major, score: s.score };
              }
            }
          }
        });
      });
    });
    return typeStats;
  };

  // Render sao đánh giá
  const renderStars = (rating) => {
    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || !isFinite(parsedRating)) return (
      <span className="text-muted">Chưa có</span>
    );

    const fullStars = Math.floor(parsedRating);
    const halfStar = parsedRating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill" style={{ color: '#FFD700', fontSize: 22 }}></i>);
    }
    if (halfStar) {
      stars.push(<i key="half" className="bi bi-star-half" style={{ color: '#FFD700', fontSize: 22 }}></i>);
    }
    while (stars.length < 5) {
      stars.push(<i key={stars.length} className="bi bi-star" style={{ color: '#FFD700', fontSize: 22 }}></i>);
    }
    return stars;
  };

  return (
    <>
      <Navbar />
      <div className="uni-compare-page bg-light min-vh-100 py-4">
        <div className="container">
          <h1 className="uni-compare-title text-center mb-2" style={{ color: accentColor, fontWeight: 800, fontSize: 36, letterSpacing: 1 }}>
            So sánh 2 trường đại học
          </h1>
          <p className="uni-compare-description text-center mb-4" style={{ fontSize: 18, color: '#444' }}>
            Chọn 2 trường để xem thông tin so sánh chi tiết.
          </p>
          {error && <div className="text-danger text-center mb-3">{error}</div>}
          {loading ? (
            <div className="list-loader-container" style={{ minHeight: 120 }}>
              <div className="list-loader"></div>
            </div>
          ) : (
            <>
              <div className="row g-3 mb-4 justify-content-center">
                <div className="col-12 col-md-5">
                  <select
                    className="form-select mb-2 shadow-sm"
                    value={selected1}
                    onChange={e => setSelected1(e.target.value)}
                    style={{ fontSize: 17, borderColor: accentColor }}
                  >
                    <option value="">-- Chọn trường thứ nhất --</option>
                    {universities.map(u => (
                      <option key={u.universityId} value={u.universityId} disabled={selected2 && Number(selected2) === u.universityId}>
                        {u.universityName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-5">
                  <select
                    className="form-select mb-2 shadow-sm"
                    value={selected2}
                    onChange={e => setSelected2(e.target.value)}
                    style={{ fontSize: 17, borderColor: accentColor }}
                  >
                    <option value="">-- Chọn trường thứ hai --</option>
                    {universities.map(u => (
                      <option key={u.universityId} value={u.universityId} disabled={selected1 && Number(selected1) === u.universityId}>
                        {u.universityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row g-4">
                {[uni1, uni2].map((uni, idx) => {
                  const statsByType = getMajorStatsByType(uni);
                  return (
                    <div className="col-12 col-md-6" key={idx}>
                      {uni ? (
                        <div
                          className="uni-card card shadow-lg h-100 border-0 position-relative hoverable"
                          style={{ borderLeft: idx === 0 ? `7px solid ${accentColor}` : undefined, borderRight: idx === 1 ? `7px solid ${accentColor}` : undefined, borderRadius: 18, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                          onClick={() => navigate(`/danh-sach-truong/${uni.universityId}`)}
                        >
                          <div className="card-body d-flex flex-column align-items-center text-center p-4">
                            <div className="d-flex align-items-center justify-content-center mb-2" style={{ gap: 8 }}>
                              <h4 className="card-title fw-bold mb-0" style={{ color: accentColor, fontSize: 26 }}>
                                {uni.universityName}
                              </h4>
                              <i className="bi bi-star-fill ms-2" style={{ color: '#FFD700', fontSize: 28, marginTop: -2 }}></i>
                            </div>
                            {/* Đánh giá sao */}
                            <div className="mb-2 d-flex align-items-center justify-content-center" style={{ gap: 4 }}>
                              {renderStars(uni.pointRating)}
                              {!isNaN(parseFloat(uni.pointRating)) && isFinite(uni.pointRating) ? (
                                <span className="fw-bold ms-2" style={{ color: '#222', fontSize: 20 }}>
                                  {parseFloat(uni.pointRating).toFixed(1)} / 5
                                </span>
                              ) : (
                                <span className="fw-bold ms-2 text-muted" style={{ fontSize: 18 }}>
                                  Chưa có đánh giá
                                </span>
                              )}
                            </div>
                            <div className="mb-1"><span className="badge bg-primary" style={{ fontSize: 15 }}>{uni.code}</span></div>
                            <div className="mb-1"><i className="bi bi-geo-alt-fill me-1" style={{ color: accentColor }}></i><strong>Địa điểm:</strong> {uni.address || <span className="text-muted">Chưa cập nhật</span>}</div>
                            <div className="mb-1"><i className="bi bi-lightning-charge-fill me-1" style={{ color: accentColor }}></i><strong>Thế mạnh:</strong> {uni.main || <span className="text-muted">Chưa cập nhật</span>}</div>
                            <div className="mb-1"><i className="bi bi-list-ol me-1" style={{ color: accentColor }}></i><strong>Số ngành đào tạo:</strong> {uni.universityMajors?.length || 0}</div>
                            <div className="mb-2 w-100">
                              <strong style={{ color: accentColor }}>So sánh điểm theo từng phương thức:</strong>
                              {Object.keys(statsByType).length === 0 ? (
                                <div className="text-muted mt-2">Không có dữ liệu</div>
                              ) : (
                                <div className="row g-2 mt-2">
                                  {Object.entries(statsByType).map(([type, { max, min }]) => (
                                    <div className="col-12 col-sm-6" key={type}>
                                      <div className="method-card card border-0 shadow-sm h-100 p-3 mb-2" style={{ borderRadius: 12, transition: 'box-shadow 0.2s' }}>
                                        <div className="d-flex align-items-center mb-2">
                                          <span className="me-2" style={{ fontSize: 22, color: accentColor }}>
                                            <i className="bi bi-bar-chart-fill"></i>
                                          </span>
                                          <span className="fw-bold" style={{ color: accentColor, fontSize: 17 }}>{type}</span>
                                        </div>
                                        <div style={{ fontSize: 15 }}>
                                          <span className="d-block mb-1">• <b>Cao nhất:</b> <span className="badge bg-success" style={{ fontSize: 15 }}>{max.score}</span> <span style={{ color: accentColor }}>{max.major.majorName}</span></span>
                                          <span className="d-block">• <b>Thấp nhất:</b> <span className="badge bg-danger" style={{ fontSize: 15 }}>{min.score}</span> <span style={{ color: accentColor }}>{min.major.majorName}</span></span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted uni-card-empty">Chưa chọn trường</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UniCompare;
