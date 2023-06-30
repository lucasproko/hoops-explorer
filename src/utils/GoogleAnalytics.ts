import ReactGA from "react-ga4";

export const initGA = () => {
  console.log("GA: init=" + (undefined != process.env.GA_KEY));
  ReactGA.initialize(process.env.GA_KEY as string, {
    testMode: process.env.NODE_ENV === "test",
  });
};
export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
};
export const logEvent = (category = "", action = "") => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};
export const logException = (description = "", fatal = false) => {
  if (description) {
    //(ReactGA.pageView no longer supported, since GA4)
  }
};
