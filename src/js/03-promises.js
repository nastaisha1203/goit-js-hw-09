import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formRef = document.querySelector('form');

formRef.addEventListener('submit', onSubmit);

function onSubmit(evt) {
  evt.preventDefault();
  const {
    elements: { delay, step, amount },
  } = evt.currentTarget;
  const delayValue = Number(delay.value);
  const stepValue = Number(step.value);
  const amountValue = Number(amount.value);
  if (delayValue < 0 || stepValue < 0 || amountValue <= 0) {
    Notify.failure('❌ Enter a positive number');
    return;
  }
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
