export const customScript = function (App, EnForm) {
  App.log("ENGrid client scripts are executing");
  // Add your client scripts here
  const themeVersion = Number(document.body.dataset.engridTheme.slice(-1));

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
    enFieldOtherAmt.placeholder =
      themeVersion === 2 ? "Other" : "Custom Amount";
  }

  // Add placeholder to the Mobile Phone Field
  let enFieldMobilePhone = document.querySelectorAll(
    "input#en__field_supporter_phoneNumber"
  )[0];
  if (enFieldMobilePhone) {
    enFieldMobilePhone.placeholder = "000-000-0000 (optional)";
  }

  if (themeVersion === 2) {
    // Digital Wallets Moving Parts
    const digitalWalletWrapper = document.querySelector(
      ".merge-with-give-by-select #en__digitalWallet"
    );
    const digitalWalletFirstChild =
      document.querySelector("#en__digitalWallet");
    const giveBySelect = document.querySelector(".give-by-select");
    if (digitalWalletWrapper && giveBySelect) {
      giveBySelect.appendChild(digitalWalletWrapper);
      digitalWalletFirstChild.insertAdjacentHTML(
        "beforeend",
        "<div class='digital-divider'><span class='divider-left'></span><p class='divider-center'>or enter manually</p><span class='divider-right'></span></div>"
      );
    }

    let digitalWalletsExist;

    setTimeout(function () {
      digitalWalletsExist = document.querySelectorAll(
        ".en__digitalWallet__container > *"
      );
      if (digitalWalletsExist.length > 0) {
        giveBySelect.setAttribute("show-wallets", "");
      }
    }, 500);

    setTimeout(function () {
      digitalWalletsExist = document.querySelectorAll(
        ".en__digitalWallet__container > *"
      );
      if (digitalWalletsExist.length > 0) {
        giveBySelect.setAttribute("show-wallets", "");
      }
    }, 2500);
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

  if (themeVersion === 3) {
    const attribution = document.querySelector(
      ".media-with-attribution figattribution"
    );

    if (attribution) {
      const tippyInstance = attribution._tippy;
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
  }

  // Add these classes to the submit div to hide it when the digital wallet is selected
  const submitDiv = document.querySelector(".en__submit");
  if (submitDiv) {
    submitDiv.classList.add(
      "hideif-stripedigitalwallet-selected",
      "hideif-paypaltouch-selected"
    );
  }

  //Unsubscribe page customisations
  if (App.getPageType() === "UNSUBSCRIBE") {
    const formSubmitBtn = document.querySelector(".en__submit button");
    const importantEmailsField = App.getField("supporter.questions.341509");
    const regularEmailsField = App.getField("supporter.questions.102600");
    const emailFieldValue = App.getFieldValue("supporter.emailAddress");
    const unsubFromAll = document.querySelector(".unsub-from-all span");

    if (emailFieldValue) {
      //Add "Not you?" link to email field
      const emailField = App.getField("supporter.emailAddress");
      emailField.setAttribute("readonly", "true");
      const notYouLink = document.createElement("a");
      notYouLink.href = window.location.href.split("?")[0] + "?redirect=cold";
      notYouLink.innerText = `Not ${emailFieldValue}?`;
      App.addHtml(notYouLink, ".en__field--emailAddress", "beforeend");
    }

    const fewerEmailsButton = document.querySelector(
      ".fewer-emails-block button.primary"
    );
    if (fewerEmailsButton) {
      fewerEmailsButton.addEventListener("click", () => {
        importantEmailsField.checked = true;
        regularEmailsField.checked = false;
        App.enParseDependencies();
        formSubmitBtn.click();
      });
    }

    // When important emails is checked, uncheck regular emails
    if (importantEmailsField) {
      importantEmailsField.addEventListener("change", () => {
        if (importantEmailsField.checked) {
          regularEmailsField.checked = false;
        }
      });
    }

    // When regular emails is checked, uncheck important emails
    if (regularEmailsField) {
      regularEmailsField.addEventListener("change", () => {
        if (regularEmailsField.checked) {
          importantEmailsField.checked = false;
        }
      });
    }

    // If unsubscribing from all, uncheck both boxes
    if (unsubFromAll) {
      unsubFromAll.addEventListener("click", () => {
        importantEmailsField.checked = false;
        regularEmailsField.checked = false;
        App.enParseDependencies();
        formSubmitBtn.click();
      });
    }

    EnForm.getInstance().onSubmit.subscribe(() => {
      if (!regularEmailsField.checked) {
        sessionStorage.setItem(
          "unsub_details",
          JSON.stringify({
            email: App.getFieldValue("supporter.emailAddress"),
          })
        );
      }
    });

    if (App.getPageNumber() === 2) {
      const unsubDetails = JSON.parse(sessionStorage.getItem("unsub_details"));
      if (unsubDetails) {
        App.setBodyData("recent-unsubscribe", "true");
        const resubLink = document.querySelector(".resubscribe-block a.button");
        if (resubLink) {
          resubLink.href =
            resubLink.href +
            `?supporter.emailAddress=${unsubDetails.email}&autosubmit=Y`;
        }
        sessionStorage.removeItem("unsub_details");
      }
    }
  }
};
