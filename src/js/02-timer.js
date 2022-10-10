import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../css/common.css';
import '../css/02-timer.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};
refs.btnStart.disabled = true;
const TIME_INTERVAL = 1000;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    Notify.init({
      position: 'center-center',
      backOverlay: true,
      clickToClose: true,
      closeButton: true,
    });
    if (selectedDates[0] <= Date.now()) {
      Notify.failure('Please choose a date in the future');
      refs.btnStart.disabled = true;
    } else {
      refs.btnStart.disabled = false;
    }
  },
};

const fp = flatpickr(refs.input, options, {});

const timer = {
  intervalId: null,
  isActive: false,
  start() {
    if (this.isActive) {
      return;
    }
    const startTime = fp.selectedDates[0].getTime();
    this.isActive = true;
    this.intervalId = setInterval(() => {
      const stopTime = Date.now();
      const delta = startTime - stopTime;
      if (delta <= 0) {
        clearInterval(this.intervalId);
        this.isActive = false;
        return;
      }
      const deadline = convertMs(delta);
      updateClock(deadline);
    }, TIME_INTERVAL);
  },
};

refs.btnStart.addEventListener('click', () => {
  timer.start();
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateClock({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}
