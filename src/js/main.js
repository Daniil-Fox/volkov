import "./_components.js";

document.querySelectorAll(".form-file-input").forEach((input) => {
  input.addEventListener("change", function (event) {
    const fileList = document.getElementById("file-list");
    const files = Array.from(event.target.files);
    fileList.innerHTML = ""; // Clear the list before adding new files
    console.log(files);
    files.forEach((file, index) => {
      const fileItem = document.createElement("div");
      fileItem.className = "form-file";

      const fileName = document.createElement("span");
      fileName.className = "form-file__name";
      fileName.textContent = file.name;

      const removeButton = document.createElement("button");
      removeButton.className = "btn-reset form-file__rm";
      removeButton.innerHTML = '<i class="fas fa-times">&times;</i>';
      removeButton.addEventListener("click", (e) => {
        e.preventDefault();
        fileItem.remove();
        files.splice(index, 1);
        updateFileList(files);
        console.log(files);
      });

      fileItem.appendChild(fileName);
      fileItem.appendChild(removeButton);
      fileList.appendChild(fileItem);
    });

    function updateFileList(updatedFiles) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      input.files = dataTransfer.files;

      fileList.innerHTML = "";
      updatedFiles.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className = "form-file";

        const fileName = document.createElement("span");
        fileName.className = "form-file__name";
        fileName.textContent = file.name;

        const removeButton = document.createElement("button");
        removeButton.className = "btn-reset form-file__rm";
        removeButton.innerHTML = "<i>&times;</i>";
        removeButton.addEventListener("click", () => {
          updatedFiles.splice(index, 1);
          updateFileList(updatedFiles);
          console.log(files);
        });

        fileItem.appendChild(fileName);
        fileItem.appendChild(removeButton);
        fileList.appendChild(fileItem);
      });
    }
  });
});
