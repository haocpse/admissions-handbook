import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './FilterUniversities.css';
import axios from 'axios';

const accentColor = '#225bbf';

const FilterUniversities = () => {
    const { id } = useParams(); // id = majorId
    const location = useLocation();
    const navigate = useNavigate();

    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [majors, setMajors] = useState([]);
    const [selectedMajorId, setSelectedMajorId] = useState(null);
    const [filterName, setFilterName] = useState('');

    // Fetch danh sách ngành 1 lần
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const res = await axios.get("/api/uni/v1/major");
                setMajors(res.data.data || []);
            } catch (err) {
                console.error("Không thể tải danh sách ngành", err);
            }
        };
        fetchMajors();
    }, []);

    // Set selectedMajorId từ URL hoặc state truyền sang
    useEffect(() => {
        const initialMajorId = location.state?.selected?.value || id;
        if (initialMajorId) {
            setSelectedMajorId(Number(initialMajorId));
        }
    }, [id, location.state]);

    // Gọi API theo selectedMajorId
    useEffect(() => {
        if (!selectedMajorId) return;

        const fetchUniversitiesByMajor = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/uni/v1/by-major?majorId=${selectedMajorId}`);
                const detailList = res.data.data?.detailResponseList || [];
                const mapped = detailList.map(item => ({
                    ...item.university,
                    total: item.total,
                    universityMajors: item.university.universityMajors || []
                }));
                setUniversities(mapped);

                const selectedMajor = majors.find(m => m.majorId === selectedMajorId);
                setFilterName(selectedMajor?.majorName || "Ngành");
            } catch (err) {
                setError("Không thể tải danh sách trường.");
                setUniversities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversitiesByMajor();
    }, [selectedMajorId, majors]);

    // Lấy tất cả các năm điểm chuẩn
    const allYearsSet = new Set();
    universities.forEach(uni => {
        uni.universityMajors?.forEach(m => {
            m.scoreOverview?.forEach(so => {
                allYearsSet.add(so.year);
            });
        });
    });
    const allYears = Array.from(allYearsSet).sort((a, b) => b - a).slice(0, 2);
    const colSpan = allYears.length || 1;

    return (
        <>
            <Navbar />
            <div className="container py-4 min-vh-100">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Lọc theo ngành:</label>
                    <select
                        className="form-select"
                        value={selectedMajorId ?? ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedMajorId(value === "" ? null : Number(value));
                        }}
                    >
                        <option value="">-- Chọn ngành --</option>
                        {majors.map(m => (
                            <option key={m.majorId} value={m.majorId}>
                                {m.majorName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="card shadow p-4 mb-4" style={{ borderRadius: 16 }}>
                    <h3 className="mb-3" style={{ color: accentColor }}>
                        Danh sách trường xét tuyển theo ngành:{" "}
                        <span style={{ color: '#111' }}>
                            {filterName || "Chưa chọn ngành"}
                        </span>
                    </h3>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="list-loader" style={{ margin: '0 auto' }}></div>
                            <div className="mt-3 text-muted">Đang tải danh sách trường...</div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : universities.length === 0 ? (
                        <div className="text-center text-muted py-5">Không có trường nào phù hợp.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className="text-center">Tên trường</th>
                                        <th rowSpan={2} className="text-center">Mã trường</th>
                                        <th colSpan={colSpan} className="text-center">Điểm chuẩn</th>
                                        <th rowSpan={2}></th>
                                    </tr>
                                    <tr>
                                        {allYears.map(year => (
                                            <th key={year} className="text-center">{year}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {universities.map(uni => {
                                        const scoresByYear = {};
                                        uni.universityMajors.forEach(m => {
                                            m.scoreOverview?.forEach(so => {
                                                if (!scoresByYear[so.year]) scoresByYear[so.year] = [];
                                                so.scoreDetails.forEach(s => {
                                                    const exists = scoresByYear[so.year].find(item => item.type === s.type);
                                                    if (!exists) {
                                                        scoresByYear[so.year].push(s);
                                                    } else {
                                                        exists.score = Math.max(existing.score, s.score);
                                                    }
                                                });
                                            });
                                        });

                                        return (
                                            <tr key={uni.universityId}>
                                                <td className="text-center" style={{ color: accentColor, fontWeight: 600 }}>{uni.universityName}</td>
                                                <td className="text-center">{uni.code}</td>
                                                {allYears.map(year => (
                                                    <td className="text-center" key={year}>
                                                        {scoresByYear[year]?.length > 0 ? (
                                                            scoresByYear[year].map((s, i) => (
                                                                <div key={i}>{s.type}: <strong>{s.score}</strong></div>
                                                            ))
                                                        ) : (
                                                            <span className="text-muted">–</span>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => navigate(`/danh-sach-truong/${uni.universityId}`)}
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FilterUniversities;
