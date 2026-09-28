// India-only for now — extend here for more countries later.
const indiaMobilePattern = /^(91)?[6-9]\d{9}$/;

const normalizeIndianMobile = (value = "") =>
  String(value).replace(/[\s+-]/g, "");

const isValidIndianMobile = (value) =>
  indiaMobilePattern.test(normalizeIndianMobile(value));

export { indiaMobilePattern, isValidIndianMobile, normalizeIndianMobile };
