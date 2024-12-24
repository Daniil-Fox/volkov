import { Swiper } from "swiper";
import { EffectFade, Navigation } from "swiper/modules";

Swiper.use([Navigation, EffectFade]);

const pcSlider = new Swiper(".team-pc__slider", {
  loop: true,
  slidesPerView: 1,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  navigation: {
    prevEl: ".temp-slider__arr--prev",
    nextEl: ".temp-slider__arr--next",
  },
});

const mobSlider = new Swiper(".team-mob__slider", {
  loop: true,
  slidesPerView: 1,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
});

pcSlider.on("slideChange", (swiper) => {
  mobSlider.slideTo(swiper.activeIndex);
});
