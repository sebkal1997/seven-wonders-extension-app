import htmlTemplate from "./resource-component.html";
import stylesheet from "!!css-loader!./resource-component.css";

export class ResourceComponent extends HTMLElement {

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
        const increaseResourceButton = this.shadowRoot.querySelector('#increaseResourceButton');
        const transferResourceButton = this.shadowRoot.querySelector('#transferResourceButton');

        resourceTypeField.innerHTML = resourceType;
        resourceAmountField.value = resourceAmount;
        resourceProductionField.value = resourceProduction;

        increaseResourceButton.addEventListener('click', this.increaseProduction, true);
        transferResourceButton.addEventListener('click', this.transferResources, true);
    }

    increaseProduction(event) {
        const increaseResourceEvent = new CustomEvent("increaseResource", event);
        this.dispatchEvent(increaseResourceEvent);
    }

    transferResources(event) {
        const transferResourcesEvent = new CustomEvent("transferResources", event);
        this.dispatchEvent(transferResourcesEvent);
    }

    reload() {
        let resourceType = this.attributes.resourceType.value
        let resourceAmount = this.attributes.resourceAmount.value
        let resourceProduction = this.attributes.resourceProduction.value

        const resourceTypeField = this.shadowRoot.querySelector('#resourceType');
        const resourceAmountField = this.shadowRoot.querySelector('#resourceAmount');
        const resourceProductionField = this.shadowRoot.querySelector('#resourceProduction');

        resourceTypeField.innerHTML = resourceType;
        resourceAmountField.value = resourceAmount;
        resourceProductionField.value = resourceProduction;
    }
}