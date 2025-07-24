import React, { useEffect, useState } from "react";
import "./AddUniversityPopUp.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AddUniversityPopUp = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState({
        tenTruong: "",
        maTruong: "",
        diaChi: "",
        theManh: "",
        thumbnail: null,
    });


    const theManh = [
        { value: "Education", label: "Giáo dục" },
        { value: "STEM", label: "STEM" },
        { value: "Health_Medicine", label: "Y tế_Y học" },
        { value: "Language_Social_Sciences", label: "Ngôn ngữ_Khoa học xã hội" },
        { value: "Economics_Law_Management", label: "Kinh tế_Luật_Quản lý" },
        { value: "Multidisciplinary", label: "Đa ngành" },
        { value: "Arts_Design", label: "Nghệ thuật_Thiết kế" }
    ];
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);

    // useEffect(() => {
    //     const fetchTheManhOptions = async () => {
    //         try {
    //             setIsLoadingOptions(true);
    //             const response = await axios.get('/api/the-manh');
    //             toast.success("Tải danh sách thế mạnh thành công")
    //             setTheManh(response.data.data || []);
    //         } catch (error) {
    //             console.error("Lỗi khi tải danh sách thế mạnh:", error);
    //         } finally {
    //             setIsLoadingOptions(false);
    //         }
    //     };
    //     fetchTheManhOptions();
    // }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({ ...prev, thumbnail: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="modal-overlay">
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="modal-content p-4 bg-white rounded shadow">
                <h5 className="mb-3 text-center">🎓 Thêm Trường Đại Học</h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label><i className="fas fa-university me-2"></i>Tên trường</label>
                        <input
                            type="text"
                            className="form-control"
                            name="tenTruong"
                            value={form.tenTruong}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label><i className="fas fa-code me-2"></i>Mã trường</label>
                        <input
                            type="text"
                            className="form-control"
                            name="maTruong"
                            value={form.maTruong}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label><i className="fas fa-map-marker-alt me-2"></i>Địa chỉ</label>
                        <input
                            type="text"
                            className="form-control"
                            name="diaChi"
                            value={form.diaChi}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label><i className="fas fa-star me-2"></i>Thế mạnh</label>
                        <select
                            className="form-control"
                            name="theManh"
                            value={form.theManh}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn thế mạnh --</option>
                            {theManh.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label><i className="fas fa-image me-2"></i>Hình ảnh (tùy chọn)</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {/* Hiển thị preview nếu có ảnh */}
                        {form.thumbnail && (
                            <div className="mt-2 text-center">
                                <img
                                    src={URL.createObjectURL(form.thumbnail)}
                                    alt="preview"
                                    className="img-thumbnail"
                                    style={{ maxHeight: "200px", borderRadius: "8px" }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Tạo mới
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUniversityPopUp;

