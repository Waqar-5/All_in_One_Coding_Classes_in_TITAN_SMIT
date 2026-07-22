export function validateBookForm(values) {
  const errors = {};

  if (!values.title?.trim()) errors.title = "Title is required.";
  else if (values.title.trim().length < 2) errors.title = "Title looks too short.";

  if (!values.author?.trim()) errors.author = "Author is required.";

  if (!values.category?.trim()) errors.category = "Category is required.";

  if (!values.owner?.trim()) errors.owner = "Owner's name is required.";

  if (!values.status?.trim()) errors.status = "Choose a status.";

  return errors;
}

export const CATEGORY_OPTIONS = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "Fantasy",
  "Mystery",
  "Romance",
  "Biography",
  "History",
  "Self-Help",
  "Poetry",
  "Other",
];

export const STATUS_OPTIONS = ["Available", "Exchanged"];
