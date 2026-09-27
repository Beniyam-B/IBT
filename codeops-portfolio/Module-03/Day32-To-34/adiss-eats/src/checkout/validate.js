export const AREAS = ["Bole", "Kazanchis", "Megenagna", "Piassa"];
const TELEBIRR_RE = /^(?:\+251|0)9\d{8}$/;

export function validate(form, fulfillment) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your name";
  }

  const phone = form.phone.trim().replace(/\s+/g, "");
  if (!TELEBIRR_RE.test(phone)) {
    errors.phone = "Use 09… or +2519… (TeleBirr number)";
  }

  if (fulfillment === "delivery" && !AREAS.includes(form.area)) {
    errors.area = "Choose a delivery area";
  }

  if (fulfillment === "delivery" && !form.address.trim()) {
    errors.address = "Please enter a delivery address";
  }

  if (form.notes.length > 200) {
    errors.notes = "Notes must be 200 characters or fewer";
  }

  return errors;
}