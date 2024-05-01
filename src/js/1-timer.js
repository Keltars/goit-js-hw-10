import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate;
let timerInterval;

const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

refs.startButton.disabled = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: '',
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date().getTime()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startButton.disabled = false;
    } else {
      userSelectedDate = selectedDates[0];
    }
  },
};
flatpickr('#datetime-picker', options);

const zeroToStart = value => {
  return String(value).padStart(2, '0');
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const timerUpd = deltaTime => {
  const { days, hours, minutes, seconds } = convertMs(deltaTime);
  refs.daysEl.textContent = zeroToStart(days);
  refs.hoursEl.textContent = zeroToStart(hours);
  refs.minutesEl.textContent = zeroToStart(minutes);
  refs.secondsEl.textContent = zeroToStart(seconds);
};

const startTimer = targetTime => {
  timerInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const deltaTime = targetTime - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerInterval);
      iziToast.success({
        title: 'Timer Complete',
        message: 'Time`s UP',
        position: 'topRight',
      });
      refs.startButton.disabled = false;
      refs.inputDate.disabled = false;
    } else {
      timerUpd(deltaTime);
    }
  }, 1000);
};

refs.startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    return;
  }

  refs.startButton.disabled = true;
  refs.inputDate.disabled = true;
  startTimer(userSelectedDate);
});
