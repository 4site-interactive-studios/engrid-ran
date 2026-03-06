// This script adds functionality to "snooze" emails for a supporter by setting a date field to a future date and changing an opt-in field to opted-out.
import {
  EngridLogger,
  ENGrid,
  EnForm,
  ShowHideRadioCheckboxes
} from "@4site/engrid-scripts";

interface SnoozeEmailsOptions {
  date_field?: string; // The supporter field to check for snooze duration
  opt_in_field?: string; // The supporter field to change to opted-out when snoozing is active
  duration?: number; // The duration (in days) to snooze emails when the field is set
  snooze_button_selector?: string; // Optional selector for a custom snooze button, defaults to ".snooze-emails-button"
}

const defaultOptions: SnoozeEmailsOptions = {
  date_field: '',
  opt_in_field: '',
  duration: 60,
  snooze_button_selector: ".snooze-emails-button",
};

export class SnoozeEmails {
  private logger: EngridLogger = new EngridLogger(
    "SnoozeEmails",
    "lightgray",
    "dodgerblue",
    "🌙"
  );

  private options: SnoozeEmailsOptions;
  private _form: EnForm = EnForm.getInstance();

  constructor(options: SnoozeEmailsOptions) {
    this.options = { ...defaultOptions, ...options };
    console.log("SnoozeEmails options:", this.options);
    if (!this.shouldRun()) return;
    this.addListeners();
  }
  shouldRun(): boolean {
    // if(ENGrid.getPageType() !== "UNSUBSCRIBE") return false;
    if(!this._form) {
      this.logger.warn(`EN Form instance not found. Snooze Emails script will not run.`);
      return false;
    }
    const snoozeDateField = ENGrid.getField(this.options.date_field!);
    if(!snoozeDateField) {
      this.logger.warn(`Snooze date field "${this.options.date_field}" not found. Snooze Emails script will not run.`);
      return false;
    }
    const optInField = ENGrid.getField(this.options.opt_in_field!);
    if(!optInField) {
      this.logger.warn(`Opt-in field "${this.options.opt_in_field}" not found. Snooze Emails script will not run.`);
      return false;
    }
    const snoozeButton = document.querySelector(this.options.snooze_button_selector!);
    if(!snoozeButton) {
      this.logger.warn(`Snooze button with selector "${this.options.snooze_button_selector}" not found. Snooze Emails script will not run.`);
      return false;
    }
    this.logger.log("SnoozeEmails script is running.");
    return true;
  }
  addListeners() {
    const snoozeButton = document.querySelector(this.options.snooze_button_selector!);
    if (snoozeButton) {
      snoozeButton.addEventListener("click", () => this.activateSnooze(this.options.duration!));
    }
  }
  activateSnooze(duration: number) {
    const snoozeDateField = ENGrid.getField(this.options.date_field!) as HTMLInputElement;
    const optInField = ENGrid.getField(this.options.opt_in_field!) as HTMLInputElement;
    const today = new Date();
    const snoozeUntil = new Date(
      today.getTime() + (duration || this.options.duration!) * 24 * 60 * 60 * 1000
    );
    optInField.value = "N";
    snoozeDateField.value = snoozeUntil.toISOString().split("T")[0];
    this.logger.log(
      `Snoozed emails until ${snoozeUntil.toDateString()}`
    );
    this._form.submitForm();
  }
}
