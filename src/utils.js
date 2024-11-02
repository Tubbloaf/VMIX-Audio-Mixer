// src/utils.js

export function enableDragAndDrop(dropZone, inputElement) {
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragging");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      inputElement.files = files; // Assign dropped file(s) to the input element
      inputElement.dispatchEvent(new Event("change")); // Trigger change event
    }
  });
}
