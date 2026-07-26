import { tagsToArray } from "./validators";

/**
 * Builds a FormData payload for POST/PUT /books from a plain form-state object
 * plus optional cover image / PDF Files. Empty optional text fields are
 * omitted so we don't overwrite them with blank strings server-side —
 * except readLink, which is allowed to be cleared intentionally.
 */
export function buildBookFormData(form, imageFile, { removeImage = false, pdfFile = null, removePdf = false } = {}) {
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

  if (form.readLink !== undefined) {
    formData.append("readLink", form.readLink);
  }

  if (form.tags) {
    tagsToArray(form.tags).forEach((tag) => formData.append("tags", tag));
  }

  if (imageFile) {
    formData.append("image", imageFile);
  } else if (removeImage) {
    formData.append("removeImage", "true");
  }

  if (pdfFile) {
    formData.append("pdfFile", pdfFile);
  } else if (removePdf) {
    formData.append("removePdf", "true");
  }

  return formData;
}
