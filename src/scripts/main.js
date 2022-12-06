export const customScript = function () {
  console.log("ENGrid client scripts are executing");
  // Add your client scripts here

  // Add placeholder to the "other" giving amount field
  let enFieldOtherAmt = document.querySelectorAll(
    ".radio-to-buttons_donationAmt .en__field--radio.en__field--donationAmt .en__field__input--other"
  )[0];
  if (enFieldOtherAmt) {
    enFieldOtherAmt.placeholder = "Other";
  }

  // Add placeholder to the Mobile Phone Field
  let enFieldMobilePhone = document.querySelectorAll(
    "input#en__field_supporter_phoneNumber"
  )[0];
  if (enFieldMobilePhone) {
    enFieldMobilePhone.placeholder = "000-000-0000 (optional)";
  }

  // Digital Wallets Moving Parts

  const digitalWalletWrapper = document.querySelector(
    ".merge-with-give-by-select #en__digitalWallet"
  );
  const digitalWalletFirstChild = document.querySelector("#en__digitalWallet");
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
  [...frequencyRadio, currencySelect].forEach((el) => {
    el.addEventListener("change", () => {
      console.log("CHANGING");
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
                console.log(
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
};
