// Fires scripts ASAP, but not before DOMContentLoaded
// Accounts for the circumstance where the DOMContentLoaded event has already triggered
const DOMReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
}

DOMReady(function() {
    console.log("ENGrid client scripts are executing");
    // Add your client scripts here

    // Add placeholder to the "other" giving amount field
    let enFieldOtherAmt = document.querySelectorAll('.radio-to-buttons_donationAmt .en__field--radio.en__field--donationAmt .en__field__input--other')[0];
    if(enFieldOtherAmt){
        enFieldOtherAmt.placeholder = "Other";
    }

    // Add placeholder to the Mobile Phone Field
    let enFieldMobilePhone = document.querySelectorAll('input#en__field_supporter_phoneNumber')[0];
    if(enFieldMobilePhone){
        enFieldMobilePhone.placeholder = "000-000-0000 (optional)";
    }
});
