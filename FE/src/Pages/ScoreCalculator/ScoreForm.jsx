import { useState } from "react";
import "./ScoreForm.css";

const SUBJECTS = [
  "Toán", "Văn", "Anh", "Lý", "Hóa", "Sinh", "Sử", "Địa", "GDCD", "Tin", "Công nghệ"
];

export default function ScoreForm({ type, selectedSubjects, setSelectedSubjects }) {
  const [scores, setScores] = useState({});
  const [hocba, setHocba] = useState({ "10": {}, "11": {}, "12": {} });
  const [khuyenKhich, setKhuyenKhich] = useState("");
  const [uuTien, setUuTien] = useState("");
  const [mienNgoaiNgu, setMienNgoaiNgu] = useState(false);
  const [result, setResult] = useState(null);

  // Đổi môn xét tuyển, không cho chọn trùng
  const handleSubjectChange = (idx, value) => {
    if (selectedSubjects.includes(value)) return;
    const newSubjects = [...selectedSubjects];
    newSubjects[idx] = value;
    setSelectedSubjects(newSubjects);
  };

  // Validate điểm: chỉ cho phép 0-10, không cho <0, >10, =0 thì hợp lệ
  const validateScore = (value) => {
    if (value === "" || value === null) return true;
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 10) {
      alert("Chỉ được nhập số từ 0 đến 10");
      return false;
    }
    return true;
  };

  // Nhập điểm xét tuyển
  const handleScoreChange = (subject, value) => {
    if (!validateScore(value)) return;
    setScores({ ...scores, [subject]: value });
  };

  // Nhập điểm học bạ
  const handleHocbaChange = (grade, hk, value) => {
    if (!validateScore(value)) return;
    setHocba({
      ...hocba,
      [grade]: {
        ...hocba[grade],
        [hk]: value
      }
    });
  };

  // Validate điểm khuyến khích, ưu tiên
  const handleKhuyenKhichChange = (value) => {
    if (!validateScore(value)) return;
    setKhuyenKhich(value);
  };
  const handleUuTienChange = (value) => {
    if (!validateScore(value)) return;
    setUuTien(value);
  };

  // Tính điểm xét tuyển (ví dụ đơn giản)
  const calcXetTuyen = () => {
    let sum = 0, count = 0;
    for (let subj of selectedSubjects) {
      let v;
      if (mienNgoaiNgu && subj === "Anh") v = 10;
      else v = parseFloat(scores[subj]);
      if (v === 0 || (v && v > 0 && v <= 10)) {
        sum += v;
        count++;
      } else if (v !== undefined && v !== null && v !== "") {
        alert("Chỉ được nhập số từ 0 đến 10");
        return;
      }
    }
    let total = count > 0 ? (sum / count) : 0;
    let kk = parseFloat(khuyenKhich);
    let ut = parseFloat(uuTien);
    if ((khuyenKhich !== "" && (isNaN(kk) || kk < 0 || kk > 10)) ||
      (uuTien !== "" && (isNaN(ut) || ut < 0 || ut > 10))) {
      alert("Chỉ được nhập số từ 0 đến 10");
      return;
    }
    if (khuyenKhich) total += kk || 0;
    if (uuTien) total += ut || 0;
    setResult(count > 0 ? total.toFixed(2) : "Chưa đủ dữ liệu");
  };

  // Tính điểm TB học bạ (ví dụ đơn giản)
  const calcHocBa = () => {
    let sum = 0, count = 0;
    for (let grade of ["10", "11", "12"]) {
      for (let hk of ["hk1", "hk2"]) {
        const v = parseFloat(hocba[grade]?.[hk] || "");
        if (v === 0 || (v && v > 0 && v <= 10)) {
          sum += v;
          count++;
        } else if (hocba[grade]?.[hk] !== undefined && hocba[grade]?.[hk] !== "") {
          alert("Chỉ được nhập số từ 0 đến 10");
          return;
        }
      }
    }
    setResult(count > 0 ? (sum / count).toFixed(2) : "Chưa đủ dữ liệu");
  };

  // --- FORM XÉT TUYỂN ---
  if (type === "xettuyen") {
    return (
      <div className="scoreform-wrapper">
        <h2>Chọn tối đa 5 môn xét tuyển và nhập điểm</h2>
        <div className="scoreform-xettuyen-list">
          {[0, 1, 2, 3, 4].map(idx => (
            <div className="scoreform-group" key={idx}>
              <label>Môn {idx + 1}:</label>
              <select
                value={selectedSubjects[idx] || ""}
                onChange={e => handleSubjectChange(idx, e.target.value)}
              >
                <option value="">--Chọn môn--</option>
                {SUBJECTS.map(subj => {
                  // Ẩn các môn đã chọn ở dropdown khác
                  const isSelectedElsewhere =
                    selectedSubjects.includes(subj) && selectedSubjects[idx] !== subj;
                  return (
                    <option key={subj} value={subj} disabled={isSelectedElsewhere}>
                      {subj}
                    </option>
                  );
                })}
              </select>
              {/* Nếu là Anh và tick miễn thì disable, value=10 */}
              {selectedSubjects[idx] === "Anh" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="Điểm"
                    value={mienNgoaiNgu ? 10 : (scores["Anh"] || "")}
                    onChange={e => handleScoreChange("Anh", e.target.value)}
                    disabled={mienNgoaiNgu}
                  />
                  <label style={{ fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={mienNgoaiNgu}
                      onChange={e => setMienNgoaiNgu(e.target.checked)}
                      style={{ marginRight: 4 }}
                    />
                    Miễn ngoại ngữ
                  </label>
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="Điểm"
                  value={scores[selectedSubjects[idx]] || ""}
                  onChange={e => handleScoreChange(selectedSubjects[idx], e.target.value)}
                  disabled={!selectedSubjects[idx]}
                />
              )}
            </div>
          ))}
        </div>
        <div className="scoreform-group">
          <label>Điểm khuyến khích (nếu có):</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={khuyenKhich}
            onChange={e => handleKhuyenKhichChange(e.target.value)}
          />
        </div>
        <div className="scoreform-group">
          <label>Điểm ưu tiên:</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={uuTien}
            onChange={e => handleUuTienChange(e.target.value)}
          />
        </div>
        <button className="scoreform-btn" type="button" onClick={calcXetTuyen}>
          Tính điểm xét tuyển
        </button>
        {result && (
          <p className="scoreform-result">
            ✅ Tổng điểm xét tuyển: <strong>{result}</strong>
          </p>
        )}
      </div>
    );
  }

  // --- FORM HỌC BẠ TỪNG KỲ ---
  return (
    <div className="scoreform-wrapper">
      <h2>Nhập điểm học kỳ 1, 2 cho từng lớp</h2>
      <div className="scoreform-hocba-table">
        <table>
          <thead>
            <tr>
              <th>Lớp</th>
              <th>HK1</th>
              <th>HK2</th>
            </tr>
          </thead>
          <tbody>
            {["10", "11", "12"].map(grade => (
              <tr key={grade}>
                <td>{grade}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={hocba[grade]?.hk1 || ""}
                    onChange={e =>
                      handleHocbaChange(grade, "hk1", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={hocba[grade]?.hk2 || ""}
                    onChange={e =>
                      handleHocbaChange(grade, "hk2", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="scoreform-btn" type="button" onClick={calcHocBa}>
        Tính điểm TB học bạ 6 kỳ
      </button>
      {result && (
        <p className="scoreform-result">
          ✅ Điểm TB học bạ 6 kỳ: <strong>{result}</strong>
        </p>
      )}
    </div>
  );
}
