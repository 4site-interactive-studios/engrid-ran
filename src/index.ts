// import {
//   Options,
//   App,
//   DonationAmount,
//   DonationFrequency,
// } from "@4site/engrid-common"; // Uses ENGrid via NPM
import {
  Options,
  App,
  DonationAmount,
  DonationFrequency,
} from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace
import "./sass/main.scss";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import { customScript } from "./scripts/main";

const rememberMeOptions = {
  checked: true,
  remoteUrl:
    "https://www.ran.org/wp-content/themes/ran-2020/data-remember.html",
  fieldOptInSelectorTarget:
    "div.en__field--telephone, div.en__field--email, div.en__field--lastName",
  fieldOptInSelectorTargetLocation: "after",
  fieldClearSelectorTarget:
    "div.en__field--firstName div, div.en__field--email div",
  fieldClearSelectorTargetLocation: "after",
  fieldNames: [
    "supporter.firstName",
    "supporter.lastName",
    "supporter.address1",
    "supporter.address2",
    "supporter.city",
    "supporter.country",
    "supporter.region",
    "supporter.postcode",
    "supporter.emailAddress",
  ],
};

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  CurrencyCode: "USD",
  DecimalSeparator: ".",
  ThousandsSeparator: ",",
  MinAmount: 5,
  MaxAmount: 100000,
  MinAmountMessage: "Amount must be at least $5 - Contact us for assistance",
  MaxAmountMessage:
    "Amount must be less than $100,000 - Contact us for assistance",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  NeverBounceAPI: "public_520ace707aaa95300c65f742af9fb095",
  NeverBounceDateField: "supporter.NOT_TAGGED_36",
  NeverBounceStatusField: "supporter.NOT_TAGGED_35",
  NeverBounceDateFormat: "YYYYMMDD",
  TidyContact: {
    cid: "659b7129-73d0-4601-af4c-8942c4730f65",
    // us_zip_divider: "-",
    record_field: "supporter.NOT_TAGGED_41",
    date_field: "supporter.NOT_TAGGED_39",
    status_field: "supporter.NOT_TAGGED_40",
    countries: ["us"],
    phone_enable: true,
    phone_preferred_countries: ["us", "ca", "gb", "jp", "au"],
    phone_record_field: "supporter.NOT_TAGGED_45",
    phone_date_field: "supporter.NOT_TAGGED_44",
    phone_status_field: "supporter.NOT_TAGGED_43",
  },
  RememberMe: rememberMeOptions,
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(DonationAmount, DonationFrequency);
    customScript();
  },
  onResize: () => console.log("Starter Theme Window Resized"),
  onValidate: () => {
    const country = App.getFieldValue("supporter.country");
    // If country is not US or CA, then remove the region field value
    if (
      !["us", "usa", "united states", "ca", "canada"].includes(
        country.toLowerCase()
      )
    ) {
      App.setFieldValue("supporter.region", "");
      console.log("Region field cleared");
    }
  },
};

if (document.body.dataset.engridTheme === "engrid-ran3") {
  rememberMeOptions.fieldOptInSelectorTarget =
    "div.en__field--postcode, div.en__field--telephone, div.en__field--email, div.en__field--lastName";
}

new App(options);
