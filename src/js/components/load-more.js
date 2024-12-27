const portfolio = document.querySelector(".main-portfolio");

if (portfolio) {
  const loadMore = document.querySelector(".main-portfolio__more");
  const portfolioItems = portfolio.querySelectorAll(".main-portfolio__item");

  let visibleItems = 2;
  [...portfolioItems]
    .slice(visibleItems)
    .forEach((el) => el.classList.add("hide-item"));

  if (visibleItems >= portfolioItems.length) {
    loadMore.remove();
  }
  loadMore.addEventListener("click", (e) => {
    e.preventDefault();
    visibleItems += 2;

    for (let i = 0; i < visibleItems; i++) {
      portfolioItems[i].classList.remove("hide-item");
    }

    if (visibleItems >= portfolioItems.length) {
      loadMore.remove();
    }
  });
}
