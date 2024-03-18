import { accounts } from "./exampleOnOpen.js";
import { messages } from "./exampleOnOpen.js";

import { rateChange } from "./exampleOnMessage.js";
import { betMessage } from "./exampleOnMessage.js";

import { newRateDood } from "./exampleOnMessage.js";

const players = document.querySelector(".list-elements");
const betsList = document.querySelector(".bets-list");

let topAbsoluter = 74;
let playerElemHeight = 59;

for (let i = 0; i < accounts.length; i++) {
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

    currRank.innerText = accounts[i].rank;
    playerName.innerText = accounts[i].name;
    phoneNum.innerText = '+7...' + accounts[i].phone;
    points.innerText = new Intl.NumberFormat('ru-RU').format(accounts[i].scores);

    player.style = `top: ${topAbsoluter + playerElemHeight * i}px`;
    player.id = accounts[i].rank;
    players.append(player);
}

for (let i = 0; i < messages.length; i++) {
    let message = document.createElement("div");
    message.classList.add("bet-info");

    message.innerText = messages[i].bet;

    betsList.prepend(message);
}

const updateMessages = textMsg => {
    console.log(betsList.children.length);
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

setTimeout(updateMessages, 3000, betMessage.bet);

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
        player.style.top = `${playerElemHeight * (movingPlaces[i]) + topAbsoluter}px`;
        setTimeout(() => {
            player.style.backgroundColor = "#FFD8D8";
        }, 50);
        setTimeout(() => {
            player.style.backgroundColor = "";
        }, 7000);

        console.log(player.style.top);
    }
    for (let i = 0; i < pickedBlocks.length; i++) {
        pickedBlocks[i].id = movingPlaces[i+1];
    }
}

// update делаем тут

let upData = rateChange.update
console.log(upData);
const updateOrder = changeData => {
    let player = document.getElementById(changeData.old);
    console.log(player);

    reShuffle(changeData);

    setTimeout(() => {
        player.style.top = `${playerElemHeight * (changeData.new-1) + topAbsoluter}px`;
    }, 50);
    player.querySelector('.number').innerText = player.id = changeData.new;
    player.querySelector('.points').innerText = changeData.score;
    setTimeout(() => {
        player.style.backgroundColor = "#D4FFD0";
    }, 50);
    setTimeout(() => {
        player.style.backgroundColor = "";
    }, 7000);
}

const newData = rateChange.add;

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
    points.innerText = new Intl.NumberFormat('ru-RU').format(adData.score);

    players.append(player);

    if (adData.rank < players.children.length) {
        let movingCounter = players.children.length - adData.rank

        let movingPlaces = []
        for (let i = 0; i < movingCounter; i++) {
            movingPlaces.push(adData.rank + i)
        }
        
        let dataForShuffle = {
            old: players.children.length,
            new: adData.rank,
            score: adData.score
        }

        player.style.top = `${playerElemHeight * (players.children.length-1) + topAbsoluter}px`;

        reShuffle(dataForShuffle);

        setTimeout(() => {
            player.style.top = `${playerElemHeight * (adData.rank-1) + topAbsoluter}px`;
        }, 50);
        player.id = adData.rank;
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

setTimeout(addPlayer, 2000, newData);
setTimeout(addPlayer, 5000, newRateDood.add);
setTimeout(updateOrder, 8000, upData);