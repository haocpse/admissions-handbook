import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NewsCarousel.css";

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-next`}
      onClick={onClick}
      style={{ right: "-25px" }}
    />
  );
};

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow custom-prev`}
      onClick={onClick}
      style={{ left: "-25px", zIndex: 1 }}
    />
  );
};

const NewsCarousel = ({ newsList }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">📢 Tin tức nổi bật</h2>
      <Slider {...settings}>
        {newsList.map((news) => (
          <div key={news.newId} className="p-2">
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={news.thumbnail || "https://picsum.photos/300/180"}
                  className="card-img-top"
                  alt={news.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{news.title}</h5>
                  <p className="card-text text-muted">{news.description}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsCarousel;
