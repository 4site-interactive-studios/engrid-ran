import {
  Options,
  App,
  DonationAmount,
  DonationFrequency,
  EnForm,
  OptInLadder,
} from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import {
//   Options,
//   App,
//   DonationAmount,
//   DonationFrequency,
//   EnForm,
//   OptInLadder,
// } from "../../engrid/packages/scripts"; // Uses ENGrid via Visual Studio Workspace
import "./sass/main.scss";
import DonationLightboxForm from "./scripts/donation-lightbox-form";
import { customScript } from "./scripts/main";
import { AddDAF } from "./scripts/add-daf";
import { EcardRecipientDetails } from "./scripts/ecard-recipient-details";
import { HideIfChecked } from "./scripts/hide-if-checked";
import { Unsubscribe } from "./scripts/unsubscribe";

const options: Options = {
  applePay: false,
  AutoYear: true,
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
  UseBodyBannerImageAsBackground: true,
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  ProgressBar: true,
  // NeverBounceAPI: "public_520ace707aaa95300c65f742af9fb095",
  // NeverBounceDateField: "supporter.NOT_TAGGED_36",
  // NeverBounceStatusField: "supporter.NOT_TAGGED_35",
  // NeverBounceDateFormat: "YYYYMMDD",
  TidyContact: {
    cid: "659b7129-73d0-4601-af4c-8942c4730f65",
    us_zip_divider: "-",
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
  RememberMe: {
    checked: true,
    remoteUrl:
      "https://www.ran.org/wp-content/themes/ran-2020/data-remember.html",
    fieldOptInSelectorTarget:
      "div.en__field--postcode, div.en__field--telephone, div.en__field--email, div.en__field--lastName",
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
  },
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  WelcomeBack: {
    welcomeBackMessage: {
      display: true,
      title: "Welcome back, {firstName}!",
      editText: "Not you?",
      anchor: ".body-main",
      placement: "afterbegin",
    },
    personalDetailsSummary: {
      display: true,
      title: "Personal Information",
      editText: "Change",
      anchor: ".fast-personal-details",
      placement: "beforebegin",
    },
  },
  VGS: {
    "transaction.ccnumber": {
      css: {
        "@font-face": {
          "font-family": "HarmoniaSansPro",
          "font-style": "normal",
          "font-weight": "400",
          "font-display": "swap",
          src: 'local("HarmoniaSansPro"), local("HarmoniaSansPro-Regular"), url("https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10042/HarmoniaSansProRegular.woff2") format("woff2");',
        },
      },
    },
    "transaction.ccvv": {
      css: {
        "@font-face": {
          "font-family": "HarmoniaSansPro",
          "font-style": "normal",
          "font-weight": "400",
          "font-display": "swap",
          src: 'local("HarmoniaSansPro"), local("HarmoniaSansPro-Regular"), url("https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10042/HarmoniaSansProRegular.woff2") format("woff2");',
        },
      },
    },
  },
  OptInLadder: {
    iframeUrl:
      // TODO: Update URL before launch - This is currently pointed to a test page with the correct query parameters to pull in the ladder form
      "https://act.ran.org/page/75744/data/1?chain&engrid_hide[body-headerOutside]=class&engrid_hide[body-banner]=class&engrid_hide[content-footer]=class&engrid_hide[page-backgroundImage]=class&data-engrid-opt-in-ladder-persist=true",
    excludePageIDs: ["78306"],
  },
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    new DonationLightboxForm(App, DonationAmount, DonationFrequency);
    new AddDAF();
    new OptInLadder();
    new EcardRecipientDetails();
    new HideIfChecked();
    new Unsubscribe({
      snooze_emails: {
        date_field: "supporter.NOT_TAGGED_66",
        opt_out_field: "supporter.questions.102600",
        duration: 60,
        selector: ".snooze-emails-block",
      },
      not_you: true,
      categories: {
        "Fewer Emails": {
          selector: ".fewer-emails-block",
          opt_out_field: "supporter.questions.102600",
          opt_in_field: "supporter.questions.341509",
        },
        "Unsub All Emails": {
          selector: ".unsub-emails-block",
          opt_out_field: [
            "supporter.questions.102600",
            "supporter.questions.341509",
          ],
        },
        "Sub All Emails": {
          selector: ".sub-emails-block",
          opt_in_field: "supporter.questions.102600",
          opt_out_field: "supporter.questions.341509",
        },
      },
    });
    customScript(App, EnForm);
  },
  onResize: () => console.log("Starter Theme Window Resized"),
  onValidate: () => {
    const country = App.getFieldValue("supporter.country");
    // If country is not US, CA or AU, then remove the region field value
    if (
      ![
        "us",
        "usa",
        "united states",
        "ca",
        "canada",
        "au",
        "australia",
      ].includes(country.toLowerCase())
    ) {
      App.setFieldValue("supporter.region", "");
      App.log("Region field cleared");
    }
  },
};

new App(options);
