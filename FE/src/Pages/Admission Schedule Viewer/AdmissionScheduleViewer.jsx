// import React, { useState, useEffect } from "react";
// import "./AdmissionScheduleViewer.css";
// import Navbar from "../../Components/Navbar/Navbar";
// import Footer from "../../Components/Footer/Footer";
// import axios from 'axios';

// const scheduleTypes = [
//     { value: "national_exam", label: "National Graduation Exam" },
//     { value: "university", label: "Individual University Schedules" },
// ];

// export default function AdmissionScheduleViewer() {
//     const [selectedType, setSelectedType] = useState(scheduleTypes[0].value);
//     const [schedules, setSchedules] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchSchedules = async () => {
//             try {
//                 setLoading(true);
//                 // Replace with your actual API endpoint
//                 const response = await axios.get(`/api/schedules/${selectedType}`);
//                 setSchedules(response.data);
//                 setError(null);
//             } catch (err) {
//                 setError('Failed to fetch schedules');
//                 console.error('Error fetching schedules:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSchedules();
//     }, [selectedType]);

//     const handleTypeChange = (e) => {
//         setSelectedType(e.target.value);
//     };

//     const currentSchedule = schedules[selectedType];

//     return (
//         <>
//             <Navbar />
//             <div className="admission-schedule-viewer">
//                 <h2>Admission Schedule Viewer</h2>
//                 <div className="selector">
//                     <label htmlFor="scheduleType">Select Schedule Type:</label>
//                     <select
//                         id="scheduleType"
//                         value={selectedType}
//                         onChange={handleTypeChange}
//                     >
//                         {scheduleTypes.map((type) => (
//                             <option key={type.value} value={type.value}>
//                                 {type.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="schedule-display">
//                     {loading ? (
//                         <div>Loading...</div>
//                     ) : error ? (
//                         <div className="error">{error}</div>
//                     ) : currentSchedule ? (
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Date</th>
//                                     <th>Event</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {currentSchedule.map((item, idx) => (
//                                     <tr key={idx}>
//                                         <td>{item.date}</td>
//                                         <td>{item.event}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <div className="coming-soon">Coming Soon</div>
//                     )}
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// }

import React, { useState } from "react";
import "./AdmissionScheduleViewer.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const mockSchedules = {
    national_exam: [
        { date: "2025-06-27", event: "Đăng ký dự thi THPT Quốc gia", important: true },
        { date: "2025-07-02", event: "Thi môn Ngữ văn", important: true },
        { date: "2025-07-03", event: "Thi môn Toán", important: true },
        { date: "2025-07-04", event: "Thi môn Ngoại ngữ", important: true },
        { date: "2025-07-05", event: "Thi môn Tổ hợp KHTN/KHXH", important: true },
        { date: "2025-07-20", event: "Công bố kết quả thi", important: true }
    ],
    university: [
        { date: "2025-08-01", event: "Bắt đầu đăng ký xét tuyển đại học", important: true },
        { date: "2025-08-15", event: "Hạn chót nộp hồ sơ đợt 1", important: false },
        { date: "2025-08-20", event: "Công bố kết quả trúng tuyển đợt 1", important: true },
        { date: "2025-08-25", event: "Bắt đầu xét tuyển đợt 2", important: false },
        { date: "2025-09-01", event: "Công bố kết quả cuối cùng", important: true }
    ]
};

export default function AdmissionScheduleViewer() {
    const [selectedType, setSelectedType] = useState('national_exam');

    return (
        <>
            <Navbar />
            <div className="admission-schedule-viewer-container">
                <img src="/your-icon.svg" alt="" className="admission-schedule-viewer-float-icon" />
                <h1 className="admission-schedule-viewer-title">Lịch tuyển sinh đại học 2025</h1>
                <div className="admission-schedule-viewer-desc">Cập nhật nhanh các mốc quan trọng trong mùa tuyển sinh!</div>
                <form className="admission-schedule-viewer-search-bar">
                    {/* Search bar content can go here */}
                </form>
                <div className="admission-schedule-viewer-table-wrapper">
                    <div className="schedule-tabs mb-4">
                        <button
                            className={`tab-button ${selectedType === 'national_exam' ? 'active' : ''}`}
                            onClick={() => setSelectedType('national_exam')}
                        >
                            Lịch thi THPT Quốc gia
                        </button>
                        <button
                            className={`tab-button ${selectedType === 'university' ? 'active' : ''}`}
                            onClick={() => setSelectedType('university')}
                        >
                            Lịch xét tuyển Đại học
                        </button>
                    </div>

                    <div className="timeline">
                        {mockSchedules[selectedType].map((item, index) => (
                            <div
                                key={index}
                                className={`timeline-item ${item.important ? 'important' : ''}`}
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <div className="timeline-date">
                                    {new Date(item.date).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <div className="timeline-content">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-text">{item.event}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}