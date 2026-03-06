import {
  ENGrid,
  EnForm,
  EngridLogger,
} from "@4site/engrid-scripts";
interface SnoozeOptions {
  date_field: string; // The supporter field to check for snooze duration
  opt_in_field?: string|string[]; // The supporter field(s) to change to opted-in when snoozing is active
  opt_out_field?: string|string[]; // The supporter field(s) to change to opted-out
  duration: number; // The duration (in days) to snooze emails when the field is set
  selector: string; // Optional selector for a custom snooze button, defaults to ".snooze-emails-button"
}
interface UnsubscribeCategory {
  selector: string; // Selector for the submit button or parent element of that button.
  opt_out_field?: string|string[]; // The supporter field(s) to change to opted-out when the option is selected
  opt_in_field?: string|string[]; // The supporter field(s) to change to opted-in when the option is selected
  clear_snooze?: boolean; // Whether to clear snooze fields when this option is selected, defaults to true
}
interface UnsubscribeOptions {
  snooze_emails?: SnoozeOptions;
  not_you?: boolean; // Whether to display a "Not you?" option that clears supporter session
  categories?: {
    [categoryName: string]: UnsubscribeCategory;
  };
}
export class Unsubscribe {
  private logger: EngridLogger = new EngridLogger(
    "Unsubscribe",
    "lightgray",
    "dodgerblue",
    "🚫"
  );

  private _form: EnForm = EnForm.getInstance();
  private options: UnsubscribeOptions;
  private invalidFields: Set<string> = new Set();
  constructor(options: UnsubscribeOptions) {
    this.options = options;
    if (!this.shouldRun()) return;
    if(ENGrid.getPageNumber() === 2) {
      this.postUnsubscribe();
      return;
    }
    if(this.options.not_you) {
      this.addNotYou();
    }
    this.addListeners();
  }
  shouldRun(): boolean {
    if(ENGrid.getPageType() !== "UNSUBSCRIBE" || !this._form) return false;
    this.logger.log("Unsubscribe script is running.");
    if(ENGrid.getPageNumber() !== 1) return true;
    if(this.options.snooze_emails) {
      this.logger.log("Snooze emails options:", this.options.snooze_emails);
      this.verifyFieldsExist(this.options.snooze_emails.opt_in_field);
      this.verifyFieldsExist(this.options.snooze_emails.opt_out_field);
    }
    if(this.options.categories) {
      Object.entries(this.options.categories).forEach(([category, config]) => {
        this.logger.log(`Category "${category}" options:`, config);
        this.verifyFieldsExist(config.opt_in_field);
        this.verifyFieldsExist(config.opt_out_field);
      });
    }
    return true;
  }
  verifyFieldsExist(fields: string|string[]|false|undefined) {
    if(!fields) return;
    const fieldArray = typeof fields === "string" ? [fields] : fields;
    const validFields = fieldArray.filter(field => {
      if(this.invalidFields.has(field)) return false;
      return !!ENGrid.getField(field);
    });
    const invalidFields = fieldArray.filter(field => !validFields.includes(field));
    invalidFields.forEach(field => {
      this.logger.warn(`Field "${field}" not found. It will be skipped when performing actions.`);
      this.invalidFields.add(field);
    });
  }
  getValidFields(fields: string|string[]|false|undefined): string[] {
    if(!fields) return [];
    const fieldArray = typeof fields === "string" ? [fields] : fields;
    return fieldArray.filter(field => !this.invalidFields.has(field));
  }
  addNotYou() {
    const emailFieldValue = ENGrid.getFieldValue("supporter.emailAddress");
    if(emailFieldValue) {
      const emailField = ENGrid.getField("supporter.emailAddress") as HTMLInputElement;
      emailField.setAttribute("readonly", "true");
      const notYouLink = document.createElement("a");
      notYouLink.href = window.location.href.split("?")[0] + "?redirect=cold";
      notYouLink.innerText = `Not ${emailFieldValue}?`;
      ENGrid.addHtml(notYouLink, ".en__field--emailAddress", "beforeend");
    }
  }
  addListeners() {
    if(this.options.snooze_emails) {
      const snoozeButton = document.querySelector(`${this.options.snooze_emails?.selector} button`) || document.querySelector(`${this.options.snooze_emails?.selector}`) as HTMLElement;
      if (snoozeButton) {
        snoozeButton.addEventListener("click", () => this.activateSnooze());
      } else {
        this.logger.warn(`Snooze button with selector "${this.options.snooze_emails?.selector}" not found. Snooze functionality will not be available.`);
      }
    }
    if(this.options.categories) {
      Object.entries(this.options.categories).forEach(([category, config]) => {
        const categoryElement = document.querySelector(config.selector) as HTMLElement;
        if (categoryElement) {
          categoryElement.addEventListener("click", () => this.setSubscriptions(config.opt_in_field, config.opt_out_field, category, config.clear_snooze));
        } else {
          this.logger.warn(`Category element with selector "${config.selector}" not found. Unsubscribe option for category "${category}" will not be available.`);
        }
      });
    }
  }
  setSubscriptions(optInFields: string|string[]|false|undefined, optOutFields: string|string[]|false|undefined, category: string, clear_snooze: boolean = true) {
    const validOptInFields = this.getValidFields(optInFields);
    const validOptOutFields = this.getValidFields(optOutFields);
    validOptInFields.forEach(field => ENGrid.setFieldValue(field,"Y"));
    validOptOutFields.forEach(field => ENGrid.setFieldValue(field,"N"));
    if(clear_snooze && this.options.snooze_emails) {
      const snoozeDateField = ENGrid.getField(this.options.snooze_emails.date_field) as HTMLInputElement;
      if(snoozeDateField) {
        snoozeDateField.value = "-";
        sessionStorage.removeItem("snooze_until");
        this.logger.log(`Cleared snooze date field "${this.options.snooze_emails.date_field}" because clear_snooze is true for category "${category}".`);
      } else {
        this.logger.warn(`Snooze date field "${this.options.snooze_emails.date_field}" not found. Unable to clear snooze date for category "${category}".`);
      }
    }
    this.logger.log(
      `Updated fields for (un)subscribe action.\nOpt-in: ${validOptInFields.join(", ")}\nOpt-out: ${validOptOutFields.join(", ")}`
    );
    sessionStorage.setItem("unsub_details", JSON.stringify({
      opt_in_fields: validOptInFields,
      opt_out_fields: validOptOutFields,
      category
    }));
    ENGrid.enParseDependencies();
    this._form.submitForm();
  }
  activateSnooze() {
    const duration = this.options.snooze_emails!.duration;
    const snoozeDateField = ENGrid.getField(this.options.snooze_emails!.date_field!) as HTMLInputElement;
    const snoozeUntil = new Date(
      new Date().getTime() + duration * 24 * 60 * 60 * 1000
    );
    snoozeDateField.value = snoozeUntil.toISOString().split("T")[0];
    this.logger.log(
      `Snoozed emails until ${snoozeUntil.toDateString()}`
    );
    sessionStorage.setItem("snooze_until", snoozeUntil.toISOString());
    this.setSubscriptions(this.options.snooze_emails!.opt_in_field, this.options.snooze_emails!.opt_out_field, "Snoozed Emails", false);
  }
  postUnsubscribe() {
    const unsubDetails = sessionStorage.getItem("unsub_details") ? JSON.parse(sessionStorage.getItem("unsub_details")!) : {};
    if (unsubDetails) {
      ENGrid.setBodyData("recent-unsubscribe", "true");
      const resubLink = document.querySelector(".resubscribe-block a.button") as HTMLAnchorElement;
      if (resubLink) {
        resubLink.href =
          resubLink.href + `?chain&autosubmit=Y&engrid_hide[engrid]=id`;
      }
      sessionStorage.removeItem("unsub_details");
    }
    const snoozeUntil = sessionStorage.getItem("snooze_until");
    if(snoozeUntil) {
      ENGrid.setBodyData("recent-snooze", "true");
      sessionStorage.removeItem("snooze_until");
    }
  }
}