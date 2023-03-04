const year = acc.movementsDates[i].getFullYear();
const month = `${acc.movementsDates[i].getMonth() + 1}`.padStart(2, 0);
const day = `${acc.movementsDates[i].getDate()}`.padStart(2, 0);
const displayDate = `${day}/${month}/${year}`;

<div class="movements__date">${displayDate}</div>;
