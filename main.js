const players = document.querySelector(".list-elements");
const betsList = document.querySelector(".bets-list-messages");
const nameOfPPS = document.querySelector(".ardess");

let topAbsoluter = 74;
let playerElemHeight = 59;

const updateMessages = textMsg => {
    let message = document.createElement("div");
    message.classList.add("bet-info");
    message.style.backgroundColor = '#1040BE';
    setTimeout(() => {
        message.style.backgroundColor = '';
    }, 7000);

    message.innerText = textMsg;

    betsList.prepend(message);
    if (betsList.children.length > 3) betsList.removeChild(betsList.childNodes[3]);
}

const reShuffle = obj => {
    // сначала нужно определить какие именно элементы будут изменяться
    let movingCounter = 1 + obj.old - obj.new;

    let movingPlaces = []
    for (let i = 0; i < movingCounter; i++) {
        movingPlaces.push(obj.new + i)
    }

    // а может и использовать для перестановок единый массив, сколько элементов, столько и перестановок
    let pickedBlocks = [];
    
    for (let i = 0; i < movingPlaces.length - 1; i++) {
        let player = document.getElementById(movingPlaces[i]);
        pickedBlocks.push(player);
        player.querySelector('.number').innerText = movingPlaces[i+1];
        player.style.top = `${playerElemHeight * movingPlaces[i] + topAbsoluter}px`;
        setTimeout(() => {
            player.style.backgroundColor = "#FFD8D8";
        }, 50);
        setTimeout(() => {
            player.style.backgroundColor = "";
        }, 7000);

    }
    for (let i = 0; i < pickedBlocks.length; i++) {
        pickedBlocks[i].id = movingPlaces[i+1];
    }

    let arr = [];
    for (let i = 0; i < players.children.length; i++) {
        arr[i] = players.children[i].id;
    }
    let arrDuplicates = arr.filter((number, index, numbers) => {
        numbers.indexOf(number) !== index;
    });
    if (arrDuplicates.length) console.log('наличие повторяющихся id:', arrDuplicates);
}

// update делаем тут
const updateOrder = changeData => {
    let player = document.getElementById(changeData.old);

    reShuffle(changeData);

    setTimeout(() => {
        player.style.top = `${playerElemHeight * (changeData.new-1) + topAbsoluter}px`;
    }, 50);
    player.querySelector('.number').innerText = player.id = changeData.new;
    player.querySelector('.points').innerText = new Intl.NumberFormat('ru-RU').format(changeData.scores);
    setTimeout(() => {
        player.style.backgroundColor = "#D4FFD0";
    }, 50);
    setTimeout(() => {
        player.style.backgroundColor = "";
    }, 7000);
}

const addAllPlayers = data => {
    let player = document.createElement("div");
    player.classList.add("list-elem");
    player.id = data.rank;

    let currRank = document.createElement("p");
    currRank.classList.add("number");
    let playerName = document.createElement("p");
    playerName.classList.add("player");
    let phoneNum = document.createElement("p");
    phoneNum.classList.add("phone");
    let pointsWrapper = document.createElement("div");
    pointsWrapper.classList.add("points-wrapper");
    let points = document.createElement("p");
    points.classList.add("points");

    pointsWrapper.append(points);
    player.append(currRank, playerName, phoneNum, pointsWrapper);

    currRank.innerText = data.rank;
    playerName.innerText = data.name;
    phoneNum.innerText = '+7...' + data.phone;
    points.innerText = new Intl.NumberFormat('ru-RU').format(data.scores);

    player.style.top = `${playerElemHeight * (data.rank-1) + topAbsoluter}px`;
    players.append(player);
}
const addPlayer = adData => {
    let player = document.createElement("div");
    player.classList.add("list-elem");

    let currRank = document.createElement("p");
    currRank.classList.add("number");
    let playerName = document.createElement("p");
    playerName.classList.add("player");
    let phoneNum = document.createElement("p");
    phoneNum.classList.add("phone");
    let pointsWrapper = document.createElement("div");
    pointsWrapper.classList.add("points-wrapper");
    let points = document.createElement("p");
    points.classList.add("points");

    pointsWrapper.append(points);
    player.append(currRank, playerName, phoneNum, pointsWrapper);

    currRank.innerText = adData.rank;
    playerName.innerText = adData.name;
    phoneNum.innerText = '+7...' + adData.phone;
    points.innerText = new Intl.NumberFormat('ru-RU').format(adData.scores);

    if (players.children.length == 30) {
        document.getElementById(30).remove();
        player.id = 30;
    }
    players.append(player);
    let arr = [];
    for (let i = 0; i < players.children.length; i++) {
        arr[i] = players.children[i].id;
    }
    let arrDuplicates = arr.filter((number, index, numbers) => {
        numbers.indexOf(number) !== index;
    });
    if (arrDuplicates.length) console.log('наличие повторяющихся id:', arrDuplicates);

    if (adData.rank < players.children.length) {
        let movingCounter = players.children.length - adData.rank

        let movingPlaces = []
        for (let i = 0; i < movingCounter; i++) {
            movingPlaces.push(adData.rank + i)
        }
        
        let dataForShuffle = {
            old: players.children.length,
            new: adData.rank,
            scores: adData.scores
        }

        player.style.top = `${playerElemHeight * (players.children.length-1) + topAbsoluter}px`;

        reShuffle(dataForShuffle);

        player.id = adData.rank;
        setTimeout(() => {
            player.style.top = `${playerElemHeight * (adData.rank-1) + topAbsoluter}px`;
        }, 50);
        setTimeout(() => {
            player.style.backgroundColor = "#D4FFD0";
        }, 50);
        setTimeout(() => {
            player.style.backgroundColor = "";
        }, 7000);
    } else {
        player.style.top = `${playerElemHeight * (adData.rank-1) + topAbsoluter}px`;
        player.id = adData.rank;
        setTimeout(() => {
            player.style.backgroundColor = "#D4FFD0";
        }, 50);
        setTimeout(() => {
            player.style.backgroundColor = "";
        }, 7000);
    }
}

// добавляем сокет
const currentUrl = new URL(window.location.href);
let socketUrl = currentUrl.href.replace("http", "ws");
socketUrl = socketUrl.replace("/ladder/", "/ws/");
socketUrl = socketUrl.replace("/index.html", "");

const socket = new WebSocket(socketUrl);
socket.onopen = connection => {
    console.log(connection);
}
socket.onmessage = event => {
  let data = JSON.parse(event.data);
  if (data.name) {
    nameOfPPS.innerText = data.name;
    let rating = data.rating;
    players.innerHTML = '';
    for (let i = 0; i < rating.length; i++) {
        addAllPlayers(rating[i]);
    }
  }
  if (data.add) {
    console.log(data.add);
    addPlayer(data.add);
  }
  if (data.bet) {
    updateMessages(data.bet);
  }
  if (data.update) {
    console.log(data.update);
    updateOrder(data.update);
  }
}