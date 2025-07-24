import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./ExamSchedule.css";
import axios from "axios";

export default function ExamSchedule() {
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get("/api/uni/v1/exam-schedule");
                const raw = response.data.data || [];

                const grouped = {};

                raw.forEach(item => {
                    const start = new Date(item.startDate);
                    const end = item.endDate ? new Date(item.endDate) : null;

                    const dateKey = start.toLocaleDateString("vi-VN");
                    const hour = start.getHours();

                    let timeSlot = "KHÁC";
                    if (hour < 12) timeSlot = "SÁNG";
                    else if (hour >= 12 && hour < 18) timeSlot = "CHIỀU";
                    else if (item.content.toLowerCase().includes("dự phòng")) timeSlot = "DỰ PHÒNG";

                    const duration =
                        end && start && end > start
                            ? `${Math.round((end - start) / (1000 * 60))} phút`
                            : "-";

                    const event = {
                        subject: item.content,
                        start: start.toTimeString().slice(0, 5),
                        duration,
                        note: item.note || ""
                    };

                    if (!grouped[dateKey]) grouped[dateKey] = {};
                    if (!grouped[dateKey][timeSlot]) grouped[dateKey][timeSlot] = [];
                    grouped[dateKey][timeSlot].push(event);
                });

                const formatted = Object.entries(grouped).map(([date, sessionsMap]) => ({
                    date,
                    sessions: Object.entries(sessionsMap).map(([time, events]) => ({
                        time,
                        events
                    }))
                }));

                setExamData(formatted);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu lịch thi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <>
            <Navbar />
            <div className="exam-schedule-page">
                <h1 className="exam-title">Lịch thi tốt nghiệp THPT Quốc gia 2025</h1>
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <div className="infographic-container">
                        {examData.map((day, idx) => (
                            <div className="info-day-block" key={day.date}>
                                <div className="info-date">
                                    <span className="info-date-icon">📅</span>
                                    <span className="info-date-text">{day.date}</span>
                                </div>
                                <div className="info-sessions">
                                    {day.sessions.map((session, sidx) => (
                                        <div className="info-session" key={session.time + sidx}>
                                            <div className="info-session-title">
                                                {session.time === "SÁNG" && <span>🌞</span>}
                                                {session.time === "CHIỀU" && <span>🌙</span>}
                                                {session.time === "DỰ PHÒNG" && <span>🛠️</span>}
                                                <span>{session.time}</span>
                                            </div>
                                            <div className="info-events">
                                                {session.events.map((event, eidx) => (
                                                    <div className="info-event-card" key={event.subject + eidx}>
                                                        <div className="info-event-main">
                                                            <span className="info-event-icon">📖</span>
                                                            <span className="info-event-subject">{event.subject}</span>
                                                        </div>
                                                        <div className="info-event-detail">
                                                            {event.start !== "-" && (
                                                                <span className="info-event-time">🕒 {event.start}</span>
                                                            )}
                                                            {event.duration !== "-" && (
                                                                <span className="info-event-duration">⏳ {event.duration}</span>
                                                            )}
                                                            {event.note && <span className="info-event-note">💡 {event.note}</span>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
