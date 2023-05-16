import { Game } from "./model/game.js";
import { ResourceComponent } from "./components/resourceComponent/resource-component.js"

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

let roomName = null;
let socket = null;
let currentMember = null;

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
}

function startGame(event) {
    memberPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    event.preventDefault();
}

function finishGame(event) {
    socket.disconnect();
}

function onConnected() {
    console.log("Connected to server: " + socket.id);
}


function onDisconnect() {
    console.log("Disconnect from server.")
}

function onGameUpdate(data) {
    let game = new Game(data.members, data.round, data.stage);
    let roundAndStage = document.querySelector("#roundAndStage");
    roundAndStage.innerHTML = "Round: " + game.round + " Stage: " + game.stage;

    const resourceType = document.querySelector("#resourceType");
    const resourceAmount = document.querySelector("#resourceAmount");
    const resourceProduction = document.querySelector("#resourceProduction");

    resourceType.innerHTML = game.members[0].resources[0].type;
    resourceAmount.value = game.members[0].resources[0].amount;
    resourceProduction.value = game.members[0].resources[0].productionValue;

    let type1 = game.members[0].resources[1].type;
    let amount1 = game.members[0].resources[1].amount;
    let prod1 = game.members[0].resources[1].productionValue;

    const resourceComponent = `
        <resource-component resourceType="${type1}" resourceAmount="${amount1}" resourceProduction="${prod1}">
        </resource-component>
    `;
    resourceForm.innerHTML += resourceComponent;
    //TODO: resource component is loaded but its not displayed

    console.log("Game updated.")
}

customElements.define("resource-component", ResourceComponent);
roomForm.addEventListener('submit', connect, true);
addMemberButton.addEventListener('click', addMember, true);
memberForm.addEventListener('submit', startGame, true);
gameForm.addEventListener('submit', finishGame, true);