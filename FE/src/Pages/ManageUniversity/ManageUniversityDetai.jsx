import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './ManageUniversityDetail.css';
import { toast, ToastContainer } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parse, setYear } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

const scoreTypeOptions = [
    { value: 'TNTHPTQG', label: 'Tổt nghiệp trung học phổ thông Quốc Gia' },
    { value: 'DGNLHN', label: 'Đánh giá năng lực Hà Nội' },
    { value: 'DGNLHCM', label: 'Đánh giá năng lực Hồ Chí Minh' },
];

const currentYear = new Date().getFullYear();

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`
            };
        }
        return config;
    },
    error => Promise.reject(error)
);

const ManageUniversityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isStaff, setIsStaff] = useState(false);
    const [university, setUniversity] = useState(null);
    const [majorList, setMajorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingScore, setIsEditingScore] = useState(false);

    // Add Major modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [formAdd, setFormAdd] = useState({
        selectedMajor: null,
        selectedCombos: [],
        majorCode: ""
    });
    const [adding, setAdding] = useState(false);

    // Edit Major modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMajor, setEditMajor] = useState(null);
    const [formEdit, setFormEdit] = useState({
        name: '',
        majorCode: '',
        selectedCombos: []
    });
    const [updating, setUpdating] = useState(false);

    // Options
    const [majorsOptions, setMajorsOptions] = useState([]);
    const [combosOptions, setCombosOptions] = useState([]);

    // Score Detail modal
    const [showScoreModal, setShowScoreModal] = useState(false);
    // state để đang gửi điểm
    const [addingScore, setAddingScore] = useState(false);

    // lưu cả majorId để gọi API
    const [scoreDetails, setScoreDetails] = useState({
        majorId: null,
        majorName: '',
        scoreOverview: []
    });

    // Add Score form
    const [newScore, setNewScore] = useState({ year: '', type: null, score: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [uniRes, majRes, comboRes] = await Promise.all([
                    axios.get(`/api/uni/v1/${id}`),
                    axios.get('/api/uni/v1/major'),
                    axios.get('/api/uni/v1/subject-combo')
                ]);
                const uniData = uniRes.data.data;
                setUniversity(uniData);
                setMajorList(uniData.universityMajors || []);
                setMajorsOptions(
                    majRes.data.data.map(item => ({ value: item.majorName, label: item.majorName }))
                );
                setCombosOptions(
                    comboRes.data.data.map(item => ({ value: item.codeCombination, label: `${item.codeCombination} - ${item.subjectName.join(', ')}` }))
                );
            } catch (err) {
                console.error(err);
                toast.error('Tải dữ liệu thất bại');
                setError('Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(decoded.scope);
                if (decoded.scope === "STAFF") {
                    setIsStaff(true)
                }
            } catch (e) {
                console.error("Invalid token");
            }
        }
    }, []);

    const openAddModal = () => {
        setFormAdd({ selectedMajor: null, selectedCombos: [] });
        setShowAddModal(true);
    };
    const closeAddModal = () => setShowAddModal(false);

    const openEditModal = major => {
        setEditMajor(major);
        setFormEdit({
            name: major.majorName,
            majorCode: major.majorCode,  // ← thêm dòng này
            selectedCombos: combosOptions.filter(c =>
                major.combo.some(mc => mc.codeCombination === c.value)
            )
        });
        setShowEditModal(true);
    };
    const closeEditModal = () => setShowEditModal(false);

    const handleAddMajorSubmit = async () => {
        if (!formAdd.selectedMajor || formAdd.selectedCombos.length === 0) {
            toast.error('Vui lòng chọn ngành và tổ hợp');
            return;
        }
        setAdding(true);
        try {
            await axios.post(`/api/uni/v1/major/by-uni?universityId=${id}`, {
                codeMajor: formAdd.majorCode,
                majorName: formAdd.selectedMajor.value,
                codeCombinations: formAdd.selectedCombos.map(c => c.value)
            });
            toast.success('Thêm ngành thành công');
            const res = await axios.get(`/api/uni/v1/${id}`);
            setMajorList(res.data.data.universityMajors || []);
            closeAddModal();
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi thêm ngành');
        } finally {
            setAdding(false);
        }
    };

    const handleEditMajorSubmit = async () => {
        if (formEdit.selectedCombos.length === 0) {
            toast.error('Vui lòng nhập tên ngành và chọn tổ hợp');
            return;
        }
        setUpdating(true);
        try {
            await axios.put(`/api/uni/v1/${id}/major`, {
                majorName: formEdit.name,
                codeMajor: formEdit.majorCode,
                combos: formEdit.selectedCombos.map(c => c.value)
            });
            toast.success('Cập nhật ngành thành công');
            const res = await axios.get(`/api/uni/v1/${id}`);
            setMajorList(res.data.data.universityMajors || []);
            closeEditModal();
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi cập nhật ngành');
        } finally {
            setUpdating(false);
        }
    };

    // khi mở modal, nhớ gán cả majorId
    const openScoreModal = major => {
        setScoreDetails({
            majorId: major.majorId,
            majorName: major.majorName,
            scoreOverview: major.scoreOverview || []
        });
        setNewScore({ year: '', type: null, score: '' });
        setShowScoreModal(true);
    };

    const handleAddScore = async () => {
        if (!newScore.year || !newScore.type || !newScore.score) {
            toast.error('Vui lòng nhập đầy đủ thông tin điểm');
            return;
        }
        setAddingScore(true);
        try {
            if (isEditingScore !== true) {
                // 1. Gọi API thêm điểm
                await axios.post('/api/uni/v1/score', {
                    universityId: Number(id),
                    majorId: scoreDetails.majorId,
                    year: Number(newScore.year),
                    score: parseFloat(newScore.score),
                    type: newScore.type.value
                });
            } else {
                await axios.put('/api/uni/v1/score', {
                    universityId: Number(id),
                    majorId: scoreDetails.majorId,
                    year: Number(newScore.year),
                    score: parseFloat(newScore.score),
                    type: newScore.type.value
                });
            }

            toast.success('Thêm điểm thành công');

            // 2. Lấy lại dữ liệu mới nhất từ server
            const res = await axios.get(`/api/uni/v1/${id}`);
            const updatedMajors = res.data.data.universityMajors || [];
            setMajorList(updatedMajors);

            // 3. Cập nhật lại scoreOverview cho modal
            const updatedMajor = updatedMajors.find(m => m.majorId === scoreDetails.majorId);
            setScoreDetails(prev => ({
                ...prev,
                scoreOverview: updatedMajor
                    ? updatedMajor.scoreOverview || []
                    : prev.scoreOverview
            }));

            // 4. Xóa form
            setNewScore({ year: '', type: null, score: '' });
            setIsEditingScore(false); // 👈 reset mode về thêm mới

        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi thêm điểm');
        } finally {
            setAddingScore(false);
        }
    };

    const handleDeleteScore = async (year, type) => {
        if (!window.confirm(`Xoá điểm ${type} của năm ${year}?`)) return;
        try {
            await axios.delete(`/api/uni/v1/score`, {
                params: {
                    universityId: id,
                    majorId: scoreDetails.majorId,
                    year,
                    type
                }
            });

            toast.success("Xoá điểm thành công");

            // Cập nhật lại dữ liệu
            const res = await axios.get(`/api/uni/v1/${id}`);
            const updatedMajors = res.data.data.universityMajors || [];
            setMajorList(updatedMajors);

            const updatedMajor = updatedMajors.find(m => m.majorId === scoreDetails.majorId);
            setScoreDetails(prev => ({
                ...prev,
                scoreOverview: updatedMajor ? updatedMajor.scoreOverview || [] : prev.scoreOverview
            }));
        } catch (err) {
            console.error(err);
            toast.error("Xoá điểm thất bại");
        }
    };

    if (loading) return <div className="loader-container"><div className="loader" /></div>;
    if (error) return <div className="error-message text-center mt-4">{error}</div>;

    return (
        <div className="university-detail bg-light min-vh-100 p-4">
            <ToastContainer position="top-right" autoClose={5000} />
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Quay lại</button>

            {/* University Info */}
            <div className="card detail-card mb-5 shadow-sm">
                <img src={university.thumbnail || '/default-university.jpg'} alt={university.universityName} className="card-img-top detail-img" />
                <div className="card-body">
                    <h2 className="detail-title">
                        {university.universityName} <span className="text-muted">({university.code})</span>
                        {university.verified && (
                            <i className="fas fa-check-circle text-success ms-2" title="Đã xác thực"></i>
                        )}
                    </h2>
                    <p className="detail-info"><i className="fas fa-map-marker-alt me-2" />{university.address}</p>
                    {university.main && <p className="detail-info"><i className="fas fa-star me-2" />{university.main}</p>}
                    {isStaff && (
                        university.verified ? (
                            <button
                                className="btn btn-outline-danger btn-sm mt-2"
                                onClick={async () => {
                                    try {
                                        await axios.put(`/api/uni/v1/un-verify/${university.universityId}`);
                                        toast.success("Đã bỏ xác thực");
                                        const res = await axios.get(`/api/uni/v1/${id}`);
                                        setUniversity(res.data.data);
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Lỗi khi bỏ xác thực");
                                    }
                                }}
                            >
                                ❌ Bỏ xác thực
                            </button>
                        ) : (
                            <button
                                className="btn btn-outline-success btn-sm mt-2"
                                onClick={async () => {
                                    try {
                                        await axios.put(`/api/uni/v1/verify/${university.universityId}`);
                                        toast.success("Đã xác thực trường");
                                        const res = await axios.get(`/api/uni/v1/${id}`);
                                        setUniversity(res.data.data);
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Lỗi khi xác thực");
                                    }
                                }}
                            >
                                ✅ Xác thực trường
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Majors List */}
            <div className="majors-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">📚 Danh sách ngành học</h3>
                    <button className="btn btn-success" onClick={openAddModal}>Thêm ngành</button>
                </div>
                <table className="table table-hover">
                    <thead><tr><th>STT</th><th>Ngành</th><th>Mã Ngành</th><th>Tổ hợp</th><th>Điểm chuẩn</th><th>HĐ</th></tr></thead>
                    <tbody>
                        {majorList.map((m, idx) => (
                            <tr key={m.majorId}>
                                <td>{idx + 1}</td>
                                <td>{m.majorName}</td>
                                <td>{m.majorCode}</td>
                                <td>{m.combo.map(c => c.codeCombination).join(', ')}</td>
                                <td><button className="btn btn-link p-0" onClick={() => openScoreModal(m)}>Xem chi tiết</button></td>
                                <td><button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(m)}>Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Major Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={closeAddModal}>
                    <div className="modal-content p-4 bg-white rounded shadow-lg" onClick={e => e.stopPropagation()}>
                        <h5 className="text-center mb-3">📘 Thêm Ngành Học</h5>
                        <div className="form-group mb-3">
                            <label>Nhập mã ngành</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formAdd.majorCode}
                                onChange={e => setFormAdd(prev => ({ ...prev, majorCode: e.target.value }))}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Chọn ngành</label>
                            <Select options={majorsOptions} value={formAdd.selectedMajor} onChange={opt => setFormAdd(prev => ({ ...prev, selectedMajor: opt }))} placeholder="-- chọn ngành --" isClearable />
                        </div>
                        <div className="form-group mb-3">
                            <label>Chọn tổ hợp môn</label>
                            <Select options={combosOptions} value={formAdd.selectedCombos} onChange={opts => setFormAdd(prev => ({ ...prev, selectedCombos: opts || [] }))} isMulti placeholder="-- chọn tổ hợp --" />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-secondary" onClick={closeAddModal}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleAddMajorSubmit} disabled={adding}>{adding ? 'Đang lưu...' : 'Lưu'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Major Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content p-4 bg-white rounded shadow-lg" onClick={e => e.stopPropagation()}>
                        <h5 className="text-center mb-3">Chỉnh sửa Ngành: {formEdit.name}</h5>
                        <div className="form-group mb-3">
                            <label>Mã ngành</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formEdit.majorCode}
                                onChange={e => setFormEdit(prev => ({
                                    ...prev,
                                    majorCode: e.target.value
                                }))}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Chọn tổ hợp môn</label>
                            <Select options={combosOptions} value={formEdit.selectedCombos} onChange={opts => setFormEdit(prev => ({ ...prev, selectedCombos: opts || [] }))} isMulti placeholder="-- chọn tổ hợp --" />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-secondary" onClick={closeEditModal}>Hủy</button>
                            <button className="btn btn-primary" onClick={handleEditMajorSubmit} disabled={updating}>{updating ? 'Đang cập nhật...' : 'Cập nhật'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Score Detail Modal */}
            {showScoreModal && (
                <div className="modal-overlay" onClick={() => setShowScoreModal(false)}>
                    <div className="modal-content p-4 bg-white rounded shadow-lg" style={{ maxWidth: '800px', width: '90%' }} onClick={e => e.stopPropagation()}>

                        <h5 className="text-center mb-3">Điểm chuẩn: {scoreDetails.majorName}</h5>
                        {/* Add Score Form */}
                        <div className="border rounded p-3 mb-4">
                            <h6>Thêm điểm mới</h6>
                            <div className="d-flex gap-2 align-items-end">
                                <div className="form-group col-4">
                                    <label>Loại</label>
                                    <Select options={scoreTypeOptions} value={newScore.type} onChange={opt => setNewScore(prev => ({ ...prev, type: opt }))} placeholder="chọn loại" isDisabled={isEditingScore} />
                                </div>
                                <div className="form-group col-2">
                                    <label>Năm</label>
                                    <DatePicker
                                        selected={newScore.year ? new Date(newScore.year, 0) : null}
                                        onChange={(date) =>
                                            setNewScore(prev => ({
                                                ...prev,
                                                year: date.getFullYear().toString()
                                            }))
                                        }
                                        showYearPicker
                                        dateFormat="yyyy"
                                        placeholderText="chọn năm"
                                        className="form-control"
                                        maxDate={new Date(currentYear, 11)}
                                        disabled={isEditingScore}
                                    />
                                </div>
                                <div className="form-group col-2">
                                    <label>Điểm</label>
                                    <input type="number" className="form-control" value={newScore.score} onChange={e => setNewScore(prev => ({ ...prev, score: e.target.value }))} step="0.1" />
                                </div>
                                <button
                                    className="btn btn-success"
                                    onClick={handleAddScore}
                                    disabled={addingScore}
                                >
                                    {addingScore ? 'Đang thêm...' : 'Thêm'}
                                </button>
                            </div>
                        </div>
                        {/* Existing Scores */}
                        {scoreDetails.scoreOverview.map(({ year, scoreDetails }) => (
                            <div key={year} className="mb-4">
                                <h6 className="fw-bold">Năm {year}</h6>
                                <table className="table table-bordered table-sm mb-3">
                                    <thead className="table-light">
                                        <tr><th>Loại</th><th>Điểm</th><th>Hành động</th></tr>
                                    </thead>
                                    <tbody>
                                        {scoreDetails.map(({ type, score }, i) => (
                                            <tr key={i}>
                                                <td>{type}</td>
                                                <td>{score}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => {
                                                            setNewScore({
                                                                year: year.toString(),
                                                                type: scoreTypeOptions.find(opt => opt.value === type),
                                                                score: score.toString()
                                                            });
                                                            setIsEditingScore(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger me-2"
                                                        onClick={() => handleDeleteScore(year, type)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                        <div className="text-end"><button className="btn btn-secondary" onClick={() => {
                            setShowScoreModal(false);
                            setIsEditingScore(false);
                            setNewScore({ year: '', type: null, score: '' });
                        }}>Đóng</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUniversityDetail;