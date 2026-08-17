import tippy from "tippy.js";
import { RememberMeEvents } from "@4site/engrid-scripts";

export const customScript = function (App, EnForm) {
  App.log("ENGrid client scripts are executing");
  // Add your client scripts here

  // If we're on the last page OR we're redirected from another EN Page
  if (
    App.getPageType() !== "UNKNOWN" &&
    (App.getPageNumber() === App.getPageCount() ||
      document.referrer.includes("act.ran.org"))
  ) {
    // Load the Cohort iFrame to the end of the #endgrid element
    const cohortIframe = document.createElement("iframe");
    cohortIframe.src = "https://act.ran.org/page/51899/data/1?chain";
    cohortIframe.style.width = "0";
    cohortIframe.style.height = "0";
    cohortIframe.style.visibility = "hidden";
    cohortIframe.style.display = "none";
    cohortIframe.width = "0";
    cohortIframe.height = "0";
    cohortIframe.name = "cohortIframe";
    cohortIframe.visibility = "hidden";
    const engrid = document.querySelector("#endgrid, form");
    if (engrid) engrid.appendChild(cohortIframe);
  }

  // Add placeholder to the "other" giving amount field
  let enFieldOtherAmt = document.querySelectorAll(
    ".radio-to-buttons_donationAmt .en__field--radio.en__field--donationAmt .en__field__input--other"
  )[0];
  if (enFieldOtherAmt) {
    enFieldOtherAmt.placeholder = "Custom Amount";
  }

  // Add placeholder to the Mobile Phone Field
  let enFieldMobilePhone = document.querySelectorAll(
    "input#en__field_supporter_phoneNumber"
  )[0];
  if (enFieldMobilePhone) {
    enFieldMobilePhone.placeholder = "000-000-0000 (optional)";
  }

  const attriubtion = document.querySelectorAll(
    ".media-with-attribution figattribution"
  );
  for (const attr of attriubtion) {
    const tippyInstance = attr._tippy;
    if (tippyInstance) {
      tippyInstance.setProps({
        allowHTML: true,
        theme: "RAN",
        placement: "right-end",
      });
    }
  }

  document.body.removeAttribute("data-engrid-errors");

  const ACHOption = document.querySelector(
    '[name="transaction.paymenttype"] [value="ACH"]'
  );

  if (ACHOption) {
    ACHOption.value = "ach";
  }

  // Add these classes to the submit div to hide it when the digital wallet is selected
  const submitDiv = document.querySelector(".en__submit");
  if (submitDiv) {
    submitDiv.classList.add(
      "hideif-stripedigitalwallet-selected",
      "hideif-paypaltouch-selected"
    );
  }

  const substackIframe = document.querySelector('iframe[name="substack"]');

  if (substackIframe) {
    substackIframe.removeAttribute("sandbox");
    substackIframe.src = substackIframe.src;
  }

  const addRecipientButton = document.querySelector(
    "button.en__ecarditems__button.en__ecarditems__addrecipient"
  );

  if (addRecipientButton) {
    addRecipientButton.innerHTML = "Add Recipient";
  }

  const formInstance = EnForm.getInstance();
  formInstance.onValidate.subscribe(() => {
    if (!formInstance.validate) return;

    if (
      App.getPageType() === "DONATION" &&
      ["paypaltouch", "paypal"].includes(App.getPaymentType()) &&
      App.getCurrencyCode() !== "USD"
    ) {
      App.addHtml(
        '<div class="en__field__error en__field__error--paypal">PayPal is only available for payments in USD. Please select another payment method or USD.</div>',
        ".dynamic-giving-button"
      );
      formInstance.validate = false;
      return false;
    }
  });

  // Transaction fee tooltip
  function addTransactionFeeTooltip() {
    const transactionFeeEl = document.querySelector(
      ".transaction-fee-opt-in .en__field__element--checkbox"
    );

    if (!transactionFeeEl) return;

    const transactionFeeTooltip = document.createElement("div");
    transactionFeeTooltip.classList.add("transaction-fee-tooltip");
    transactionFeeTooltip.innerHTML = "i";
    transactionFeeEl.appendChild(transactionFeeTooltip);

    tippy(transactionFeeTooltip, {
      content:
        "By checking this box, you agree to cover the transaction fee for your donation. This small additional amount helps us ensure that 100% of you donation goes directly to RAN.",
      allowHTML: true,
      theme: "white",
      placement: "top",
      trigger: "mouseenter click",
      interactive: true,
      arrow: "<div class='custom-tooltip-arrow'></div>",
      offset: [0, 20],
    });
  }

  addTransactionFeeTooltip();

  // *****************************************
  // START: COP 30 signature format handling
  // *****************************************
  function cop30SignatureHandling() {
    const signatureFormatField = document.getElementsByName(
      "supporter.questions.1112452"
    );
    const signatureField = App.getField("supporter.NOT_TAGGED_62");
    // Exit early if we don't have the required fields
    if (!signatureFormatField || !signatureField) return;

    // Setting the initial signature value for pre-filled data
    setSignature();

    const firstNameField = App.getField("supporter.firstName");
    const lastNameField = App.getField("supporter.lastName");
    const cityField = App.getField("supporter.city");
    const countryField = App.getField("supporter.country");

    [firstNameField, lastNameField, cityField, countryField].forEach(
      (field) => {
        field.addEventListener("input", setSignature.bind(this));
      }
    );

    [...signatureFormatField].forEach((field) => {
      field.addEventListener("change", setSignature.bind(this));
    });
  }

  function setSignature() {
    const firstName = App.getFieldValue("supporter.firstName");
    const lastName = App.getFieldValue("supporter.lastName");
    const city = App.getFieldValue("supporter.city");
    const country = App.getFieldValue("supporter.country");
    const firstNameInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastNameInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    const signatureFormat = App.getFieldValue("supporter.questions.1112452");
    const formattedSignature = signatureFormat
      .replace("{First Name}", firstName)
      .replace("{Last Name}", lastName)
      .replace("{First Initial}", firstNameInitial)
      .replace("{Last Initial}", lastNameInitial)
      .replace("{City}", city)
      .replace("{Country}", country);
    App.setFieldValue("supporter.NOT_TAGGED_62", formattedSignature);
  }

  if (App.getOption("RememberMe")) {
    const rememberMeEvents = RememberMeEvents.getInstance();
    rememberMeEvents.onLoad.subscribe(() => {
      cop30SignatureHandling();
    });

    rememberMeEvents.onClear.subscribe(() => {
      App.setFieldValue("supporter.NOT_TAGGED_62", "");
    });
  } else {
    cop30SignatureHandling();
  }
  // *****************************************
  // END: COP 30 signature format handling
  // *****************************************

  // Add data-engrid-client-js-loading=finsihed to body
  App.setBodyData("client-js-loading", "finished");
};
