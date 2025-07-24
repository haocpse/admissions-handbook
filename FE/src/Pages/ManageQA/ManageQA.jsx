import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageQA.css";
import { toast, ToastContainer } from "react-toastify";
import { FaThumbtack, FaReply, FaTrash } from "react-icons/fa";

const ManageQA = () => {
  const [qaList, setQaList] = useState([]);
  const [editedAnswers, setEditedAnswers] = useState({}); // Lưu câu trả lời đang chỉnh sửa

  const fetchQA = async () => {
    try {
      const res = await axios.get("/api/qa");
      setQaList(res.data || []);
      toast.success("Tải danh sách hỏi đáp thành công");
    } catch (err) {
      toast.error("Tải dữ liệu hỏi đáp thất bại");
      console.error("Lỗi khi lấy dữ liệu Q&A:", err);
    }
  };

  useEffect(() => {
    fetchQA();
  }, []);

  const togglePin = async (id, currentPin) => {
    try {
      await axios.put(`/api/qa/${id}/pin`, { isPinned: !currentPin });
      setQaList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isPinned: !item.isPinned } : item
        )
      );
      toast.success("Cập nhật ghim thành công");
    } catch (err) {
      toast.error("Lỗi khi cập nhật ghim");
    }
  };

  const handleAnswerChange = (id, newAnswer) => {
    setEditedAnswers((prev) => ({ ...prev, [id]: newAnswer }));
  };

  const submitAnswer = async (id) => {
    const answer = editedAnswers[id];
    if (!answer || answer.trim() === "") {
      toast.warn("Vui lòng nhập câu trả lời trước khi gửi");
      return;
    }

    try {
      await axios.put(`/api/qa/${id}/answer`, { answer });
      setQaList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, answer } : item))
      );
      toast.success("Trả lời thành công");
      setEditedAnswers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      toast.error("Lỗi khi gửi câu trả lời");
    }
  };

  const removeQA = async (id) => {
    try {
      await axios.delete(`/api/qa/${id}`);
      setQaList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Xóa câu hỏi thành công");
    } catch (err) {
      toast.error("Lỗi khi xóa câu hỏi");
    }
  };

  return (
    <div className="manageqa-container bg-light p-4 min-vh-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center mb-4">❓ Quản lý Hỏi & Đáp</h2>

      {qaList.map((qa) => (
        <div key={qa.id} className={`qa-card shadow-sm p-3 mb-4 ${qa.isPinned ? "pinned border border-warning" : "bg-white"}`}>
          <div className="qa-header d-flex justify-content-between align-items-start mb-2">
            <p className="fw-bold">{qa.question}</p>
            <div className="qa-actions d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => togglePin(qa.id, qa.isPinned)} title="Ghim câu hỏi">
                <FaThumbtack />
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => removeQA(qa.id)} title="Xóa">
                <FaTrash />
              </button>
            </div>
          </div>

          {qa.feedback && (
            <div className="alert alert-info py-2 px-3">
              <strong>Phản hồi:</strong> {qa.feedback}
            </div>
          )}

          <div className="answer-section">
            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Nhập câu trả lời..."
              value={editedAnswers[qa.id] ?? qa.answer ?? ""}
              onChange={(e) => handleAnswerChange(qa.id, e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => submitAnswer(qa.id)}>
              <FaReply className="me-2" />
              Trả lời
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageQA;
