import { tagsToArray } from "./validators";

/**
 * Builds a FormData payload for POST/PUT /books from a plain form-state object
 * plus an optional cover image File. Empty optional fields are omitted so we
 * don't overwrite them with blank strings server-side.
 */
export function buildBookFormData(form, imageFile, { removeImage = false } = {}) {
  const formData = new FormData();

  const textFields = [
    "title",
    "author",
    "category",
    "description",
    "condition",
    "language",
    "publisher",
    "publishedYear",
    "isbn",
    "status",
    "location",
  ];

  textFields.forEach((field) => {
    if (form[field] !== undefined && form[field] !== "") {
      formData.append(field, form[field]);
    }
  });

  if (form.tags) {
    tagsToArray(form.tags).forEach((tag) => formData.append("tags", tag));
  }

  if (imageFile) {
    formData.append("image", imageFile);
  } else if (removeImage) {
    formData.append("removeImage", "true");
  }

  return formData;
}
