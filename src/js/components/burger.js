const burger = document.querySelector(".header__burger");

if (burger) {
  const burgerMenu = document.querySelector(".burger-menu");
  const burgerCats = burgerMenu.querySelectorAll(".burger-menu__cat[data-cat]");
  const burgerCatsContent = burgerMenu.querySelectorAll(
    ".burger-menu__content"
  );
  function clearCats() {
    burgerCats.forEach((el) => el.classList.remove("active"));
    burgerCatsContent.forEach((el) => {
      el.classList.remove("active");
      el.style.maxHeight = null;
    });
  }
  burger.addEventListener("click", (e) => {
    burger.classList.toggle("active");
    burgerMenu.classList.toggle("active");
  });

  burgerCats.forEach((cat) => {
    let counter = 0;
    cat.addEventListener("click", (e) => {
      counter += 1 % 2;
      if (counter % 2 == 0) {
        clearCats();
      } else {
        clearCats();
        cat.classList.add("active");

        const dataCat = cat.dataset.cat;
        const currentContent = burgerMenu.querySelector(
          `.burger-menu__content[data-content=${dataCat}]`
        );

        currentContent.classList.add("active");
        currentContent.style.maxHeight = currentContent.scrollHeight + "px";
      }
    });
  });
}
