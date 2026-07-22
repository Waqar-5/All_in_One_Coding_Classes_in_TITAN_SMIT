// Mirrors the enums defined in Backend/models/book.js and Backend/models/User.js —
// keep these in sync if the backend schema changes.

export const CATEGORY_OPTIONS = [
  "Programming",
  "Science",
  "Mathematics",
  "History",
  "Novel",
  "Biography",
  "Business",
  "Technology",
  "Other",
];

export const CONDITION_OPTIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export const STATUS_OPTIONS = ["Available", "Requested", "Reserved", "Exchanged"];

export function validateBookForm(values) {
  const errors = {};

  if (!values.title?.trim()) errors.title = "Title is required.";
  else if (values.title.trim().length < 2) errors.title = "Title looks too short.";

  if (!values.author?.trim()) errors.author = "Author is required.";

  if (!values.category?.trim()) errors.category = "Category is required.";

  if (values.publishedYear) {
    const year = Number(values.publishedYear);
    const currentYear = new Date().getFullYear();
    if (Number.isNaN(year) || year < 1000 || year > currentYear) {
      errors.publishedYear = `Enter a year between 1000 and ${currentYear}.`;
    }
  }

  if (values.description && values.description.length > 1000) {
    errors.description = "Description must be under 1000 characters.";
  }

  return errors;
}

export function validateRegisterForm(values) {
  const errors = {};

  if (!values.name?.trim()) errors.name = "Name is required.";
  else if (values.name.trim().length < 2) errors.name = "Name looks too short.";

  if (!values.email?.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email.";

  if (!values.password) errors.password = "Password is required.";
  else if (values.password.length < 6) errors.password = "Must be at least 6 characters.";

  return errors;
}

export function validateLoginForm(values) {
  const errors = {};

  if (!values.email?.trim()) errors.email = "Email is required.";
  if (!values.password) errors.password = "Password is required.";

  return errors;
}

// Turns a comma-separated tags string into a clean array for the API,
// and back again for pre-filling an edit form.
export function tagsToArray(tagsString) {
  return tagsString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function tagsToString(tagsArray) {
  return Array.isArray(tagsArray) ? tagsArray.join(", ") : "";
}
