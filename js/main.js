'use strict'

window.addEventListener('DOMContentLoaded', () => {

  // tabs

  const tabs = document.querySelectorAll('.tabcontent'),
    btnOfTabs = document.querySelectorAll('.tabheader__item'),
    parentBtns = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabs.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    btnOfTabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabs[i].classList.add('show', 'fade');
    tabs[i].classList.remove('hide');

    btnOfTabs[i].classList.add('tabheader__item_active')
  }
  hideTabContent();
  showTabContent();

  parentBtns.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      btnOfTabs.forEach((item, i) => {
        if (item == target) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadline = '2023-09-30 00:00';


  function getTimeRemaing(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date());
    let days, hours, minutes, seconds;

    if (t <= 0) {
      days = hours = minutes = seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
        hours = Math.floor((t / (1000 * 60 * 60)) % 24),
        minutes = Math.floor((t / (1000 * 60)) % 60),
        seconds = Math.floor((t / 1000) % 60);
    }

    return {
      t,
      days,
      hours,
      minutes,
      seconds
    }
  }

  function changeZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timerInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaing(endtime);

      days.textContent = changeZero(t.days);
      hours.textContent = changeZero(t.hours);
      minutes.textContent = changeZero(t.minutes);
      seconds.textContent = changeZero(t.seconds);

      if (t.t <= 0) {
        clearInterval(timerInterval);
      }
    }
  }

  setClock('.timer', deadline);

  // Modal

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
    window.removeEventListener('scroll', showModalByScroll);
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.getAttribute('data-close') == "") {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 500000);

  function showModalByScroll() {
    if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
    }
  }

  window.addEventListener('scroll', showModalByScroll);


  // Используем классы для карточек
  class MenuCard {
    constructor(src, alt, subtitle, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.subtitle = subtitle;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    createCard() {
      const card = document.createElement('div');
      if (this.classes.length === 0) {
        this.classes = 'menu__item';
        card.classList.add(this.classes);
      } else {
        this.classes.forEach(className => card.classList.add(className));
      }

      card.innerHTML = `
      <img src="${this.src}" alt=${this.alt}>
      <h3 class="menu__item-subtitle">${this.subtitle}</h3>
      <div class="menu__item-descr">${this.descr}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
      </div>
      `;
      this.parent.append(card);
    }
  }
  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fecth ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getResource('http://localhost:3000/menu')
    .then(data => {
      data.forEach(({ img, altimg, title, descr, price }) => {
        new MenuCard(img, altimg, title, descr, price, '.menu .container ').createCard();
      });
    });

  // Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Успешно отправлено, скоро мы с вами свяжемся',
    failure: 'Произошла ошибка!'
  }

  forms.forEach(form => {
    bindPostData(form);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-type': 'application/json'
      }
    });
    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;

      form.insertAdjacentElement('afterend', statusMessage)

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
        }).catch(() => {
          showThanksModal(message.failure);
        }).finally(() => {
          statusMessage.remove();
          form.reset();
        })
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 2000);
  }

  //  Slider
  // Сначала получаем все элементы с которыми будем работать
  const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    currentCount = document.querySelector('#current'),
    totalCount = document.querySelector('#total'),
    prevArrow = document.querySelector('.offer__slider-prev'),
    nextArrow = document.querySelector('.offer__slider-next'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
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
    if ( i == 0) {
      dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
  }

  function addActiveDots(dots) {
    dots.forEach(dot => dot.style.opacity = '.5');
    dots[indexCurrentSlide - 1].style.opacity = '1';
  }


  nextArrow.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2)
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
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
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
      
      offset = +width.slice(0, width.length - 2) * (slideTo - 1);

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
});