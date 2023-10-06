import { changeZero } from "../services/services";
function timer(id, deadline) {
  // Timer
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

  setClock(id, deadline);

}
export default timer;