// import htmlTemplate from "./resource-component.html";
// import stylesheet from "!!css-loader!./resource-component.css";

const resourceTypeField = document.querySelector('#resourceType');
const resourceAmountField = document.querySelector('#resourceAmount');
const resourceProductionField = document.querySelector('#resourceProduction');

export class ResourceComponent extends HTMLElement {
    constructor() {
        super();

		this.attachShadow({mode: "open"});

        let resourceType = this.attributes.resourceType.value
        let resourceAmount = this.attributes.resourceType.value
        let resourceProduction = this.attributes.resourceType.value

        // const element = document.createElement("template");
        // element.innerHTML = htmlTemplate;

        // const styleElement = document.createElement("style");
        // styleElement.innerHTML = stylesheet.toString();

		// this.shadowRoot.append(styleElement);
		// this.shadowRoot.append(element.content.cloneNode(true));

        resourceTypeField.innerHTML = resourceType;
        resourceAmountField.value = resourceAmount;
        resourceProductionField.value = resourceProduction;
    }
}