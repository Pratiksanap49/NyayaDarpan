export const emptyRojnamaForm = {
  hearingDate: "",
  purpose: "",
  business: "",
  orderDirections: "",
  nextHearingDate: "",
};

export const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

export const getMissingRojnamaFields = (form) =>
  ["hearingDate", "purpose", "business", "orderDirections"].filter(
    (field) => !String(form[field] || "").trim(),
  );
