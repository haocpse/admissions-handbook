import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

// Các lựa chọn scoreType
const SCORE_TYPE_OPTIONS = [
    { value: "TNTHPTQG", label: "THPT Quốc gia" },
    { value: "HOCBA", label: "Học bạ" },
    { value: "DGNLHN", label: "Đánh giá năng lực HN" },
    { value: "DGNLHCM", label: "Đánh giá năng lực HCM" },
];

export default function UniversitySuggest() {
    const [score, setScore] = useState("");
    const [scoreType, setScoreType] = useState("TNTHPTQG");
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSuggest = async () => {
        const s = parseFloat(score);
        if (isNaN(s)) {
            alert("Vui lòng nhập tổng điểm hợp lệ");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post("/api/uni/v1/by-score", {
                score: s,
                scoreType: scoreType
            });
            setResult(res.data.data?.detailResponseList || []);
        } catch (err) {
            alert("Không thể lấy dữ liệu trường đại học.");
            setResult([]);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <div className="suggest-container" style={{ maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #bcd2f7", padding: 32, flex: 1 }}>
                <h2 style={{ color: "#225BBF", textAlign: "center", marginBottom: 24 }}>Gợi ý trường đại học phù hợp</h2>

                <div style={{ display: "flex", gap: 16, marginBottom: 24, justifyContent: "center", flexWrap: "wrap" }}>
                    <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.01"
                        value={score}
                        onChange={e => setScore(e.target.value)}
                        placeholder="Nhập tổng điểm"
                        style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #bcd2f7", fontSize: "1.1rem", width: 180 }}
                    />
                    <select
                        value={scoreType}
                        onChange={e => setScoreType(e.target.value)}
                        style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #bcd2f7", fontSize: "1.1rem", width: 220 }}
                    >
                        {SCORE_TYPE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button
                        style={{
                            background: "linear-gradient(90deg, #225BBF 60%, #3a8dde 100%)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 28px",
                            fontWeight: 600,
                            fontSize: "1.1rem",
                            cursor: "pointer"
                        }}
                        onClick={handleSuggest}
                        disabled={loading}
                    >
                        {loading ? "Đang tìm..." : "Gợi ý trường"}
                    </button>
                </div>

                {result.length > 0 ? (
                    <div>
                        <h3 style={{ color: "#225BBF", marginBottom: 20 }}>Có {result.length} trường phù hợp:</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {result.map((item, idx) => {
                                const uni = item.university;
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            border: "1px solid #ddd",
                                            borderRadius: 10,
                                            padding: 16,
                                            boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ margin: 0 }}>{uni.universityName}</h5>
                                            <p style={{ margin: "4px 0", color: "#555" }}>{uni.address}</p>
                                            <p style={{ margin: "4px 0", color: "#888" }}>Lĩnh vực: {uni.main}</p>
                                            <p style={{ margin: "4px 0", color: "#888" }}>Số ngành phù hợp: {item.total}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/diem-chuan/${uni.universityId}`, {
                                                state: { universityId: uni.universityId },
                                            })}
                                            className="btn btn-outline-primary"
                                            style={{ whiteSpace: "nowrap" }}
                                        >
                                            Xem điểm chuẩn
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    !loading && <p style={{ color: "#888", textAlign: "center" }}>Chưa có kết quả phù hợp.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}