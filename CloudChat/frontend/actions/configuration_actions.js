export const RECEIVED_WELCOME_PACKAGE = "RECEIVED_WELCOME_PACKAGE";

export const receiveWelcomePackage = (data)=>({
  type: RECEIVED_WELCOME_PACKAGE,
  data
});
