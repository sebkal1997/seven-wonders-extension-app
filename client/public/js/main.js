import { Game } from "./model/game.js";
import { TransferResources } from "./model/transfer-resources.js";
import { IncreaseProduction } from "./model/increase-production.js";
import css from "../css/main.css"
import { Resource } from "./model/resource.js";
import { ResourceComponent } from "./components/resourceComponent/resource-component.js";

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
const transferResourcesDialog = document.querySelector("#transferResourcesDialog");
const title = document.querySelector("#title");
const fromMember = document.querySelector("#fromMember");
const toMember = document.querySelector("#toMember");
const amount = document.querySelector("#amount");
const resourceForm = document.querySelector(".form-resource");

let woodResourceComponent = null;
let stoneResourceComponent = null;
let ironResourceComponent = null;
let glassResourceComponent = null;
let materialResourceComponent = null;

let roomName = null;
let socket = null;
let currentMemberId = 1;
let memberSize = 0;
let game = null;
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
            game = null;
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

    const woodComponent = `
    <resource-component id="woodResourceComponent" resourceType="WOOD" resourceAmount="0" resourceProduction="0">
    </resource-component>
    `;
    const stoneComponent = `
    <resource-component id="stoneResourceComponent" resourceType="STONE" resourceAmount="0" resourceProduction="0">
    </resource-component>
    `;
    const ironComponent = `
    <resource-component id="ironResourceComponent" resourceType="IRON" resourceAmount="0" resourceProduction="0">
    </resource-component>
    `;
    const glassComponent = `
    <resource-component id="glassResourceComponent" resourceType="GLASS" resourceAmount="0" resourceProduction="0">
    </resource-component>
    `;
    const materialComponent = `
    <resource-component id="materialResourceComponent" resourceType="MATERIAL" resourceAmount="0" resourceProduction="0">
    </resource-component>
    `;
    resourceForm.innerHTML += woodComponent;
    resourceForm.innerHTML += stoneComponent;
    resourceForm.innerHTML += ironComponent;
    resourceForm.innerHTML += glassComponent;
    resourceForm.innerHTML += materialComponent;

    woodResourceComponent = document.querySelector("#woodResourceComponent");
    stoneResourceComponent = document.querySelector("#stoneResourceComponent");
    ironResourceComponent = document.querySelector("#ironResourceComponent");
    glassResourceComponent = document.querySelector("#glassResourceComponent");
    materialResourceComponent = document.querySelector("#materialResourceComponent");

    woodResourceComponent.addEventListener('increaseResource', () => {
        increaseResourceProduction("WOOD") 
    }, true);
    woodResourceComponent.addEventListener('transferResources', () => {
        createDialog("WOOD");
        transferResourcesDialog.showModal()
    }, true);
    stoneResourceComponent.addEventListener('increaseResource',  () => {
        increaseResourceProduction("STONE")
    }, true);
    stoneResourceComponent.addEventListener('transferResources', () => {
        createDialog("STONE");
        transferResourcesDialog.showModal()
    }, true);
    ironResourceComponent.addEventListener('increaseResource',  () => {
        increaseResourceProduction("IRON")
    }, true);
    ironResourceComponent.addEventListener('transferResources', () => {
        createDialog("IRON");
        transferResourcesDialog.showModal()
    }, true);
    glassResourceComponent.addEventListener('increaseResource',  () => {
        increaseResourceProduction("GLASS")
    }, true);
    glassResourceComponent.addEventListener('transferResources', () => {
        createDialog("GLASS");
        transferResourcesDialog.showModal()
    }, true);
    materialResourceComponent.addEventListener('increaseResource',  () => {
        increaseResourceProduction("MATERIAL")
    }, true);
    materialResourceComponent.addEventListener('transferResources', () => {
        createDialog("MATERIAL");
        transferResourcesDialog.showModal()
    }, true);

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
            woodResourceComponent.attributes.resourceType.value = resource.type;
            woodResourceComponent.attributes.resourceAmount.value = resource.amount;
            woodResourceComponent.attributes.resourceProduction.value = resource.productionValue;
            break;
          case 'STONE':
            stoneResourceComponent.attributes.resourceType.value = resource.type;
            stoneResourceComponent.attributes.resourceAmount.value = resource.amount;
            stoneResourceComponent.attributes.resourceProduction.value = resource.productionValue;
            break;
          case 'IRON':
            ironResourceComponent.attributes.resourceType.value = resource.type;
            ironResourceComponent.attributes.resourceAmount.value = resource.amount;
            ironResourceComponent.attributes.resourceProduction.value = resource.productionValue;
            break;
          case 'GLASS':
            glassResourceComponent.attributes.resourceType.value = resource.type;
            glassResourceComponent.attributes.resourceAmount.value = resource.amount;
            glassResourceComponent.attributes.resourceProduction.value = resource.productionValue;
            break;
          case 'MATERIAL':
            materialResourceComponent.attributes.resourceType.value = resource.type;
            materialResourceComponent.attributes.resourceAmount.value = resource.amount;
            materialResourceComponent.attributes.resourceProduction.value = resource.productionValue;
            break;
          default:
            console.log("Resource " + resource.type + " is not handled yet.");
        }
    }
}

function increaseResourceProduction(resourceType) {
    let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, resourceType);
    socket.emit("increaseProduction", increaseProduction);

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
    if (!gamePage.classList.contains('hidden')) {
        reloadGame();
    }

    console.log("Game updated.")
}

customElements.define("resource-component", ResourceComponent);
roomForm.addEventListener('submit', connect, true);
addMemberButton.addEventListener('click', addMember, true);
memberForm.addEventListener('submit', startGame, true);
gameForm.addEventListener('submit', finishGame, true);
nextMemberButton.addEventListener('click', nextMember, true);
dialogForm.addEventListener('submit', transfer, true);