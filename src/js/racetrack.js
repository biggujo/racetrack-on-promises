import random from "random";

import horses from "./horses";

const LOCAL_STORAGE_KEY = "racetrackResults";
let resultsArray = [];
let isInRace = false;
let rowsAmount = 0;

const refs = {
  statusMessage: document.querySelector(".status-msg"),
  winnerMessage: document.querySelector(".winner-msg"),
  table: document.querySelector(".racetrack__table > tbody"),
  buttonControlPad: document.querySelector(".racetrack__control"),
  startBtn: document.getElementById("start-btn"),
  clearBtn: document.getElementById("clear-btn"),
};

refs.buttonControlPad.addEventListener("click", onButtonControlClick);

deserializeResults();
setStatus(getStartText());

function onButtonControlClick({ target }) {
  if (target.nodeName !== "BUTTON") {
    return;
  }

  if (target === refs.startBtn && !isInRace) {
    console.log("Race!");
    race();
  }

  if (target === refs.clearBtn && !isInRace) {
    console.log("Clear");
    localStorage.setItem(LOCAL_STORAGE_KEY, "");
    resultsArray.length = 0;
    clearTable();
  }
}

function race() {
  isInRace = true;
  Promise.race(getHorsePromises())
  .then(horse => {
    resultsArray.push(horse);

    setStatus(getEndText());
    setWinnerMessage(getWinnerText(horse));
    pushToTable(horse);

    serializeResults();

    isInRace = false;
  });
}

function run(horse) {
  const time = getRandomTime();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        horse,
        time,
      });
    }, time);
  });
}

function serializeResults() {
  try {
    const resultsArrayJSON = JSON.stringify(resultsArray);
    localStorage.setItem(LOCAL_STORAGE_KEY, resultsArrayJSON);
  } catch (error) {
    console.error(error.name);
    console.error(error.message);
    console.error(error.stack);
  }
}

function deserializeResults() {
  try {
    const resultsArrayJSON = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (resultsArrayJSON === null) {
      return;
    }

    if (resultsArrayJSON === "") {
      return;
    }

    resultsArray = JSON.parse(resultsArrayJSON);
    resultsArray.forEach(pushToTable);
  } catch (error) {
    console.error(error.name);
    console.error(error.message);
    console.error(error.stack);
  }
}

function getHorsePromises() {
  return horses.map(run);
}

function getStartText() {
  return "Race started!";
}

function getEndText() {
  return "Race Ended!";
}

function getWinnerText({
  horse,
  time,
}) {
  return `${horse} in ${time.toFixed(2)} ms`;
}

function getRandomTime() {
  const MIN_TIME = 2000;
  const MAX_TIME = 2500;

  return random.float(MIN_TIME, MAX_TIME);
}

function setStatus(message) {
  refs.statusMessage.textContent = message;
}

function setWinnerMessage(message) {
  refs.winnerMessage.textContent = message;
}

function clearTable() {
  refs.table.innerHTML = "";
}

function pushToTable({
  horse,
  time,
}) {
  rowsAmount += 1;
  const row = `<td>${rowsAmount}</td><td>${horse}</td><td>${time.toFixed(2)} ms</td>`;
  refs.table.insertAdjacentHTML("beforeend", row);
}
