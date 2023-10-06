import { changeZero } from "../services/services";
function slider({container, slide, nextArrowSelector, prevArrowSelector, totalCounter, currentCounter, wrapperSelector, field}) {
  //  Slider
  // Сначала получаем все элементы с которыми будем работать
  const slides = document.querySelectorAll(slide),
    slider = document.querySelector(container),
    currentCount = document.querySelector(currentCounter),
    totalCount = document.querySelector(totalCounter),
    prevArrow = document.querySelector(prevArrowSelector),
    nextArrow = document.querySelector(nextArrowSelector),
    slidesWrapper = document.querySelector(wrapperSelector),
    slidesField = document.querySelector(field),
    width = window.getComputedStyle(slidesWrapper).width;

  let indexCurrentSlide = 1;
  let offset = 0;
  totalCount.textContent = changeZero(slides.length);
  currentCount.textContent = changeZero(indexCurrentSlide);


  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = width;
  });

  slider.style.position = ' relative';

  const indicators = document.createElement('ol'),
    dots = [];

  indicators.classList.add('carousel-indicators');
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1)
    dot.classList.add('dot');
    if (i == 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }

  function addActiveDots(dots) {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[indexCurrentSlide - 1].style.opacity = '1';
  }

  function deleteNotDigits(str) {
    return +str.replace(/\D/g, '');
  }

  nextArrow.addEventListener('click', () => {
    if (offset == deleteNotDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteNotDigits(width);
    }

    slidesField.style.transform = `translateX(-${offset}px)`

    if (indexCurrentSlide == slides.length) {
      indexCurrentSlide = 1;
    } else {
      indexCurrentSlide++;
    }

    currentCount.textContent = changeZero(indexCurrentSlide);

    addActiveDots(dots);

  })
  prevArrow.addEventListener('click', () => {
    if (offset == 0) {
      offset = deleteNotDigits(width) * (slides.length - 1);
    } else {
      offset -= deleteNotDigits(width);
    }

    slidesField.style.transform = `translateX(-${offset}px)`

    if (indexCurrentSlide == 1) {
      indexCurrentSlide = slides.length;
    } else {
      indexCurrentSlide--;
    }

    currentCount.textContent = changeZero(indexCurrentSlide);

    addActiveDots(dots);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute("data-slide-to");

      indexCurrentSlide = slideTo;

      offset = deleteNotDigits(width) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px)`

      currentCount.textContent = changeZero(indexCurrentSlide);

      addActiveDots(dots);
    })
  })

  // totalCount.textContent = changeZero(slides.length);
  // currentCount.textContent = changeZero(1);
  // // Дальше нам понадобится параметр(индекс) который будет определять наш текущий слайд
  // showSlide(indexCurrentSlide);
  // // Написание функции, которая будет заниматься показом наших слайдов (будет включаться сразу 2 функции - как показ оперделенног слайда/скрытие других(принимает индекс)
  // function showSlide(slide) {
  //   if (slide > slides.length) {
  //     slide = indexCurrentSlide =  1;
  //   } else if (slide < 1) {
  //     slide = indexCurrentSlide = slides.length;
  //   }
  //   slides.forEach((item) => {
  //     item.classList.remove('show');
  //     item.classList.add('hide');
  //   });
  //   slides[slide-1].classList.add('show');
  //   slides[slide-1].classList.remove('hide');

  //   currentCount.textContent = changeZero(slide);
  // }

  // prevArrow.addEventListener('click', () => {
  //   indexCurrentSlide--;
  //   showSlide(indexCurrentSlide);
  // });
  // nextArrow.addEventListener('click', () => {
  //   indexCurrentSlide++
  //   showSlide(indexCurrentSlide);
  // })
}
export default slider;