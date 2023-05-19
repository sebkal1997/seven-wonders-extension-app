import { Game } from "./model/game.js";
import { TransferResources } from "./model/transfer-resources.js";
import { IncreaseProduction } from "./model/increase-production.js";
import css from "../css/main.css"
import { Resource } from "./model/resource.js";
import 'bootstrap';

'use strict';

const roomPage = document.querySelector('#room-page');
const roomForm = document.querySelector('#roomForm');
const memberPage = document.querySelector('#member-page');
const memberForm = document.querySelector('#memberForm');
const memberList = document.querySelector('#memberList');
const addMemberButton = document.querySelector('#addMemberButton');
const gamePage = document.querySelector('#game-page');
const gameForm = document.querySelector('#gameForm');
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
const transferResourcesDialog = document.querySelector("#transferResourcesDialog");
const transferResourcesDialogContent = document.querySelector("#transferResourcesDialogContent");
const transferWoodButton = document.querySelector("#transferWoodButton");
const transferStoneButton = document.querySelector("#transferStoneButton");
const transferIronButton = document.querySelector("#transferIronButton");
const transferGlassButton = document.querySelector("#transferGlassButton");
const transferMaterialButton = document.querySelector("#transferMaterialButton");
const title = document.querySelector("#title");
const fromMember = document.querySelector("#fromMember");
const toMember = document.querySelector("#toMember");
const amount = document.querySelector("#amount");

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
let resourceTypeToTransfer = null;

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

    for (let resource of game.members[memberIndex].resources) {
        switch (resource.type) {
          case 'WOOD':
            woodType.innerHTML = resource.type;
            woodAmount.value = resource.amount;
            woodProduction.value = resource.productionValue;
            break;
          case 'STONE':
            stoneType.innerHTML = resource.type;
            stoneAmount.value = resource.amount;
            stoneProduction.value = resource.productionValue;
            break;
          case 'IRON':
            ironType.innerHTML = resource.type;
            ironAmount.value = resource.amount;
            ironProduction.value = resource.productionValue;
            break;
          case 'GLASS':
            glassType.innerHTML = resource.type;
            glassAmount.value = resource.amount;
            glassProduction.value = resource.productionValue;
            break;
          case 'MATERIAL':
            materialType.innerHTML = resource.type;
            materialAmount.value = resource.amount;
            materialProduction.value = resource.productionValue;
            break;
          default:
            console.log("Resource " + resource.type + " is not handled yet.");
        }
    }
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
    if (targetValue > oldStoneProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldStoneProduction, "STONE");
        socket.emit("increaseProduction", increaseProduction);
        oldStoneProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseIronProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldIronProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldIronProduction, "IRON");
        socket.emit("increaseProduction", increaseProduction);
        oldIronProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseGlassProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldGlassProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldGlassProduction, "GLASS");
        socket.emit("increaseProduction", increaseProduction);
        oldGlassProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function increaseMaterialProduction(event) {
    const targetValue = event.target.value;
    if (targetValue > oldMaterialProduction) {
        let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldMaterialProduction, "MATERIAL");
        socket.emit("increaseProduction", increaseProduction);
        oldMaterialProduction = targetValue;
    } else {
        console.log("Value need to be incremented.");
    }
}

function createDialog(resourceType) {
    let fromName = game.members[currentMemberId - 1].name;
    resourceTypeToTransfer = resourceType;
    title.innerHTML = "Transfer " + resourceType;
    fromMember.value = fromName;
    game.members.map( (member) => {
        if (member.name != fromName) {
            let opt = document.createElement("option");
            opt.value = member.name;
            opt.innerHTML = member.name;
            toMember.append(opt);
        }
    });
}

function transfer(event) {
    const fromName = game.members[currentMemberId - 1].name;
    const toName = toMember.value;
    const resourceToTransfer = new Resource(resourceTypeToTransfer, amount.value, null)
    let transferResource = new TransferResources(fromName, toName, new Array(resourceToTransfer))
    socket.emit("transferResources", transferResource);
    event.preventDefault;
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
transferWoodButton.addEventListener('click', () => {
    createDialog("WOOD");
    transferResourcesDialog.showModal()
}, true);
transferStoneButton.addEventListener('click', () => {
    createDialog("STONE");
    transferResourcesDialog.showModal()
}, true);
transferIronButton.addEventListener('click', () => {
    createDialog("IRON");
    transferResourcesDialog.showModal()
}, true);
transferGlassButton.addEventListener('click', () => {
    createDialog("GLASS");
    transferResourcesDialog.showModal()
}, true);
transferMaterialButton.addEventListener('click', () => {
    createDialog("MATERIAL");
    transferResourcesDialog.showModal()
}, true);
dialogForm.addEventListener('submit', transfer, true);