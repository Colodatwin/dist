'use strict'
import tabs from './modules/tabs';
import modal from './modules/modal';
import cards from './modules/cards';
import timer from './modules/timer';
import forms from './modules/forms';
import calc from './modules/calc';
import slider from './modules/slider';
import { openModal } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

  const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 500000);

  tabs('.tabheader__item', '.tabcontent', '.tabheader__items','tabheader__item_active');
  modal('[data-modal]', '.modal', modalTimerId);
  cards();
  timer('.timer', '2024-01-01');
  forms('form', modalTimerId);
  calc();
  slider({
    container: '.offer__slider',
    nextArrowSelector: '.offer__slider-next',
    prevArrowSelector: '.offer__slider-prev',
    totalCounter: '#total',
    currentCounter: '#current',
    slide: '.offer__slide',
    wrapperSelector: '.offer__slider-wrapper',
    field: '.offer__slider-inner'
  });
});