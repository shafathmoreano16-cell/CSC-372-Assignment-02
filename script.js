document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".dish-card");

  const main = document.querySelector("#main-content") || document.querySelector("main");
  if (!main) return;

  if (document.getElementById("favorites-summary")) return;

  const summary = document.createElement("section");
  summary.id = "favorites-summary";
  summary.classList.add("box");

  const title = document.createElement("h2");
  title.textContent = "Favorites Summary";

  const list = document.createElement("ul");
  list.id = "favorites-list";

  const totalText = document.createElement("p");
  totalText.id = "favorites-total";
  totalText.textContent = "Total: $0.00";

  summary.appendChild(title);
  summary.appendChild(list);
  summary.appendChild(totalText);
  main.appendChild(summary);

  const favorites = new Map();

  cards.forEach(function (card) {
    const name = (card.dataset.name || "").trim();
    const raw = (card.dataset.price || "").replace("$", "").trim();
    const price = parseFloat(raw);

    if (!name || Number.isNaN(price)) return;

    if (!card.querySelector(".price-tag")) {
      const priceTag = document.createElement("p");
      priceTag.classList.add("price-tag");
      priceTag.textContent = "Price: $" + price.toFixed(2);
      card.appendChild(priceTag);
    }

    if (!card.querySelector(".favorite-btn")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.classList.add("favorite-btn");
      btn.textContent = "Add to Favorites";
      btn.setAttribute("aria-pressed", "false");

      btn.addEventListener("click", function () {
        const isFav = favorites.has(card);

        if (!isFav) {
          const li = document.createElement("li");
          li.textContent = name + " — $" + price.toFixed(2);
          list.appendChild(li);

          favorites.set(card, { price: price, li: li });

          card.classList.add("favorite-selected");
          btn.textContent = "Remove Favorite";
          btn.setAttribute("aria-pressed", "true");
        } else {
          const data = favorites.get(card);
          if (data && data.li) data.li.remove();
          favorites.delete(card);

          card.classList.remove("favorite-selected");
          btn.textContent = "Add to Favorites";
          btn.setAttribute("aria-pressed", "false");
        }

        updateTotal(totalText, favorites);
      });

      card.appendChild(btn);
    }
  });

  updateTotal(totalText, favorites);
});

function updateTotal(totalEl, favMap) {
  let sum = 0;
  favMap.forEach(function (item) {
    sum += item.price;
  });
  totalEl.textContent = "Total: $" + sum.toFixed(2);
}