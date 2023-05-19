//import { htmlTemplate } from "./resource-component.html";
// import stylesheet from "!!css-loader!./resource-component.css";

const resourceTypeField = document.querySelector('#resourceType');
const resourceAmountField = document.querySelector('#resourceAmount');
const resourceProductionField = document.querySelector('#resourceProduction');

export class ResourceComponent extends HTMLElement {
    constructor() {
        super();

        let resourceType = this.attributes.resourceType.value
        let resourceAmount = this.attributes.resourceType.value
        let resourceProduction = this.attributes.resourceType.value

        resourceTypeField.innerHTML = resourceType;
        resourceAmountField.value = resourceAmount;
        resourceProductionField.value = resourceProduction;

        const template =  document.getElementById("resourceComponentTemple");
        console.log(template);
        const templateContent = template.content;

		// this.shadowRoot.append(styleElement);
		// this.shadowRoot.append(element.content.cloneNode(true));

        // let template = document.querySelector("#resourceComponentTemple");
        // console.log(template);
        // let templateContent = template.content;

		const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(templateContent.cloneNode(true));
    }
}