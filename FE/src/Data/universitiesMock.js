import bachkhoa from "../assets/University images/bku.png";
import ktqd from "../assets/University images/neu.png";
import fpt from "../assets/University images/fpt.png";
import ftu from "../assets/University images/ftu.png";
const universitiesMock = [
  {
    name: "Đại học Bách Khoa",
    location: "TP.HCM",
    image:bachkhoa,
    majors: [
      {
        name: "Công nghệ Thông tin",
        admissionScore: 27.5,
        tuition: "30 triệu/năm",
        rating: 4.5,
        employmentRate: "95%",
      },
      {
        name: "Kỹ thuật Cơ khí",
        admissionScore: 25.8,
        tuition: "28 triệu/năm",
        rating: 4.2,
        employmentRate: "90%",
      },
    ],
  },
  {
    name: "Đại học Kinh tế Quốc dân",
    location: "Hà Nội",
    image:ktqd,
    majors: [
      {
        name: "Kinh tế",
        admissionScore: 26.0,
        tuition: "25 triệu/năm",
        rating: 4.3,
        employmentRate: "93%",
      },
      {
        name: "Tài chính Ngân hàng",
        admissionScore: 25.5,
        tuition: "24 triệu/năm",
        rating: 4.1,
        employmentRate: "88%",
      },
    ],
  },
  {
    name: "Đại học Ngoại thương",
    location: "Hà Nội",
    image: ftu,
    majors: [
      {
        name: "Kinh tế",
        admissionScore: 27.0,
        tuition: "33 triệu/năm",
        rating: 4.7,
        employmentRate: "98%",
      },
      {
        name: "Kinh doanh quốc tế",
        admissionScore: 26.8,
        tuition: "32 triệu/năm",
        rating: 4.6,
        employmentRate: "96%",
      },
    ],
  },
  {
    name: "Đại học FPT",
    location: "TP.HCM",
    image: fpt,
    majors: [
      {
        name: "Công nghệ Thông tin",
        admissionScore: 21.0,
        tuition: "28.5 triệu/năm",
        rating: 1.0,
        employmentRate: "100%",
      },
      {
        name: "Kinh doanh quốc tế",
        admissionScore: 20.5,
        tuition: "28.5 triệu/năm",
        rating: 3.0,
        employmentRate: "80%",
      },
    ],
  },
];

export default universitiesMock;
