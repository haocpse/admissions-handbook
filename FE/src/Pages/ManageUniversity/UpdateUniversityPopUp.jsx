import React, { useState, useEffect } from "react";

const theManhOptions = [
  { value: "Education", label: "Giáo dục" },
  { value: "STEM", label: "STEM" },
  { value: "Health_Medicine", label: "Y tế_Y học" },
  { value: "Language_Social_Sciences", label: "Ngôn ngữ_Khoa học xã hội" },
  { value: "Economics_Law_Management", label: "Kinh tế_Luật_Quản lý" },
  { value: "Multidisciplinary", label: "Đa ngành" },
  { value: "Arts_Design", label: "Nghệ thuật_Thiết kế" },
];

const UpdateUniversityPopUp = ({ university, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    id: null,
    tenTruong: "",
    maTruong: "",
    diaChi: "",
    theManh: "",
    thumbnail: null, // file mới (nếu có)
    existingThumbnail: "", // giữ link ảnh cũ
  });

  useEffect(() => {
    if (university) {
      setForm({
        id: university.universityId,
        tenTruong: university.universityName || "",
        maTruong: university.code || "",
        diaChi: university.address || "",
        theManh: university.main || "",
        thumbnail: null,
        existingThumbnail: university.thumbnail || "",
      });
    }
  }, [university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, thumbnail: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4 bg-white rounded shadow">
        <h5 className="mb-3 text-center">✏️ Cập nhật Trường Đại Học</h5>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Tên trường</label>
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
            <label>Mã trường</label>
            <input
              type="text"
              className="form-control"
              name="maTruong"
              value={form.maTruong}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <div className="form-group mb-3">
            <label>Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              name="diaChi"
              value={form.diaChi}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label>Thế mạnh</label>
            <select
              className="form-control"
              name="theManh"
              value={form.theManh}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn thế mạnh --</option>
              {theManhOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-4">
            <label>Hình ảnh (tùy chọn)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.existingThumbnail && !form.thumbnail && (
              <img
                src={form.existingThumbnail}
                alt="Thumbnail cũ"
                style={{ marginTop: 10, maxHeight: 100, borderRadius: 8 }}
              />
            )}
            {form.thumbnail && (
              <div className="mt-2 text-center">
                <img
                  src={URL.createObjectURL(form.thumbnail)}
                  alt="Ảnh mới"
                  style={{ maxHeight: 100, borderRadius: 8 }}
                />
                <p>{form.thumbnail.name}</p>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUniversityPopUp;
