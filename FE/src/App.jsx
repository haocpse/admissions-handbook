import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import EventCountDown from "./Pages/EventCountDown/EventCountDown";
import CountDownExamDay from "./Pages/CountDownExamDay/CountDownExamDay";
import CountDownRegisterForAdmission from "./Pages/CountDownRegisterForAdmission/CountDownRegisterForAdmission";
import PublishScoreDay from "./Pages/PublishScoreDay/PublishScoreDay";
import CountDownPublishRealScore from "./Pages/CountDownPublishRealScore/CountDownPublishRealScore";
import AdminSideBar from "./Pages/AdminSideBar/AdminSideBar";
import ManageUniversity from "./Pages/ManageUniversity/ManageUniversity";
import ManageMajor from "./Pages/ManageMajor/ManageMajor";
import ManageSchedual from "./Pages/ManageSchedual/ManageSchedual";
import FavoriteUniversity from "./Pages/FavoriteUniversity/FavoriteUniversity";
import ManageMajorDetail from "./Pages/ManageMajor/ManageMajorDetail";
import SubjectCombinationViewer from "./Pages/SubjectCombinationViewer/SubjectCombinationViewer";
import ManageUniversityDetail from "./Pages/ManageUniversity/ManageUniversityDetai";
import ManageMajorGroup from "./Pages/ManageMajorGroup/ManageMajorGroup";
import ManageNews from "./Pages/ManageNews/ManageNews";
import AIChatbox from "./Components/AIChatbox/AIChatbox";
import AdmissionScore from "./Pages/AdmissionScore/AdmissionScore";
import ScoreCalculator from "./Pages/ScoreCalculator/ScoreCalculator";
import UniCompare from "./Pages/UniversityComparison/UniCompare";
import LayoutAdmin from "./Pages/Layout/LayoutAdmin";
import ManageQA from "./Pages/ManageQA/ManageQA";
import VerifyInfo from "./Pages/VerifyInfo/VerifyInfo";
import ManageScore from "./Pages/ManageScore/ManageScore";
import CommunityChat from "./Pages/CommunityChat/CommunityChat";
import CompetencyAssessmentHCMStage1 from "./Pages/CompetencyAssessmentHCMStage1/CompetencyAssessmentHCMStage1";
import CompetencyAssessmentHCMStage2 from "./Pages/CompetencyAssessmentHCMStage2/CompetencyAssessmentHCMStage2";
import CompetencyAssessmentHNStage1 from "./Pages/CompetencyAssessmentHNStage1/CompetencyAssessmentHNStage1";
import CompetencyAssessmentHNStage2 from "./Pages/CompetencyAssessmentHNStage2/CompetencyAssessmentHNStage2";
import ExamSchedule from "./Pages/ExamSchedule/ExamSchedule";
import UserProfile from "./Pages/UserProfile/UserProfile";
import FilterUniversities from "./Pages/FilterUniversities/FilterUniversities";
import ProtectedRoutesAdmin from "./Utils/ProtectedRoutesAdmin";
import UniversitiesGeneralDetail from "./Pages/UniversityList/UniversitiesGeneralDetail";
import ListUniversitiesView from "./Pages/UniversityList/ListUniversitiesView";
import UniversitySuggest from "./Pages/UniversitySuggest/UniversitySuggest";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dem-nguoc" element={<EventCountDown />} />
        <Route path="/dem-nguoc/ngay-thi-tot-nghiep" element={<CountDownExamDay />} />
        <Route path="/dem-nguoc/ngay-dang-ki-nguyen-vong" element={<CountDownRegisterForAdmission />} />
        <Route path="/dem-nguoc/cong-bo-diem-thi" element={<PublishScoreDay />} />
        <Route path="/dem-nguoc/diem-chuan-dot-1" element={<CountDownPublishRealScore />} />
        <Route path="/dem-nguoc/dgnl-dot1-hcm" element={<CompetencyAssessmentHCMStage1 />} />
        <Route path="/dem-nguoc/dgnl-dot2-hcm" element={<CompetencyAssessmentHCMStage2 />} />
        <Route path="/dem-nguoc/dgnl-dot1-hn" element={<CompetencyAssessmentHNStage1 />} />
        <Route path="/dem-nguoc/dgnl-dot2-hn" element={<CompetencyAssessmentHNStage2 />} />
        <Route path="/tra-cuu-to-hop-mon" element={<SubjectCombinationViewer />} />
        <Route path="/ai-chatbox" element={<AIChatbox />} />
        <Route path="/danh-sach-truong" element={<ListUniversitiesView />} />
        <Route path="/danh-sach-truong/:id" element={<UniversitiesGeneralDetail />} />
        <Route path="/lich-thi" element={<ExamSchedule />} />
        <Route path="/filter-universities/:type/:id" element={<FilterUniversities />} />
        {/* <Route path="/goi-y-dai-hoc" element={<UniversitySuggest />} /> */}
        <Route path="/hoi-va-dap" element={<CommunityChat />} />

        {/** MANAGE ADMIN */}
        <Route element={<ProtectedRoutesAdmin />}>
          <Route path='/admin' element={<LayoutAdmin />}>
            <Route path="/admin/manage-dai-hoc" element={<ManageUniversity />} />
            <Route path="/admin/universities/:id" element={<ManageUniversityDetail />} />
            <Route path="/admin/manage-nganh-hoc" element={<ManageMajorDetail />} />
            <Route path="/admin/manage-thoi-gian-thi" element={<ManageSchedual />} />
            <Route path="/admin/manage-to-hop-mon" element={<ManageMajorGroup />} />
            <Route path="/admin/manage-tin-tuc" element={<ManageNews />} />
            <Route path="/admin/diem-chuan" element={<ManageScore />} />
          </Route>
        </Route>

        {/** USER PAGE */}

        <Route path="/nguoi-dung/truong-yeu-thich" element={<FavoriteUniversity />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/diem-chuan" element={<AdmissionScore />} />
        <Route path="/diem-chuan/:id" element={<AdmissionScore />} />
        <Route path="/tinh-diem" element={<UniversitySuggest />} />
        <Route path="/so-sanh" element={<UniCompare />} />
        {/* Add more routes as needed */}
        <Route path="/staff" element={<VerifyInfo />} />
      </Routes>
    </Router >
  );
}

export default App;
