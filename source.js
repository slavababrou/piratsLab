"use strict";

const startGame = (event) => {
  event.preventDefault();
  if (!validateFormData()) {
    return;
  }

  setInitValue();
  toggleView();
  setCurentPlayerView();

  getFormData();
  setPlayers();

  displayPlayers();
  displayPlayerMarkers();
};

const throwCube = () => {
  const generateMove = () => {
    const move = Math.floor(Math.random() * cubeSize) + 1;
    logMessage += `Игрок ${currentPlayer} бросил кость, ему выпало: ${move};`;

    //  Перемещаем игрока на move и проверяем на какой он клетке
    playerMakeMove(move);
    checkPlayerPosition();
  };

  generateMove();
  //  Если игрок на клетке с повторным ходом - бросаем кость снова
  if (players[currentPlayer].againTurn) {
    generateMove();
    players[currentPlayer].againTurn -= 1;
  }

  //  Выводим лог о ходе игрока, перемещаем фишку на новую клетку
  addNewLog(logMessage);
  displayPlayerMarker();

  if (isGameFinished) {
    endGame();
    return;
  }
  setNextPlayer();

  //  Цикл для перебора следующих игроков которые пропустят ход
  while (1)
    if (players[currentPlayer].skipTurn) {
      if (players[currentPlayer].skipTurn === 2)
        logMessage = `Игрок ${currentPlayer} пропускает этот и следующий ход`;
      else logMessage = `Игрок ${currentPlayer} пропускает этот ход`;
      players[currentPlayer].skipTurn -= 1;

      addNewLog(logMessage);
      setNextPlayer();
    } else break;

  setCurentPlayerView();
};

//  Добавляем новое сообщение в логгер
const addNewLog = (info) => {
  let date = new Date();
  let newDiv = document.createElement("li");
  newDiv.textContent = date.toLocaleTimeString() + " : " + String(info);
  gameLoggerInfo.prepend(newDiv);
  logMessage = "";
};

// Выводим 'ход игрока currentPlayer' на панели с кнопкой Бросить кость
const setCurentPlayerView = () => {
  playerView.textContent = currentPlayer;
};

//  Перемещаем игрока на move клеток
const playerMakeMove = (move) => {
  players[currentPlayer].place += move;
  if (players[currentPlayer].place >= 44) {
    players[currentPlayer].place = 44;
    isGameFinished = true;
  }
};

//  Проверяем на какой клетке стоит игрок
const checkPlayerPosition = () => {
  let mapObj = map.find((item) => item.id === players[currentPlayer].place);

  switch (mapObj.op) {
    case "вперёд":
      logMessage += ` Он двигается вперёд на ${mapObj.value}.`;
      players[currentPlayer].place += mapObj.value;
      break;
    case "ходи ещё":
      logMessage += ` Он бросает кость ещё раз; `;
      players[currentPlayer].againTurn += 1;
      break;
    case "назад":
      logMessage += ` Он двигается назад на ${mapObj.value}.`;
      players[currentPlayer].place -= mapObj.value;
      break;
    case "пропуск":
      logMessage += ` Он пропускает ${mapObj.value}`;
      logMessage += mapObj.value == 2 ? " хода" : " ход.";
      players[currentPlayer].skipTurn += mapObj.value;
      break;
    default:
      console.log(`Неизвестная операция: ${mapObj.op}`);
  }
};

//  Передаем ход след игроку
const setNextPlayer = () => {
  if (currentPlayer === playersCount) currentPlayer = 1;
  else currentPlayer += 1;
};

//  переключаем вид с Начала игры на Бросить кость
const toggleView = () => {
  startGameForm.classList.toggle("hide");
  bar.classList.toggle("hide");
};

//  Получаем данные с формы (кол-во игроков и граней у кости)
const getFormData = () => {
  playersCount = +document.querySelector(".players-count_inpt").value;
  cubeSize = +document.querySelector(".cube-size_inpt").value;
};

const clearLogger = () => {
  gameLoggerInfo.innerHTML = "";
};

const startNewGame = () => {
  setInitValue();
  toggleView();
  clearLogger();
  clearPlayerMarkers();
};

//  Обновляем все данные
const setInitValue = () => {
  throwCubeBtn.innerHTML = "Бросить кость";
  throwCubeBtn.onclick = throwCube;
  throwCubeBtn.classList.remove("right-side");
  isGameFinished = false;
  currentPlayer = 1;
  playersCount = null;
  cubeSize = null;
  players = [1];
  logMessage = "";
};

//  Создаем массив игроков
//    place - место на карте
//    skipTurn - игрок пропускает ход (skipTurn раз)
//    againTurn - игрок бросает кость еще раз
const setPlayers = () => {
  for (let i = 0; i < playersCount; i++) {
    players.push({ place: 1, skipTurn: 0, againTurn: 0 });
  }
};

const validateFormData = () => {
  let playersInput = +document.querySelector(".players-count_inpt").value;
  let cubeInput = +document.querySelector(".cube-size_inpt").value;

  if (playersInput < 2 || playersInput > 12) {
    alert("Количество игроков должно быть от 2 до 12.");
    return false;
  }

  const validCubeSizes = [4, 6, 8, 10, 12, 20];
  if (!validCubeSizes.includes(cubeInput)) {
    alert(
      "Количество граней у игральной кости должно быть 4, 6, 8, 10, 12 или 20."
    );
    return false;
  }

  return true;
};

//  Отображаем 'Игрок n, и его фишку'
const displayPlayers = () => {
  let playerContainer = document.querySelector(".player-container");

  playerContainer.innerHTML = "";

  players.forEach((player, index) => {
    if (index == 0) return;
    let playerDiv = document.createElement("div");
    playerDiv.className = "player-wrapper";

    let playerNumber = document.createElement("p");
    playerNumber.textContent = "Игрок " + index;
    playerNumber.className = "player-number";
    playerDiv.appendChild(playerNumber);

    let playerFigure = document.createElement("img");
    playerFigure.src = "../assets/players/player (" + index + ").svg";
    playerFigure.className = "player-img";
    playerDiv.appendChild(playerFigure);

    playerContainer.appendChild(playerDiv);
  });
};

//  Отображаем все фишки игроков на старте
const displayPlayerMarkers = () => {
  const playersMarkers = document.querySelector(".players-markers");

  players.forEach((player, index) => {
    if (index == 0) return;
    let playerDiv = document.createElement("div");
    playerDiv.className = `player-marker-wrapper player-marker${index}`;
    playerDiv.style.top = mapCords[0].top;
    playerDiv.style.left = mapCords[0].left;

    let playerFigure = document.createElement("img");
    playerFigure.src = "../assets/players/player (" + index + ").svg";
    playerFigure.className = "player-marker-img";
    playerDiv.appendChild(playerFigure);

    playersMarkers.appendChild(playerDiv);
  });
};

//  Пемещаем фишку игрока после хода
const displayPlayerMarker = () => {
  const cords = mapCords.find(
    (cord) => cord.id === players[currentPlayer].place
  );
  displayMarker(cords);
};
//  Отображаем фишку на сords
const displayMarker = (cords) => {
  const playerMarker = document.querySelector(`.player-marker${currentPlayer}`);

  playerMarker.style.top = cords.top;
  playerMarker.style.left = cords.left;
};

const clearPlayerMarkers = () => {
  const playersMarkers = document.querySelector(".players-markers");
  playersMarkers.innerHTML = "";
};

const endGame = () => {
  throwCubeBtn.innerHTML = "Новая игра";
  throwCubeBtn.onclick = startNewGame;
  throwCubeBtn.classList.add("right-side");

  addNewLog(`----------------------------------------------`);
  addNewLog(`Поздарвляем, игрок ${currentPlayer} победил!!!`);
  addNewLog(`----------------------------------------------`);
};

let currentPlayer;
let playersCount;
let cubeSize;
let players;
let logMessage;
let isGameFinished;

//  Требуемые html - элементы
const bar = document.querySelector(".bar");
const playerView = document.querySelector(".player");
const startGameForm = document.querySelector(".game-start_form");
const throwCubeBtn = document.querySelector(".thorw-cube_btn");
const gameLoggerInfo = document.querySelector(".game-logger_info");

// Модель активных клеток на карте
const map = [
  { id: 2, value: 4, op: "вперёд" },
  { id: 9, value: 16, op: "вперёд" },
  { id: 24, value: 5, op: "вперёд" },
  { id: 27, value: 8, op: "вперёд" },

  { id: 12, value: 1, op: "ходи ещё" },
  { id: 30, value: 1, op: "ходи ещё" },
  { id: 34, value: 1, op: "ходи ещё" },

  { id: 21, value: 6, op: "назад" },
  { id: 28, value: 20, op: "назад" },
  { id: 37, value: 11, op: "назад" },
  { id: 39, value: 16, op: "назад" },

  { id: 3, value: 1, op: "пропуск" },
  { id: 7, value: 1, op: "пропуск" },
  { id: 10, value: 1, op: "пропуск" },
  { id: 18, value: 2, op: "пропуск" },
  { id: 19, value: 1, op: "пропуск" },
  { id: 33, value: 2, op: "пропуск" },
  { id: 40, value: 1, op: "пропуск" },
];

//  Модель карты
const mapCords = [
  { id: 1, top: "725px", left: "950px" },
  { id: 2, top: "645px", left: "910px" },
  { id: 3, top: "580px", left: "950px" },
  { id: 4, top: "530px", left: "905px" },
  { id: 5, top: "535px", left: "835px" },
  { id: 6, top: "575px", left: "775px" },
  { id: 7, top: "560px", left: "695px" },
  { id: 8, top: "530px", left: "635px" },
  { id: 9, top: "540px", left: "555px" },
  { id: 10, top: "580px", left: "505px" },
  { id: 11, top: "640px", left: "560px" },
  { id: 12, top: "700px", left: "525px" },
  { id: 13, top: "725px", left: "455px" },
  { id: 14, top: "715px", left: "385px" },
  { id: 15, top: "680px", left: "330px" },
  { id: 16, top: "680px", left: "255px" },
  { id: 17, top: "690px", left: "185px" },
  { id: 18, top: "670px", left: "65px" },
  { id: 19, top: "590px", left: "100px" },
  { id: 20, top: "520px", left: "130px" },
  { id: 21, top: "470px", left: "200px" },
  { id: 22, top: "440px", left: "275px" },
  { id: 23, top: "390px", left: "330px" },
  { id: 24, top: "370px", left: "405px" },
  { id: 25, top: "360px", left: "480px" },
  { id: 26, top: "350px", left: "560px" },
  { id: 27, top: "370px", left: "630px" },
  { id: 28, top: "410px", left: "690px" },
  { id: 29, top: "390px", left: "760px" },
  { id: 30, top: "390px", left: "845px" },
  { id: 31, top: "370px", left: "935px" },
  { id: 32, top: "305px", left: "960px" },
  { id: 33, top: "195px", left: "940px" },
  { id: 34, top: "200px", left: "840px" },
  { id: 35, top: "180px", left: "650px" },
  { id: 36, top: "190px", left: "575px" },
  { id: 37, top: "180px", left: "495px" },
  { id: 38, top: "150px", left: "420px" },
  { id: 39, top: "165px", left: "350px" },
  { id: 40, top: "155px", left: "270px" },
  { id: 41, top: "130px", left: "195px" },
  { id: 42, top: "120px", left: "125px" },
  { id: 43, top: "180px", left: "75px" },
  { id: 44, top: "260px", left: "95px" },
];
