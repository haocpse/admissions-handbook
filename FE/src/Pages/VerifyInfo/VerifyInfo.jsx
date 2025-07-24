import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VerifyInfo.css";

const TYPE_LABELS = {
  university: "Trường đại học",
  major: "Ngành học",
  subjectGroup: "Tổ hợp môn",
  examSchedule: "Lịch thi",
  news: "Tin tức",
  qa: "Hỏi đáp",
};

const VerifyInfo = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [note, setNote] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const res = await axios.get("/api/pending-verification-items");
        setPendingItems(res.data);
      } catch (error) {
        console.error("Failed to fetch pending items:", error);
      }
    };
    fetchPendingItems();
  }, []);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setNote("");
    setStatusMessage("");
  };

  const handleVerification = async (status) => {
    if (!selectedItem) return;
    try {
      await axios.post("/api/verify-item", {
        itemId: selectedItem.id,
        status,
        note,
      });

      setStatusMessage(`Đã ${status === "approved" ? "duyệt" : "từ chối"} thành công.`);
      setPendingItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
    } catch (error) {
      console.error("Verification failed:", error);
      setStatusMessage("Lỗi xác minh. Vui lòng thử lại.");
    }
  };

  return (
    <div className="verify-wrapper">
      <h2 className="page-title">Xác minh thông tin mới / cập nhật</h2>
      <div className="verify-panel">
        <div className="verify-sidebar">
          <h3>Mục cần xác minh</h3>
          <ul className="user-list">
            {pendingItems.length === 0 && <p>Không có mục nào chờ xác minh</p>}
            {pendingItems.map((item) => (
              <li
                key={item.id}
                className={selectedItem?.id === item.id ? "active" : ""}
                onClick={() => handleSelectItem(item)}
              >
                <strong>{TYPE_LABELS[item.type] || "Khác"}:</strong> {item.title}
                <br />
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="verify-details">
          {selectedItem ? (
            <div className="details-card">
              <h3>Thông tin chi tiết</h3>
              <div className="info-row"><strong>Loại:</strong> {TYPE_LABELS[selectedItem.type]}</div>
              <div className="info-row"><strong>Tiêu đề:</strong> {selectedItem.title}</div>
              <div className="info-row"><strong>Mô tả:</strong> {selectedItem.description}</div>

              <div className="info-json">
                <pre>{JSON.stringify(selectedItem.data, null, 2)}</pre>
              </div>

              <textarea
                placeholder="Ghi chú (nếu có)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="btn-group">
                <button className="btn-approve" onClick={() => handleVerification("approved")}>
                  Duyệt
                </button>
                <button className="btn-reject" onClick={() => handleVerification("rejected")}>
                  Từ chối
                </button>
              </div>

              {statusMessage && <p className="status-msg">{statusMessage}</p>}
            </div>
          ) : (
            <div className="empty-card">
              <p>Chọn một mục để xem chi tiết và xác minh.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyInfo;