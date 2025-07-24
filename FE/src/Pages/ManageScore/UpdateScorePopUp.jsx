import React, { useState, useEffect } from "react";
import "./AddScorePopUp.css"; // Dùng lại chung CSS với AddScorePopUp

const UpdateScorePopUp = ({ score, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: "",
    maTruong: "",
    tenNganh: "",
    maNganh: "",
    diemChuan: "",
    toHop: "",
  });

  useEffect(() => {
    if (score) {
      setFormData({
        id: score.id,
        maTruong: score.maTruong || "",
        tenNganh: score.tenNganh || "",
        maNganh: score.maNganh || "",
        diemChuan: score.diemChuan || "",
        toHop: score.toHop || "",
      });
    }
  }, [score]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.maTruong ||
      !formData.tenNganh ||
      !formData.maNganh ||
      !formData.diemChuan ||
      !formData.toHop
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    onUpdate(formData); // gọi hàm cha cập nhật
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>✏️ Cập nhật điểm chuẩn</h3>
        <form onSubmit={handleSubmit} className="popup-form">
          <input
            type="text"
            name="maTruong"
            placeholder="🎓 Mã trường"
            value={formData.maTruong}
            onChange={handleChange}
          />
          <input
            type="text"
            name="tenNganh"
            placeholder="📚 Tên ngành"
            value={formData.tenNganh}
            onChange={handleChange}
          />
          <input
            type="text"
            name="maNganh"
            placeholder="🆔 Mã ngành"
            value={formData.maNganh}
            onChange={handleChange}
          />
          <input
            type="number"
            name="diemChuan"
            placeholder="📈 Điểm chuẩn"
            value={formData.diemChuan}
            onChange={handleChange}
            step="0.01"
          />
          <input
            type="text"
            name="toHop"
            placeholder="🧪 Tổ hợp (VD: A00, D01...)"
            value={formData.toHop}
            onChange={handleChange}
          />
          <div className="popup-buttons">
            <button type="submit" className="btn btn-primary">Cập nhật</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateScorePopUp;
