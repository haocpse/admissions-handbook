import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddScorePopUp.css";

const AddScorePopUp = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    maTruong: "",
    tenNganh: "",
    maNganh: "",
    diemChuan: "",
    toHop: "",
  });

  const [universities, setUniversities] = useState([]);
  const [majors, setMajors] = useState([]);
  const [combinations, setCombinations] = useState([]);

  // Gọi API khi popup mở
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniRes = await axios.get("/api/uni/v1");
        const majorRes = await axios.get("/api/majors");
        const combRes = await axios.get("/api/tohop");

        setUniversities(uniRes.data.data || []);
        setMajors(majorRes.data.data || []);
        setCombinations(combRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu chọn:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { maTruong, tenNganh, maNganh, diemChuan, toHop } = formData;
    if (!maTruong || !tenNganh || !maNganh || !diemChuan || !toHop) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>➕ Thêm Điểm Chuẩn</h3>
        <form className="popup-form" onSubmit={handleSubmit}>
          <label>Mã trường:</label>
          <select name="maTruong" value={formData.maTruong} onChange={handleChange}>
            <option value="">-- Chọn mã trường --</option>
            {universities.map((uni) => (
              <option key={uni.universityId} value={uni.code}>
                {uni.code} - {uni.universityName}
              </option>
            ))}
          </select>

          <label>Tên ngành:</label>
          <select name="tenNganh" value={formData.tenNganh} onChange={handleChange}>
            <option value="">-- Chọn tên ngành --</option>
            {majors.map((m) => (
              <option key={m.majorId} value={m.majorName}>
                {m.majorName}
              </option>
            ))}
          </select>

          <label>Mã ngành:</label>
          <select name="maNganh" value={formData.maNganh} onChange={handleChange}>
            <option value="">-- Chọn mã ngành --</option>
            {majors.map((m) => (
              <option key={m.majorId} value={m.majorCode}>
                {m.majorCode}
              </option>
            ))}
          </select>

          <label>Điểm chuẩn:</label>
          <input
            type="number"
            step="0.01"
            name="diemChuan"
            placeholder="Nhập điểm chuẩn"
            value={formData.diemChuan}
            onChange={handleChange}
          />

          <label>Tổ hợp:</label>
          <select name="toHop" value={formData.toHop} onChange={handleChange}>
            <option value="">-- Chọn tổ hợp --</option>
            {combinations.map((comb, idx) => (
              <option key={idx} value={comb}>
                {comb}
              </option>
            ))}
          </select>

          <div className="popup-buttons">
            <button type="submit" className="btn btn-primary">Lưu</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScorePopUp;
