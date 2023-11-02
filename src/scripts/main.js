export const customScript = function (App) {
  App.log("ENGrid client scripts are executing");
  // Add your client scripts here

  // If we're on the last page OR we're redirected from another EN Page
  if (
    App.getPageNumber() === App.getPageCount() ||
    document.referrer.includes("act.ran.org")
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

  // Make Sure we don't have selected hidden payment method when changing frequency or currency
  const isVisibile = (el) =>
    !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const frequencyRadio = document.querySelectorAll(
    "[name='transaction.recurrfreq']"
  );
  const currencySelect = document.querySelector(
    "[name='transaction.paycurrency']"
  );
  const paymentMethodRadioWrapper = document.querySelectorAll(
    ".give-by-select .en__field__item"
  );
  if (frequencyRadio && currencySelect && paymentMethodRadioWrapper) {
    [...frequencyRadio, currencySelect].forEach((el) => {
      el.addEventListener("change", () => {
        App.log("CHANGING");
        window.setTimeout(() => {
          // Get selected payment method
          const selectedPaymentMethod = document.querySelector(
            "[name='transaction.giveBySelect']:checked"
          );
          if (selectedPaymentMethod) {
            const selectedPaymentContainer =
              selectedPaymentMethod.closest(".en__field__item");
            // Check if selected payment method is hidden
            if (!isVisibile(selectedPaymentContainer)) {
              // If hidden, click on the first visible payment method
              [...paymentMethodRadioWrapper].every((element) => {
                if (isVisibile(element)) {
                  App.log(
                    `Clicking on ${element.querySelector("label").innerText}`
                  );
                  element.querySelector("label").click();
                  return false;
                }
              });
            }
          }
        }, 500);
      });
    });
  }
  const attriubtion = document.querySelector(
    ".media-with-attribution figattribution"
  );
  if (attriubtion) {
    const tippyInstance = attriubtion._tippy;
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
};
