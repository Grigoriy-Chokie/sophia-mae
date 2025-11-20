class CProductCard extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    const btn = this.querySelector("[data-cpc-atc]");
    if (btn) {
      btn.addEventListener("click", this.handleClick);
    }
  }

  disconnectedCallback() {
    const btn = this.querySelector("[data-cpc-atc]");
    if (btn) {
      btn.removeEventListener("click", this.handleClick);
    }
  }

  handleClick(event) {
    const btn = event.currentTarget;
    if (btn.disabled) return;

    const wasDisabled = btn.disabled;
    const setLoading = (state) => {
      if (state) {
        btn.dataset.cpcWasDisabled = wasDisabled ? "true" : "false";
        btn.classList.add("is-loading");
        btn.disabled = true;
      } else {
        btn.classList.remove("is-loading");
        if (btn.dataset.cpcWasDisabled !== "true") {
          btn.disabled = false;
        }
        btn.removeAttribute("data-cpc-was-disabled");
      }
    };

    setLoading(true);

    if (typeof _addMeToCart === "function") {
      const res = _addMeToCart(event, btn);
      if (res && typeof res.finally === "function") {
        res.finally(() => setLoading(false));
      } else {
        setTimeout(() => setLoading(false), 800);
      }
      return;
    }

    // Fallback: post to cart/add
    const variantId = btn.dataset.variant_id;
    if (!variantId) {
      setLoading(false);
      return;
    }

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ id: variantId, quantity: 1 }),
    })
      .then((res) => res.json())
      .catch(() => {})
      .finally(() => setLoading(false));
  }
}

if (!customElements.get("c-product-card")) {
  customElements.define("c-product-card", CProductCard);
}
