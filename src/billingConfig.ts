export const DEPLOYED_URL = "https://lyra-learning.ai.studio";
export const MONTHLY_PRICE_ID = "price_1TugFoIlpAU3gYFIIfj9wvVZ";
export const YEARLY_PRICE_ID = "price_1TugCCIlpAU3gYFIhzWd5kxZ";
export const WEEKLY_PRICE_ID = "price_1TugAPIlpAU3gYFIpKyT4mbM";

/**
 * Detects if the application uses hash routing automatically.
 * Checks both the browser window location href and the presence of hash routing indicators.
 */
const hasHashRouting = (): boolean => {
  if (typeof window !== "undefined") {
    return window.location.href.includes("/#/") || window.location.hash.startsWith("#/");
  }
  return false;
};

/**
 * Returns the correct success redirect URL.
 */
export const successUrl = (): string => {
  return hasHashRouting() 
    ? `${DEPLOYED_URL}/#/success` 
    : `${DEPLOYED_URL}/success`;
};

/**
 * Returns the correct cancel redirect URL.
 */
export const cancelUrl = (): string => {
  return hasHashRouting() 
    ? `${DEPLOYED_URL}/#/failure` 
    : `${DEPLOYED_URL}/failure`;
};
