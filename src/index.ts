// import { Options, App } from "@4site/engrid-common"; // Uses ENGrid via NPM
import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace
import "./sass/main.scss";
import { customScript } from "./scripts/main";

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
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
    cid: 3,
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
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => customScript(),
  onResize: () => console.log("Starter Theme Window Resized"),
};
new App(options);
