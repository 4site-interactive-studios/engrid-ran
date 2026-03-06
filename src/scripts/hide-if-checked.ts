// This script adds css to hide fields based on the value of a checkbox field. It can be used to hide fields when a supporter opts in or out of something, dynamically.
import {
  EngridLogger,
} from "@4site/engrid-scripts";

export class HideIfChecked {
  private logger: EngridLogger = new EngridLogger(
    "HideIfChecked",
    "lightgray",
    "dodgerblue",
    "🙈"
  );

  constructor() {
    const fields = this.getCheckboxFields();
    this.addStyles(fields);
  }

  getCheckboxFields(): string[] {
    const fieldNames: string[] = [];
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      const fieldName = checkbox.getAttribute("name");
      if (fieldName) {
        this.logger.log(`Found checkbox field: ${fieldName}`);
        fieldNames.push(fieldName);
      }
    });
    return fieldNames;
  }
  addStyles(fields: string[]) {
    const style = document.createElement("style");
    let css = "";
    fields.forEach((field) => {
      css += `
        #engrid:not(:has(input[name="${field}"]:checked)) .hideif-${field.replace(/\./g,'')}-unchecked{ display: none !important; }
        #engrid:has(input[name="${field}"]:checked) .hideif-${field.replace(/\./g,'')}-checked{ display: none !important; }
      `;
    });
    style.innerHTML = css;
    document.head.appendChild(style);
  }
}