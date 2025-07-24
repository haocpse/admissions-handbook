import React, { useState } from "react";
import "./ScoreCalculator.css";
import scoreEnglish from "../../assets/Scores/score-with-english.png";
import scoreCalculator from "../../assets/Scores/score-calculator.png";
import scoreAverage from "../../assets/Scores/average score.png";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import ScoreForm from "./ScoreForm";
import { useNavigate } from "react-router-dom";

const SUBJECTS = [
  "Toán",
  "Văn",
  "Anh",
  "Lý",
  "Hóa",
  "Sinh",
  "Sử",
  "Địa",
  "GDCD",
  "Tin",
  "Công nghệ",
];

const ScoreCalculator = () => {
  const [tab, setTab] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([
    "Toán",
    "Văn",
    "Anh",
  ]);
  const navigate = useNavigate(); // Thêm dòng này

  return (
    <>
      <Navbar />
      <div className="scorecalc-container">
        <section className="scorecalc-section card-shadow white-bg border-light">
          <h1 className="section-title-center">
            Cách tính điểm xét tốt nghiệp THPT năm 2025
          </h1>

          <article className="scorecalc-subsection">
            <p>
              Ngày <strong>24/12/2024</strong>, Bộ Giáo dục và Đào tạo đã ban
              hành Thông tư 24/2024/TT-BGDĐT về Quy chế thi tốt nghiệp THPT bắt
              đầu từ năm 2025.
            </p>
            <p>
              Một điểm mới quan trọng trong Quy chế này là phương thức tính điểm
              xét tốt nghiệp THPT, với trọng số:
            </p>
            <ul>
              <li>
                <strong>50%</strong> dựa trên kết quả học tập lớp 10, 11, 12
                (điểm trung bình từng năm học)
              </li>
              <li>
                <strong>50%</strong> từ điểm bài thi tốt nghiệp
              </li>
            </ul>
          </article>

          <article className="scorecalc-subsection">
            <h2>1. Công thức tính điểm xét tốt nghiệp </h2>
            <div className="formula-box">
              <img
                src={scoreCalculator}
                alt="Công thức tính điểm không miễn ngoại ngữ"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </article>

          <article className="scorecalc-subsection">
            <h2>
              2. Công thức tính điểm nếu sử dụng chứng chỉ ngoại ngữ để miễn thi
              môn ngoại ngữ
            </h2>
            <div className="formula-box">
              <img
                src={scoreEnglish}
                alt="Công thức tính điểm miễn thi ngoại ngữ"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </article>
          <article className="scorecalc-subsection">
            <h2>
              3. Công thức tính điểm trung bình cả năm tất cả các môn lớp 10,
              lớp 11, lớp 12
            </h2>
            <div className="formula-box">
              <img
                src={scoreAverage}
                alt="Công thức tính điểm trung bình các năm"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </article>
          <article className="scorecalc-subsection">
            <h2>4. Giải thích các thành phần</h2>
            <ul>
              <li>
                <strong>Điểm các năm học:</strong> Trung bình cộng của điểm
                trung bình lớp 10, lớp 11 và lớp 12.
              </li>
              <li>
                <strong>Điểm KK (nếu có):</strong> Là điểm khuyến khích từ các
                chứng chỉ nghề, thành tích học sinh giỏi, v.v.
              </li>
              <li>
                <strong>Điểm UT (nếu có):</strong> Là điểm ưu tiên theo khu vực,
                đối tượng chính sách.
              </li>
            </ul>
          </article>

          {/* Tab paging */}
          <div className="scorecalc-tab-bar">
            <button
              className={
                tab === 0
                  ? "scorecalc-tab-btn active"
                  : "scorecalc-tab-btn"
              }
              onClick={() => setTab(0)}
            >
              Nhập điểm học bạ (10, 11, 12)
            </button>
            <button
              className={
                tab === 1
                  ? "scorecalc-tab-btn active"
                  : "scorecalc-tab-btn"
              }
              onClick={() => setTab(1)}
            >
              Nhập điểm xét tuyển (5 môn + ưu tiên)
            </button>
            <button
              className="scorecalc-tab-btn"
              onClick={() => navigate("/goi-y-dai-hoc")}
              style={{ marginLeft: 8 }}
            >
              Gợi ý trường đại học
            </button>
          </div>
          <div className="scorecalc-tab-content">
            {tab === 0 ? (
              <div>
                <h3 className="scorecalc-tab-title">Nhập điểm học bạ từng kỳ</h3>
                <ScoreForm
                  type="hocba"
                  selectedSubjects={selectedSubjects}
                  setSelectedSubjects={setSelectedSubjects}
                />
              </div>
            ) : (
              <div>
                <h3 className="scorecalc-tab-title">
                  Nhập điểm xét tuyển
                </h3>
                <ScoreForm
                  type="xettuyen"
                  selectedSubjects={selectedSubjects}
                  setSelectedSubjects={setSelectedSubjects}
                />
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ScoreCalculator;
