'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const deleteAll = document.querySelector('.delete__all');
const sort = document.querySelector('.sort');

const Capitalise = function (name) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
};

//console.log('captilalise', Capitalise('rUNNING'));
class Workout {
  date = new Date();
  id = this.date.toISOString().slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; // in km
    this.duration = duration; //in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${Capitalise(this.type)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const r1 = new Running([12, 77], 12, 23, 178);
const c1 = new Cycling([12, 77], 12, 23, 276);

// console.log(r1, c1);
//////////////////////////////////////
class App {
  #map;
  #mapEventCoords;
  #mapMarker = [];
  #mapZoomLevel = 13;
  #workouts = [];
  #sort;
  constructor() {
    this.#sort = this._sortType();
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener(
      'click',
      this._moveToPopupAndCrud.bind(this)
    );
    deleteAll.addEventListener('click', this._delete_All.bind(this));
    sort.addEventListener('click', this._sort.bind(this));
    this._getLocalStorage();
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your location');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.marker(coords)
    //   .addTo(this.#map)
    //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //   .openPopup();

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
    // console.log(`https://www.google.com/maps/@${latitude},${longitude},17z`);
  }

  _showForm(ev) {
    // const latlng = ev.latlng;
    this.__form(ev.latlng);
    // this.#mapEventCoords = ev.latlng;
    // form.classList.remove('hidden');
    // inputDistance.focus();
  }
  __form(latlng) {
    // console.log(latlng);
    this.#mapEventCoords = latlng;
    // console.log(this.#mapEventCoords, latlng);
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('hidden');
    inputElevation.closest('.form__row').classList.toggle('hidden');
  }

  _hideForm() {
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _newWorkout(e) {
    e.preventDefault();
    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const validinputs = (...items) => items.every(i => Number.isFinite(i));
    const allPositive = (...items) => items.every(i => i > 0);
    const { lat, lng } = this.#mapEventCoords;
    let workout;
    // If workout running, create running object
    if (type === 'running') {
      // Check if data is valid
      const cadence = +inputCadence.value;
      if (
        !validinputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert(
          'Please type Valid input.Input should be positive number only'
        );
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevationGain = +inputElevation.value;

      if (
        !validinputs(duration, distance, elevationGain) ||
        !allPositive(duration, distance)
      ) {
        return alert(
          'Please type Valid input.Input should be positive number only'
        );
      }

      workout = new Cycling([lat, lng], distance, duration, elevationGain);
    }
    // Add new object to workout array
    this.#workouts.push(workout);
    // console.log(this.#workouts);
    // Render workout on map as marker
    this._renderWorkoutMarker(workout);
    // Render workout on list
    this._renderWorkout(workout);
    // Hide form + clear input fields
    this._hideForm();
    this._setLocalStorage();
    // console.log(lat, lng);
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();

    this.#mapMarker.push({
      workout,
      marker,
    });
  }

  _renderWorkout(workout) {
    const workoutType = (running, cycling) => {
      // workout.type === 'running' ?  '🏃‍♂️' :  '🚴‍♀️';
      if (workout.type === 'running') return running;
      return cycling;
    };
    const fixedDecimal = num => num?.toFixed(1);
    // const getImg = function (src, alt, classname) {
    //   const img = new Image();
    //   img.src = src;
    //   img.alt = alt;
    //   img.classList.add('crud');
    //   img.classList.add(classname);
    //   return img;
    // };
    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__crud">
           <img class="crud crud__edit" src="./edit.png" alt="edit" />
            <img class="crud crud__delete" src="./delete.png" alt="delete" />
          </div>
          <div class="workout__details">
            <span class="workout__icon">${workoutType('🏃‍♂️', '🚴‍♀️')}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workoutType(
              fixedDecimal(workout.pace),
              fixedDecimal(workout.speed)
            )}</span>
            <span class="workout__unit">${workoutType('min/km', 'km/h')}</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">${workoutType('🦶🏼', '⛰')}</span>
            <span class="workout__value">${workoutType(
              workout.cadence,
              workout.elevationGain
            )}</span>
            <span class="workout__unit">${workoutType('m', 'spm')}</span>
          </div>
        </li>
    `;
    form.insertAdjacentHTML('afterend', html);
    // console.log(this.#workouts);

    if (this.#workouts.length > 1) {
      deleteAll.classList.remove('hidden');
      sort.classList.remove('hidden');
    }

    // const editIcon = getImg('./edit.png', 'edit', 'crud__edit');
    // const deleteIcon = getImg('./delete.png', 'delete', 'crud__delete');

    // const workoutContainer = document.querySelector('.workout__crud');
    // // workoutContainer.appendChild(editIcon);
    // // workoutContainer.appendChild(deleteIcon);
    // // workoutContainer.insertAdjacentHTML('afterbegin', `${editIcon}`);
    // // workoutContainer.insertAdjacentHTML('beforeend', `${deleteIcon}`);
    // console.log(editIcon, deleteIcon, workoutContainer);
  }
  _moveToPopupAndCrud(e) {
    const workoutEl = e.target.closest('.workout');
    // console.log('workoutEl', workoutEl);
    const crud = e.target.closest('.crud');

    if (!workoutEl) return;

    // console.log(e.target.closest('.workout'));
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animation: true,
      pan: {
        duration: 1,
      },
    });
    if (crud.classList.contains('crud__edit')) {
      this._edit(e, crud, workout);
    }

    if (crud.classList.contains('crud__delete')) {
      this._delete(crud, workout);
    }
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    // console.log(data);

    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }

  _updateForm(workout) {
    console.log(workout.distance, workout.duration);
    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    if (inputType.value === 'running') {
      inputCadence.value = workout.cadence;
    }

    if (inputType.value === 'cycling') {
      inputElevation.value = workout.elevationGain;
    }
  }
  _edit(e, html, workout) {
    // this._removeWorkout(html, workout);
    const editHtml = html.closest('.workout');
    editHtml.classList.add('hidden');
    const lat = workout.coords[0];
    const lng = workout.coords[1];
    // this._delete(html, workout);
    this._removeFromLocalStorage(workout);
    this._removeMarker(workout);
    console.log(lat, lng);
    this.__form({ lat, lng });
    this._updateForm(workout);
  }

  _removeMarker(workout) {
    const { marker } = this.#mapMarker.find(
      marker => marker.workout === workout
    );
    this.#map.removeLayer(marker);
  }
  _removeFromLocalStorage(workout) {
    const index = this.#workouts.indexOf(workout);
    this.#workouts.splice(index, 1);
    this._setLocalStorage();
  }
  _removeWorkout(html, workout) {
    const deletedHtml = html.closest('.workout');
    // console.log(html1);
    // console.log(marker);
    deletedHtml.parentNode.removeChild(deletedHtml);

    this._removeFromLocalStorage(workout);
    if (this.#workouts.length === 1) {
      deleteAll.classList.add('hidden');
      sort.classList.add('hidden');
    }
  }

  _delete(html, workout) {
    this._removeWorkout(html, workout);
    // console.log(this.#workouts);
    this._removeMarker(workout);
  }
  _delete_All() {
    this.#workouts = [];
    const list = document.querySelectorAll('.workout');
    list.forEach(item => item.parentNode.removeChild(item));
    localStorage.removeItem('workouts');
    // console.log(this.#workouts, this.#mapMarker);
    this.#mapMarker.forEach(marker => this._removeMarker(marker.workout));

    deleteAll.classList.add('hidden');
    sort.classList.add('hidden');
  }

  _sortType(index = 2) {
    const asc = () =>
      this.#workouts.slice().sort((a, b) => b.distance - a.distance);
    // descending order
    const dsc = () =>
      this.#workouts.slice().sort((a, b) => a.distance - b.distance);
    // normal
    const nor = () => this.#workouts.slice();
    // const index =2;
    const sort = {
      type: [asc, dsc, nor],
      index: () => {
        index = (index + 1) % 3;
        // console.log(index);
        return index;
      },
    };
    return sort;
  }

  _Sort() {
    const sort = this.#sort;
    return sort.type[sort.index()]();
  }
  _sort() {
    // this.#sortedIndex = (this.#sortedIndex + 1) % 3;
    // console.log(this.#sort.index(), this.#sort.index);
    const sort = this._Sort();
    // console.log(new sort());
    const sortedWorkout = sort;
    // console.log(sortedWorkout);
    // console.log(this.#workouts);
    const list = document.querySelectorAll('.workout');
    list.forEach(item => item.parentNode.removeChild(item));

    sortedWorkout.forEach(workout => {
      // console.log(workout);
      // Render workout on list
      this._renderWorkout(workout);
    });
    // Hide form + clear input fields
    this._hideForm();
  }
}

const app = new App();

// let map, mapEventCoords;
