import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import bg from "../../assets/bg.png";
import Footer from "../../Components/Footer/Footer";
import AIChatbox from "../../Components/AIChatbox/AIChatbox";
import './Home.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NewsCarousel from "./NewsCarousel";
import AdmissionSlider from "./AdmissionSlider";
import Select from "react-select";

const STRENGTH_OPTIONS = [
    { value: "Education", label: "Giáo dục" },
    { value: "STEM", label: "Khoa học - Công nghệ - Kỹ thuật - Toán" },
    { value: "Health_Medicine", label: "Y tế & Sức khỏe" },
    { value: "Language_Social_Sciences", label: "Ngôn ngữ & Khoa học Xã hội" },
    { value: "Economics_Law_Management", label: "Kinh tế - Luật - Quản lý" },
    { value: "Multidisciplinary", label: "Đa ngành" },
    { value: "Arts_Design", label: "Nghệ thuật & Thiết kế" },
    { value: "Agriculture_Environment", label: "Nông nghiệp & Môi trường" },
];

const Home = () => {
    const navigate = useNavigate();
    const [PTTS, setPTTS] = useState([]);
    const [THM, setTHM] = useState([]);
    const [theManh, setTheManh] = useState([]);
    const [activeData, setActiveData] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [newsList, setNewsList] = useState([]);
    const [searchMode, setSearchMode] = useState(null);
    const [diem, setDiem] = useState("");
    const [phuongThuc, setPhuongThuc] = useState("TNTHPTQG");
    const [majors, setMajors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedComboOption, setSelectedComboOption] = useState(null);

    // Hàm chuyển trang sang FilterUniversities hoặc SubjectCombinationViewer
    const handleGoToFilterPage = (type, valueObj) => {
        if (type === "combo") {
            navigate(`/tra-cuu-to-hop-mon?comboCode=${valueObj.value}`, {
                state: { selected: valueObj }
            });
        } else if (type === "major") {
            navigate(`/filter-universities/major/${valueObj.value}`, {
                state: { selected: valueObj }
            });
        } else if (type === "strength") {
            navigate(`/danh-sach-truong`, {
                state: { selected: valueObj }
            });
        }
    };


    const handleClick = (btnName) => {
        setActiveButton(btnName);
        if (btnName === "PTTS") {
            setSearchMode("ptts");
        } else if (btnName === "Major") {
            setSearchMode("major");
        } else if (btnName === "THM") {
            setSearchMode("THM");
        }
        else if (btnName === "TheManh") {
            setSearchMode("TheManh");
        }
    };

    const handleClickTaiDay = () => {
        navigate("/tu-van-chon-truong")
    }

    // Lọc trường theo searchValue

    const fetchTHM = async () => {
        try {
            const response = await axios.get("/api/uni/v1/subject-combo");
            setTHM(response.data.data);
            setActiveData(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error("fail fetch");
        }
    }

    const handleSelectTHM = async (selectedOption) => {
        const comboId = selectedOption?.value;
        console.log("Selected comboId:", comboId);
        if (!comboId) return setActiveData([]);
        try {
            const res = await axios.get(`/api/uni/v1/by-combo?comboCode=${comboId}`);
            setActiveData(res.data.data || []);
        } catch {
            toast.error("Không thể lấy trường theo tổ hợp");
        }
    };

    const fetchMajors = async () => {
        try {
            const response = await axios.get("/api/uni/v1/major");
            setMajors(response.data.data);
        } catch (error) {
            console.error("Error fetching majors:", error);
            toast.error("Không thể lấy danh sách ngành");
        }
    };

    const handleSelectMajor = async (selectedOption) => {
        const majorId = selectedOption?.value;
        if (!majorId) return setActiveData([]);
        try {
            const res = await axios.get(`/api/uni/v1/by-major?major=${majorId}`);
            setActiveData(res.data.data || []);
        } catch {
            toast.error("Không thể lấy trường theo ngành");
        }
    };

    const fetchNews = async () => {
        try {
            const response = await axios.get("/api/news/GetAll");
            setNewsList(response.data.data.newDetailResponseList || []);
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Không thể lấy danh sách tin tức");
        }
    };


    const handleSubmitPTTS = async () => {
        if (!diem) {
            toast.warning("Vui lòng nhập điểm của bạn");
            return;
        }
        try {
            const response = await axios.post("/api/tu-van-ptts", {
                score: diem,
                scoreType: phuongThuc,
            });
            setActiveData(response.data.data);
            setShowDropdown(true);
            toast.success("Search thành công");
        } catch (error) {
            console.log(error);
            toast.error("Không thể Search");
        }
    };

    const fetchPTTSafterSearching = async () => {
        try {
            const response = await axios.get("/api/get-ptts");
            setPTTS(response.data.data);
            setActiveData(response.data.data);
            toast.success("fetch success PTTS");
        } catch (error) {
            console.log(error);
            toast.error("fail fetch");
        }
    }

    useEffect(() => {
        fetchTHM();
        fetchMajors();
        fetchNews();
    }, []);

    useEffect(() => {
        setSearchTerm("");
        setShowDropdown(false);
        setActiveData([]); // reset kết quả cũ nếu muốn
    }, [searchMode]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <Navbar />
            <div>
                <div
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "500px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        textAlign: "center",
                        padding: "0 20px",
                    }}
                >
                    <h1 className="mb-4" style={{ marginTop: "-100px" }}>Chào mừng bạn đến với 360 BOOK !</h1>
                    <div className="d-flex flex-wrap justify-content-center gap-3 mb-3" style={{ marginRight: "757px" }}>
                        {/* <button
                            onClick={() => { handleClick('PTTS') }}
                            className={`home-button btn btn-outline-light px-4 py-2 fw-semibold hover-yellow ${activeButton === 'PTTS' ? 'active' : ''}`}
                            style={{ borderRadius: "5px", color: "grey", backgroundColor: "white" }}
                        >
                            Phương thức tuyển sinh
                        </button> */}

                        <button
                            onClick={() => { handleClick('THM'); }}
                            className={`home-button btn btn-outline-light px-4 py-2 fw-semibold hover-yellow ${activeButton === 'THM' ? 'active' : ''}`}
                            style={{ borderRadius: "5px", color: "grey", backgroundColor: "white" }}
                        >
                            Khối - tổ hợp môn
                        </button>

                        <button
                            onClick={() => handleClick('Major')}
                            className={`home-button btn btn-outline-light px-4 py-2 fw-semibold hover-yellow ${activeButton === 'Major' ? 'active' : ''}`}
                            style={{ borderRadius: "5px", color: "grey", backgroundColor: "white" }}
                        >
                            Ngành
                        </button>

                        <button
                            onClick={() => { handleClick('TheManh') }}
                            className={`home-button btn btn-outline-light px-4 py-2 fw-semibold hover-yellow ${activeButton === 'TheManh' ? 'active' : ''}`}
                            style={{ borderRadius: "5px", color: "grey", backgroundColor: "white" }}
                        >
                            Thế mạnh
                        </button>
                    </div>
                    <div className="search-container" style={{ position: "relative", width: "100%", maxWidth: "1200px", marginTop: "-5px" }}>
                        {searchMode === "ptts" ? (
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <input
                                    type="number"
                                    className="form-control form-control-lg"
                                    placeholder="Nhập điểm của bạn"
                                    value={diem}
                                    onChange={(e) => setDiem(e.target.value)}
                                    style={{ width: "225px", borderRadius: "5px" }}
                                />
                                <select
                                    className="form-select form-select-md"
                                    value={phuongThuc}
                                    onChange={(e) => setPhuongThuc(e.target.value)}
                                    style={{ width: "250px", borderRadius: "5px" }}
                                >
                                    <option value="TNTHPTQG">Tốt nghiệp trung học phổ thông quốc gia</option>
                                    <option value="HOCBA">Học bạ</option>
                                    <option value="DGNLHN">ĐGNL Hà Nội</option>
                                    <option value="DGNLHCM">ĐGNL TP.HCM</option>
                                </select>
                                <button
                                    className="button-with-icon"
                                    onClick={() => {
                                        handleSubmitPTTS();
                                        fetchPTTSafterSearching();
                                    }}
                                >
                                    <svg className="icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill="#ffffff"
                                            d="M12 39c-.549 0-1.095-.15-1.578-.447A3.008 3.008 0 0 1 9 36V12c0-1.041.54-2.007 1.422-2.553a3.014 3.014 0 0 1 2.919-.132l24 12a3.003 3.003 0 0 1 0 5.37l-24 12c-.42.21-.885.315-1.341.315z"
                                        ></path>
                                    </svg>
                                    <span className="text">Search</span>
                                </button>
                            </div>
                        ) : ["major", "THM", "TheManh"].includes(searchMode) ? (
                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder={
                                        searchMode === "major"
                                            ? "Chọn ngành..."
                                            : searchMode === "THM"
                                                ? "Chọn tổ hợp môn..."
                                                : "Chọn lĩnh vực thế mạnh..."
                                    }
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    value={searchTerm}
                                />

                                {showDropdown && (
                                    <div
                                        className="dropdown-menu show"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            width: "100%",
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                            marginTop: "8px",
                                            zIndex: 10
                                        }}
                                    >
                                        {(searchMode === "major"
                                            ? majors
                                            : searchMode === "THM"
                                                ? THM
                                                : STRENGTH_OPTIONS
                                        )
                                            .filter((item) => {
                                                const label =
                                                    searchMode === "major"
                                                        ? item.majorName
                                                        : searchMode === "THM"
                                                            ? `${item.codeCombination} - ${item.subjectName.join(", ")}`
                                                            : item.label;

                                                return label.toLowerCase().includes(searchTerm.toLowerCase());
                                            })
                                            .map((item) => {
                                                const label =
                                                    searchMode === "major"
                                                        ? item.majorName
                                                        : searchMode === "THM"
                                                            ? `${item.codeCombination} - ${item.subjectName.join(", ")}`
                                                            : item.label;

                                                const value =
                                                    searchMode === "major"
                                                        ? item.majorId
                                                        : searchMode === "THM"
                                                            ? item.codeCombination
                                                            : item.value;

                                                return (
                                                    <div
                                                        key={value}
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            if (searchMode === "major") {
                                                                handleSelectMajor({ value, label });
                                                                handleGoToFilterPage("major", { value, label });
                                                            } else if (searchMode === "THM") {
                                                                handleSelectTHM({ value, label });
                                                                handleGoToFilterPage("combo", { value, label });
                                                            } else if (searchMode === "TheManh") {
                                                                handleGoToFilterPage("strength", { value, label });
                                                            }

                                                            setSearchTerm(label);
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        {label}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Tìm kiếm trường, ngành, điểm chuẩn..."
                                style={{
                                    borderRadius: "5px",
                                    paddingLeft: "25px",
                                    fontSize: "1.2rem",
                                    cursor: "pointer"
                                }}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                            />
                        )}
                    </div>


                    <div style={{ marginTop: "20px", marginBottom: "5px" }}>
                        <p style={{
                            color: "#000",
                            fontSize: "1.25rem",
                            fontWeight: "500",
                            textAlign: "center",
                            maxWidth: "800px"
                        }}>
                            Bạn đang muốn tìm xem với điểm số của mình theo từng phương thức xét tuyển<br />
                            thì trường nào, ngành nào phù hợp?
                        </p>
                    </div>
                    <div>
                        <button onClick={handleClickTaiDay}
                            style={{
                                background: "none",
                                borderRadius: "4px",
                                color: "black",
                                cursor: "pointer",
                                fontSize: "1rem",
                                padding: "4px 12px",
                                border: "1.5px solid",
                            }}
                        >
                            <span>Tại đây</span>
                        </button>
                    </div>
                </div>
                <div className="container my-5">
                    <NewsCarousel newsList={newsList} />
                </div>
                <div className="container my-5">
                    <h2 className="text-center mb-4">360Book Location</h2>
                    <div style={{ width: "100%", height: "400px", borderRadius: "8px", overflow: "hidden" }}>
                        <iframe
                            title="Map"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5021981218963!2d106.7004232148007!3d10.773374792323432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752edb9d245a1d%3A0x391251c0ffdaaf34!2zSOG7kyBDw7RuZyBuaOG6rXAgQ-G6p3kgVGjDoG5oIHZp4buHbiDEkOG7k25nIEjhu41jIFRQLiBIQ00!5e0!3m2!1svi!2s!4v1626264814053!5m2!1svi!2s"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
                <AdmissionSlider />
            </div>
            <Footer />
            <AIChatbox />
        </>
    );
};

export default Home;

