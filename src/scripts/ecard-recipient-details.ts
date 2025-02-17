import { EngridLogger, ENGrid, EnForm } from "@4site/engrid-scripts";

export class EcardRecipientDetails {
  private logger: EngridLogger = new EngridLogger(
    "EcardRecipientDetails",
    "lightgray",
    "darkblue",
    "🪙"
  );
  private _form: EnForm = EnForm.getInstance();

  constructor() {
    if (!this.shouldRun()) return;
    this.logger.log("Running EcardRecipientDetails");
    // We run this onValidate instead of onSubmit because EN does not run onSubmit for all gateways
    this._form.onValidate.subscribe(
      this.addEcardRecipientDetailsToExtRefField.bind(this)
    );
  }

  shouldRun(): boolean {
    // We are on a donation page with an embedded ecard
    return (
      ENGrid.getPageType() === "DONATION" &&
      !!document.querySelector(".engrid--embedded-ecard")
    );
  }

  addEcardRecipientDetailsToExtRefField() {
    if (!this._form.validate) return;

    const sendEcard =
      sessionStorage.getItem("engrid-send-embedded-ecard") === "true";
    const ecardDetails = JSON.parse(
      sessionStorage.getItem("engrid-embedded-ecard") || "{}"
    );
    // If we're not sending an ecard or we don't have ecard details, exit
    if (!sendEcard || Object.keys(ecardDetails).length === 0) return;

    // If we don't have recipient details, exit
    const { name, email } = ecardDetails.formData.recipients[0];
    if (!name || !email) return;

    let extRefField = document.querySelector(
      "[name='en_txn8']"
    ) as HTMLInputElement;

    // Add the recipient details to the ext ref field
    // The field must be added to the page via a code block for this to work.
    // It does not work if we create the field using JavaScript after page load.
    if (extRefField) {
      extRefField.value = `${email} ; ${name}`;
      this.logger.log(
        `Added ecard recipient details "${email} ; ${name}" to ext ref field`
      );
    }
  }
}
