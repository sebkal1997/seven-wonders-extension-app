'use strict';

var roomPage = document.querySelector('#room-page');
var roomForm = document.querySelector('#roomForm');
var memberPage = document.querySelector('#member-page');
var memberForm = document.querySelector('#memberForm');
var memberList = document.querySelector('#memberList');
var addMemberButton = document.querySelector('#addMemberButton');

var roomName = null;
var socket = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

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
    var memberName = document.querySelector('#memberName').value.trim();
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
}

function onConnected() {
    console.log("Connected to server: " + socket.id);
}


function onDisconnect() {
    console.log("Disconnect from server.")
}

function onGameUpdate() {
    console.log("Game updated.")
}

roomForm.addEventListener('submit', connect, true);
addMemberButton.addEventListener('click', addMember, true);
memberForm.addEventListener('submit', startGame, true);