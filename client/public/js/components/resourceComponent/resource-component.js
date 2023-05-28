import htmlTemplate from "./resource-component.html";
import stylesheet from "!!css-loader!./resource-component.css";

export class ResourceComponent extends HTMLElement {

    oldProductionValue = 0;

    constructor() {
        super();
		this.attachShadow({mode: "open"});

		const element = document.createElement("template");
		element.innerHTML = htmlTemplate;

        const styleElement = document.createElement("style");
		styleElement.innerHTML = stylesheet.toString();

        console.log(this.attributes)
        let resourceType = this.attributes.resourceType.value
        let resourceAmount = this.attributes.resourceAmount.value
        let resourceProduction = this.attributes.resourceProduction.value

		this.shadowRoot.append(styleElement);
		this.shadowRoot.append(element.content.cloneNode(true));

        const resourceTypeField = this.shadowRoot.querySelector('#resourceType');
        const resourceAmountField = this.shadowRoot.querySelector('#resourceAmount');
        const resourceProductionField = this.shadowRoot.querySelector('#resourceProduction');
        resourceTypeField.innerHTML = resourceType;
        resourceAmountField.value = resourceAmount;
        resourceProductionField.value = resourceProduction;

        // resourceProductionField.addEventListener('change', increaseProductionValue, true);
    }

    // increaseProductionValue(event, game) {
    //     const targetValue = event.target.value;
    //     if (targetValue > oldProductionValue) {
    //         let increaseProduction = new IncreaseProduction(game.members[currentMemberId-1].name, targetValue - oldProductionValue, this.resourceType);
    //         socket.emit("increaseProduction", increaseProduction);
    //         oldProductionValue = targetValue;
    //     } else {
    //         console.log("Value need to be incremented.");
    //     }
    // }
}