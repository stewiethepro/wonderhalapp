import React, { useState, useEffect, useRef } from "react";
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from "@heroicons/react/outline";
import Link from "next/link";

let count = 0;
let slideInterval;

export default function Carousel({cards}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselCards = cards

  const slideRef = useRef();

  const removeAnimation = () => {
    slideRef.current.classList.remove("fade-anim");
  };

  useEffect(() => {
    slideRef.current.addEventListener("animationend", removeAnimation);
    slideRef.current.addEventListener("mouseenter", pauseSlider);
    slideRef.current.addEventListener("mouseleave", startSlider);

    startSlider();
    return () => {
      pauseSlider();
    };
    // eslint-disable-next-line
  }, []);

  const startSlider = () => {
    slideInterval = setInterval(() => {
      handleOnNextClick();
    }, 3000);
  };

  const pauseSlider = () => {
    clearInterval(slideInterval);
  };

  const handleOnNextClick = () => {
    count = (count + 1) % carouselCards.length;
    setCurrentIndex(count);
    slideRef.current.classList.add("fade-anim");
  };
  const handleOnPrevClick = () => {
    const productsLength = carouselCards.length;
    count = (currentIndex + productsLength - 1) % productsLength;
    setCurrentIndex(count);
    slideRef.current.classList.add("fade-anim");
  };

  return (
    <div ref={slideRef} className="w-full select-none relative">
      
      <div key={carouselCards[currentIndex].name} className="group aspect-w-2 aspect-h-1 shadow-2xl rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
        <img
        src={carouselCards[currentIndex].imageSrc}
        alt={carouselCards[currentIndex].imageAlt}
        className="object-center object-cover sm:inset-0 sm:w-full sm:h-full"
        />
        <div
        aria-hidden="true"
        className={`bg-gradient-to-b from-transparent to-${carouselCards[currentIndex].color} opacity-30 sm:absolute sm:inset-0`}
        />
        <div className="p-6 flex items-end sm:absolute sm:inset-0">
            <div>
                <h3 className="font-semibold text-white">
                <Link href={carouselCards[currentIndex].href}>
                    <a>
                    <span className="absolute inset-0" />
                    {carouselCards[currentIndex].name}
                    </a>
                </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                {carouselCards[currentIndex].description}
                </p>
            </div>
        </div>
      </div>

      <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-3 flex justify-between items-center">
        <button
          className="bg-black text-white p-1 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition"
          onClick={handleOnPrevClick}
        >
          <ArrowCircleLeftIcon className="h-5 w-5 text-white" />
        </button>
        <button
          className="bg-black text-white p-1 rounded-full bg-opacity-50 cursor-pointer hover:bg-opacity-100 transition"
          onClick={handleOnNextClick}
        >
          <ArrowCircleRightIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}