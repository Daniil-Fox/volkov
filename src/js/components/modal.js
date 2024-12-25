const modal = document.querySelector(".modal");
if (modal) {
  const modalButtons = document.querySelectorAll(".modal-btn");
  const modalCloseBtn = document.querySelector(".modal__close");
  modalButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      modal.classList.add("active");
    });
  });

  modalCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    modal.classList.remove("active");
  });
}
