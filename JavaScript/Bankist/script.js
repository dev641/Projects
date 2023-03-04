'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Akash Kumar',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],

  interestRate: 1.2, // %
  password: 1111,
  movementsDates: [
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2023-01-14T21:31:17.178Z',
    '2023-01-16T07:42:02.383Z',
    '2023-01-17T09:15:04.904Z',
  ],
  currency: 'INR',
  locale: 'hi-IN', // de-DE
};

const account2 = {
  owner: 'James Scott',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  password: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Benjamin Macmohan barclays',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  password: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Riya Jain',
  movements: [430, 1000, 700, 50, 90, 200, 135, 1500],
  interestRate: 1,
  password: 4444,
  movementsDates: [
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
    '2023-01-14T21:31:17.178Z',
    '2023-01-16T07:42:02.383Z',
    '2023-01-17T09:15:04.904Z',
  ],
  currency: 'INR',
  locale: 'hi-IN', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumCredit = document.querySelector('.summary__value--in');
const labelSumDebit = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPassword = document.querySelector('.login__input--password');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePassword = document.querySelector('.form__input--password');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////
const formatDate = function (
  date,
  options = {
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  },
  locale
) {
  return new Intl.DateTimeFormat(locale, options).format(date);
};
const formatMovementsDate = function (date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDayPassed(new Date(), date);

  if (dayPassed === 0) return `Today`;
  if (dayPassed === 1) return `Yesterday`;
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  // const year = date.getFullYear();
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const day = `${date.getDate()}`.padStart(2, 0);
  // return `${day}/${month}/${year}`;
  return formatDate(date, undefined, locale);
};

const formatCurr = function (locale, currency, value) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementsDate(date, acc.locale);
    const formattedMov = formatCurr(acc.locale, acc.currency, move);
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatCurr(
    account.locale,
    account.currency,
    account.balance
  );
};

const calcDisplaySummary = function (account) {
  const credit = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumCredit.textContent = formatCurr(
    account.locale,
    account.currency,
    credit
  );

  const debit = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumDebit.textContent = formatCurr(
    account.locale,
    account.currency,
    Math.abs(debit)
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCurr(
    account.locale,
    account.currency,
    interest
  );
};

const createUserNames = function (accs) {
  accs.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
};

createUserNames(accounts);

const updateUI = function (acc) {
  // Update movement
  displayMovements(acc);
  // Update balance
  calcDisplayBalance(acc);
  // update Summary
  calcDisplaySummary(acc);
};
let currentAccount, timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

const startLogTimer = function () {
  let time = 600;
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      labelWelcome.textContent = `Login to get started!`;
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }

    time--;
  };
  const timer = setInterval(tick, 1000);

  return timer;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (Number(inputLoginPassword.value) === currentAccount?.password) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPassword.value = '';

    inputLoginPassword.blur();

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = formatDate(now, options, currentAccount.locale);
    // labelDate.textContent = new Intl.DateTimeFormat(
    //   currentAccount.locale,
    //   options
    // ).format(now);
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

    if (timer) clearInterval(timer);
    timer = startLogTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    currentAccount.username !== recieverAccount?.username
  ) {
    // console.log(currentAccount, recieverAccount);
    setTimeout(function () {
      currentAccount.movements.push(-amount);
      recieverAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAccount.movementsDates.push(new Date().toISOString());

      if (timer) clearInterval(timer);
      timer = startLogTimer();
      updateUI(currentAccount);
    }, 2500);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      if (timer) clearInterval(timer);
      timer = startLogTimer();
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePassword.value) === currentAccount.password
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputClosePassword.value = inputCloseUsername.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const inrToUsd = 0.012;

const movementToUsd = movements.map(move => move * inrToUsd);

const movementDescription = movements.map(
  (move, i) =>
    `Movement ${i + 1} : You ${
      move > 0 ? 'deposited' : 'withdrawal'
    } ${Math.abs(move)}`
);

const deposits = movements.filter(move => move > 0);
const withdrawals = movements.filter(move => move < 0);

// console.log(deposits, withdrawals);

const balance = movements.reduce((acc, curr, i, arr) => acc + curr, 0);

// console.log(balance);

// setInterval(function () {
//   //  const now = new Date();
//   // const hour = `${now.getHours()}`.padStart(2, 0);
//   // const min = `${now.getMinutes()}`.padStart(2, 0);
//   // const sec = `${now.getSeconds()}`.padStart(2, 0);
//   // labelTimer.textContent = `${hour}:${min}:${sec}`;
//   const options = {
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//   };
//   const now = formatDate(new Date(), options, currentAccount.locale);

//   labelTimer.textContent = now;
// }, 1000);
