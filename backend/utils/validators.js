// India-only for now — extend here for more countries later.
const indiaMobilePattern = /^(91)?[6-9]\d{9}$/;
const indianMobileErrorMessage = "Enter a valid 10-digit Indian mobile number";

const normalizeIndianMobile = (value = "") =>
  String(value).replace(/[\s+-]/g, "");

const isValidIndianMobile = (value) =>
  indiaMobilePattern.test(normalizeIndianMobile(value));

export {
  indiaMobilePattern,
  indianMobileErrorMessage,
  isValidIndianMobile,
  normalizeIndianMobile,
};
