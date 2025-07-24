import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageScore.css";
import { toast, ToastContainer } from "react-toastify";
import AddScorePopUp from "./AddScorePopUp";
import UpdateScorePopUp from "./UpdateScorePopUp";

const ManageScore = () => {
  const [scores, setScores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [scoreToEdit, setScoreToEdit] = useState(null);
  const itemsPerPage = 6;

  const fetchScores = async () => {
    try {
      const response = await axios.get("/api/scores");
      setScores(response.data || []);
      toast.success("Tải danh sách điểm thành công");
    } catch (err) {
      toast.error("Tải dữ liệu điểm thất bại");
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleAddScore = async (formData) => {
    try {
      await axios.post("/api/scores", formData);
      toast.success("Thêm điểm thành công");
      setShowAddModal(false);
      fetchScores();
    } catch (err) {
      toast.error("Lỗi khi thêm điểm");
    }
  };

  const handleUpdateScore = async (formData) => {
    try {
      await axios.put(`/api/scores/${formData.id}`, formData);
      toast.success("Cập nhật điểm thành công");
      setShowUpdateModal(false);
      fetchScores();
    } catch (err) {
      toast.error("Lỗi khi cập nhật điểm");
    }
  };

  const handleEditClick = (score) => {
    setScoreToEdit(score);
    setShowUpdateModal(true);
  };

  const filteredScores = scores.filter(
    (score) =>
      score.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      score.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredScores.length / itemsPerPage);
  const currentItems = filteredScores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="manage-score bg-light min-vh-100 p-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="mb-4 text-center">📊 Quản lý Điểm</h1>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <input
          type="text"
          className="form-control mb-2"
          style={{ maxWidth: "300px" }}
          placeholder="🔍 Tìm kiếm theo điểm chuẩn..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="buttons mb-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Thêm điểm
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddScorePopUp
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddScore}
        />
      )}

      {showUpdateModal && scoreToEdit && (
        <UpdateScorePopUp
          score={scoreToEdit}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateScore}
        />
      )}

      <div className="row">
        {currentItems.map((score) => (
          <div className="col-md-6 col-lg-4 mb-4" key={score.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{score.studentName}</h5>
                <p className="card-text">📘 Môn: {score.subject}</p>
                <p className="card-text">📈 Điểm: {score.score}</p>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEditClick(score)}
                >
                  Sửa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &laquo;
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ManageScore;
