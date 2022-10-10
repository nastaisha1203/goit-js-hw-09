import { Notify } from 'notiflix/build/notiflix-notify-aio';

const delayRef = document.querySelector('[name="delay"]');
const stepRef = document.querySelector('[name="step"]');
const amountRef = document.querySelector('[name="amount"]');
const formRef = document.querySelector('form');

formRef.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const delayValue = Number(delayRef.value);
  const stepValue = Number(stepRef.value);
  const amountValue = Number(amountRef.value);
  if (delayValue < 0 || stepValue < 0 || amountValue <= 0) {
    Notify.failure('❌ Enter a positive number');
  } else {
    for (let i = 0; i < amountValue; i += 1) {
      let amountDelay = delayValue + i * stepValue;
      createPromise(i + 1, amountDelay)
        .then(({ position, delay }) => {
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        })
        .catch(({ position, delay }) => {
          Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        });
    }
  }
}
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
