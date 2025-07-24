import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ListUniversitiesView.css';

const UniversitiesGeneralDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/api/universities/${id}`);
                setData(res.data.data);
            } catch (err) {
                setError('Không thể tải dữ liệu trường.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="list-loader-container" style={{ minHeight: 300 }}>
                <div className="list-loader"></div>
            </div>
        );
    }
    if (error) {
        return <div className="text-center text-danger my-4">{error}</div>;
    }
    if (!data) return null;

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h2 className="fw-bold mb-2">{data.universityName} <span className="badge bg-primary align-middle">{data.code}</span></h2>
                <div className="mb-1"><strong>Địa chỉ:</strong> {data.address || 'Chưa cập nhật'}</div>
                <div className="mb-1"><strong>Loại trường:</strong> {data.main || 'Chưa cập nhật'}</div>
            </div>
            <h4 className="mb-3">Danh sách ngành đào tạo</h4>
            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Tên ngành</th>
                            <th>Tổ hợp môn</th>
                            <th>Điểm chuẩn các năm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.universityMajors.map((major) => (
                            <tr key={major.majorId}>
                                <td className="fw-semibold">{major.majorName}</td>
                                <td>
                                    {major.combo.map((c) => (
                                        <div key={c.codeCombination}>
                                            <span className="badge bg-secondary me-1">{c.codeCombination}</span>
                                            <span>{c.subjectName.join(', ')}</span>
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {major.scoreOverview.map((yearObj) => (
                                        <div key={yearObj.year} className="mb-2">
                                            <div className="fw-bold">Năm {yearObj.year}:</div>
                                            <ul className="mb-0 ps-3">
                                                {yearObj.scoreDetails.map((s, idx) => (
                                                    <li key={s.type + idx}>
                                                        <span className="text-primary">{s.type}</span>: <span className="fw-semibold">{s.score}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UniversitiesGeneralDetail; 