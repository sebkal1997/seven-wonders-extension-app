import { Game } from "./model/game.js";
import { CreateResource } from "./model/create-resource.js";
import { IncreaseProduction } from "./model/increase-production.js";

'use strict';

const roomPage = document.querySelector('#room-page');
const roomForm = document.querySelector('#roomForm');
const memberPage = document.querySelector('#member-page');
const memberForm = document.querySelector('#memberForm');
const memberList = document.querySelector('#memberList');
const addMemberButton = document.querySelector('#addMemberButton');
const gamePage = document.querySelector('#game-page');
const gameForm = document.querySelector('#gameForm');
const resourceForm = document.querySelector('.form-resource');
const currentMemberName = document.querySelector('#currentMemberName');
const nextMemberButton = document.querySelector('#nextMemberButton');
const woodType = document.querySelector("#woodType");
const woodAmount = document.querySelector("#woodAmount");
const woodProduction = document.querySelector("#woodProduction");
const stoneType = document.querySelector("#stoneType");
const stoneAmount = document.querySelector("#stoneAmount");
const stoneProduction = document.querySelector("#stoneProduction");
const ironType = document.querySelector("#ironType");
const ironAmount = document.querySelector("#ironAmount");
const ironProduction = document.querySelector("#ironProduction");
const glassType = document.querySelector("#glassType");
const glassAmount = document.querySelector("#glassAmount");
const glassProduction = document.querySelector("#glassProduction");
const materialType = document.querySelector("#materialType");
const materialAmount = document.querySelector("#materialAmount");
const materialProduction = document.querySelector("#materialProduction");

let roomName = null;
let socket = null;
let currentMemberId = 1;
let memberSize = 0;
let game = null;
let oldWoodProduction = 0;
let oldStoneProduction = 0;
let oldIronProduction = 0;
let oldGlassProduction = 0;
let oldMaterialProduction = 0;

function connect(event) {
    roomName = document.querySelector('#roomName').value.trim();

    if(roomName) {
        roomPage.classList.add('hidden');
        memberPage.classList.remove('hidden');

        socket = io('http://localhost:8081/?room=' + roomName, {
            transports: ['polling', 'websocket']
        });

        socket.on('connect', function () {
            console.log("Connected to WS.")
        });
        socket.on('gameUpdate', (data) => {
            console.log(data);
            onGameUpdate(data);
        });
        socket.on('gameOver', () => {
            finishGame();
        });
        socket.on('disconnect', function () {
            console.log("Disconnected with WS.")
        });
        socket.on('reconnect_attempt', (attempts) => {
            console.log('Try to reconnect at ' + attempts + ' attempt(s).');
        });
    }
    event.preventDefault();
}

function addMember(event) {
    let memberName = document.querySelector('#memberName').value.trim();
    console.log("Add member with name: " + memberName);
    const memberBox = `
        <div class="${memberName}-list">
          <h5>${memberName}</h5>
        </div>
    `;
    console.log(memberList)
    memberList.innerHTML += memberBox;

    socket.emit("addMember", memberName);
    memberSize += 1;
}

function startGame(event) {
    memberPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    event.preventDefault();
}

function finishGame(event) {
    socket.disconnect();
}

function nextMember(event) {
    if (currentMemberId < memberSize) {
        currentMemberId += 1;
    } else {
        currentMemberId = 1;
        socket.emit("nextRound");
    }
    reloadGame();
}

function reloadGame() {
    const memberIndex = currentMemberId - 1;
    currentMemberName.innerHTML = game.members[memberIndex].name;

    woodType.innerHTML = game.members[memberIndex].resources[0].type;
    woodAmount.value = game.members[memberIndex].resources[0].amount;
    woodProduction.value = game.members[memberIndex].resources[0].productionValue;
    stoneType.innerHTML = game.members[memberIndex].resources[1].type;
    stoneAmount.value = game.members[memberIndex].resources[1].amount;
    stoneProduction.value = game.members[memberIndex].resources[1].productionValue;
    ironType.innerHTML = game.members[memberIndex].resources[2].type;
    ironAmount.value = game.members[memberIndex].resources[2].amount;
    ironProduction.value = game.members[memberIndex].resources[2].productionValue;
    glassType.innerHTML = game.members[memberIndex].resources[3].type;
    glassAmount.value = game.members[memberIndex].resources[3].amount;
    glassProduction.value = game.members[memberIndex].resources[3].productionValue;
    materialType.innerHTML = game.members[memberIndex].resources[4].type;
    materialAmount.value = game.members[memberIndex].resources[4].amount;
    materialProduction.value = game.members[memberIndex].resources[4].productionValue;

    oldWoodProduction = woodProduction.value;
    oldStoneProduction = stoneProduction.value;
    oldIronProduction = ironProduction.value;
    oldGlassProduction = glassProduction.value;
    oldMaterialProduction = materialProduction.value;
}

function increaseWoodProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldWoodProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldWoodProduction, "WOOD");
        socket.emit("increaseProduction", increaseProduction);
        oldWoodProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseStoneProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldWoodProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldWoodProduction, "STONE");
        socket.emit("increaseProduction", increaseProduction);
        oldWoodProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseIronProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldWoodProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldWoodProduction, "IRON");
        socket.emit("increaseProduction", increaseProduction);
        oldWoodProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseGlassProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldWoodProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldWoodProduction, "GLASS");
        socket.emit("increaseProduction", increaseProduction);
        oldWoodProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseMaterialProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldWoodProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldWoodProduction, "MATERIAL");
        socket.emit("increaseProduction", increaseProduction);
        oldWoodProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function onConnected() {
    console.log("Connected to server: " + socket.id);
}


function onDisconnect() {
    console.log("Disconnect from server.")
}

function onGameUpdate(data) {
    game = new Game(data.members, data.round, data.stage);
    let roundAndStage = document.querySelector("#roundAndStage");
    roundAndStage.innerHTML = "Round: " + game.round + " Stage: " + game.stage;
    reloadGame();

    console.log("Game updated.")
}

roomForm.addEventListener('submit', connect, true);
addMemberButton.addEventListener('click', addMember, true);
memberForm.addEventListener('submit', startGame, true);
gameForm.addEventListener('submit', finishGame, true);
nextMemberButton.addEventListener('click', nextMember, true);
woodProduction.addEventListener('change', increaseWoodProduction, true);
stoneProduction.addEventListener('change', increaseStoneProduction, true);
ironProduction.addEventListener('change', increaseIronProduction, true);
glassProduction.addEventListener('change', increaseGlassProduction, true);
materialProduction.addEventListener('change', increaseMaterialProduction, true);