import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ManageSchedule = () => {
    const [loadingIndexes, setLoadingIndexes] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showMainSchedule, setShowMainSchedule] = useState(true);
    const [showNewExamForm, setShowNewExamForm] = useState(false);
    const [newExamSchedule, setNewExamSchedule] = useState({
        content: "",
        startDate: "",
        endDate: ""
    });
    const [examSchedules, setExamSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState({ startDate: "", endDate: "" });
    const [mainSchedules, setMainSchedules] = useState([]);
    const [selectedMainSchedule, setSelectedMainSchedule] = useState(null);
    const [editingMainSchedule, setEditingMainSchedule] = useState({ startDate: "", endDate: "" });

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await axios.get("/api/uni/schedule");
                const data = res.data.data || [];

                const main = data.filter(item => item.mainSchedule === true);
                const exam = data.filter(item => item.mainSchedule === false);

                setMainSchedules(main);
                setExamSchedules(exam);
            } catch (err) {
                toast.error("Không thể tải dữ liệu lịch");
                console.error(err);
            }
        };

        fetchSchedules();
    }, []);


    const formatDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleSaveSchedule = async (schedule, editing, isMain) => {
        const { content, scheduleId } = schedule;
        const { startDate, endDate } = editing;

        if (!content || !startDate) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            if (scheduleId) {
                // 🛠️ PUT UPDATE
                await axios.put(`/api/uni/schedule/${scheduleId}`, {
                    content: content, // không gửi content nếu là main
                    startDate,
                    endDate,
                    note: schedule.note || ""
                });
            } else {
                // 🆕 POST NEW
                await axios.post("/api/uni/schedule", {
                    content,
                    startDate,
                    endDate,
                    note: schedule.note || "",
                    mainSchedule: isMain
                });
            }

            toast.success("Lưu lịch thành công!");

            // Refetch
            const res = await axios.get("/api/uni/schedule");
            const data = res.data.data || [];
            setMainSchedules(data.filter(i => i.mainSchedule));
            setExamSchedules(data.filter(i => !i.mainSchedule));

            if (isMain) {
                setSelectedMainSchedule(null);
            } else {
                setSelectedSchedule(null);
                setShowNewExamForm(false);
            }
        } catch (err) {
            toast.error("Lỗi khi lưu lịch");
            console.error(err);
        }
    };


    return (
        <div className="container mt-4">
            <ToastContainer />
            <h2 className="text-center mb-4">🗓️ Trang Admin - Tạo lịch</h2>

            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <button
                            className="list-group-item list-group-item-secondary fw-bold"
                            onClick={() => setShowMainSchedule(prev => !prev)}
                        >
                            {showMainSchedule ? "▾" : "▸"} Đếm ngược
                        </button>
                        {mainSchedules.map((item, index) => (
                            <button
                                key={index}
                                className={`list-group-item list-group-item-action ${selectedMainSchedule?.content === item.content ? "active" : ""}`}
                                onClick={() => {
                                    if (selectedMainSchedule?.content === item.content) {
                                        setSelectedMainSchedule(null);
                                    } else {
                                        setSelectedMainSchedule(item);
                                        setEditingMainSchedule({
                                            startDate: item.startDate?.slice(0, 16) || "",
                                            endDate: item.endDate?.slice(0, 16) || ""
                                        });
                                    }
                                }}
                            >
                                {item.content}
                            </button>
                        ))}
                        <button
                            className="list-group-item list-group-item-secondary fw-bold"
                            onClick={() => setShowNewExamForm(prev => !prev)}
                        >
                            {showNewExamForm ? "▾" : "▸"} Thời gian thi THPT
                        </button>

                        {showNewExamForm && (
                            <>
                                {examSchedules.map((s, i) => (
                                    <button
                                        key={i}
                                        className={`list-group-item list-group-item-action ${selectedSchedule?.content === s.content ? "active" : ""}`}
                                        onClick={() => {
                                            if (selectedSchedule?.content === s.content) {
                                                // Click lại chính nó → đóng form
                                                setSelectedSchedule(null);
                                            } else {
                                                setSelectedSchedule(s);
                                                setEditingSchedule({
                                                    startDate: s.startDate?.slice(0, 16) || "",
                                                    endDate: s.endDate?.slice(0, 16) || ""
                                                });
                                            }
                                        }}
                                    >
                                        {s.content}
                                    </button>
                                ))}

                                <button
                                    className="list-group-item list-group-item-action text-success"
                                    onClick={() => {
                                        setSelectedSchedule({
                                            content: "",
                                            startDate: "",
                                            endDate: "",
                                            note: "",
                                            mainSchedule: false
                                        });
                                        setEditingSchedule({ startDate: "", endDate: "" });
                                        setShowNewExamForm(true);
                                    }}
                                >
                                    ➕ Tạo mới lịch
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="col-md-9">
                    {showMainSchedule && selectedMainSchedule && (
                        <div className="card shadow-sm p-3">
                            <h5>{selectedMainSchedule.content}</h5>

                            <p className="fw-bold mb-3">
                                <strong>Ngày có sẵn:</strong>{" "}
                                <span className="text-primary">
                                    {formatDate(selectedMainSchedule.startDate)} - {formatDate(selectedMainSchedule.endDate)}
                                </span>
                            </p>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={editingMainSchedule.startDate}
                                        onChange={(e) =>
                                            setEditingMainSchedule(prev => ({ ...prev, startDate: e.target.value }))
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={editingMainSchedule.endDate}
                                        min={editingMainSchedule.startDate}
                                        onChange={(e) =>
                                            setEditingMainSchedule(prev => ({ ...prev, endDate: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>

                            <button
                                className="btn btn-success"
                                onClick={() => handleSaveSchedule(selectedMainSchedule, editingMainSchedule, true)}
                            >
                                Lưu
                            </button>
                        </div>
                    )}
                    {selectedSchedule && (
                        <div className="card shadow-sm p-3 mt-3">
                            <h5>{selectedSchedule.content || "Tạo mới lịch – Thời gian thi THPT"}</h5>

                            <div className="mb-3">
                                <label className="form-label">Tên lịch</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedSchedule.content}
                                    onChange={(e) => {
                                        if (!selectedSchedule.mainSchedule) {
                                            setSelectedSchedule(prev => ({ ...prev, content: e.target.value }));
                                        }
                                    }}
                                    disabled={selectedSchedule.mainSchedule}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ghi chú</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedSchedule.note || ""}
                                    onChange={(e) =>
                                        setSelectedSchedule(prev => ({ ...prev, note: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={editingSchedule.startDate}
                                        onChange={(e) =>
                                            setEditingSchedule(prev => ({ ...prev, startDate: e.target.value }))
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control form-control-sm"
                                        value={editingSchedule.endDate}
                                        min={editingSchedule.startDate}
                                        onChange={(e) =>
                                            setEditingSchedule(prev => ({ ...prev, endDate: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleSaveSchedule(selectedSchedule, editingSchedule, false)}
                                >
                                    Lưu
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSelectedSchedule(null);
                                        setShowNewExamForm(false);
                                    }}
                                >
                                    Huỷ
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>

    );
};

export default ManageSchedule;
