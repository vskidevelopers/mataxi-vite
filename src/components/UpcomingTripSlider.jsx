import React, { createRef } from "react";
import Slider from "react-slick";
import UpcomingTripSliderCard from "./UpcomingTripSliderCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function UpcomingTripSlider() {
  const upcomingTripRef = createRef();
  const sliderItems = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          centerPadding: "250px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          centerPadding: "50px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "10px",
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="h-[22rem] w-full overflow-hidden">
      <Slider {...settings} ref={upcomingTripRef}>
        {sliderItems.map((sliderItem) => (
          <div key={sliderItem} className="">
            <UpcomingTripSliderCard />
          </div>
        ))}
      </Slider>
    </div>
  );
}
