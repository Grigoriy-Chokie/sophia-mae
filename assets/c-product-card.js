"use strict";
class CProductCard extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  connectedCallback() {
    const t = this.querySelector("[data-cpc-atc]");
    t && t.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    const t = this.querySelector("[data-cpc-atc]");
    t && t.removeEventListener("click", this.handleClick);
  }
  handleClick(t) {
    const e = t.currentTarget;
    if (e.disabled) return;
    const a = e.disabled,
      n = (t2) => {
        t2
          ? ((e.dataset.cpcWasDisabled = a ? "true" : "false"),
            e.classList.add("is-loading"),
            (e.disabled = !0))
          : (e.classList.remove("is-loading"),
            "true" !== e.dataset.cpcWasDisabled && (e.disabled = !1),
            e.removeAttribute("data-cpc-was-disabled"));
      };
    if ((n(!0), "function" == typeof _addMeToCart)) {
      const a2 = _addMeToCart(t, e);
      return void (a2 && "function" == typeof a2.finally
        ? a2.finally(() => n(!1))
        : setTimeout(() => n(!1), 800));
    }
    const s = e.dataset.variant_id;
    s
      ? fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ id: s, quantity: 1 }),
        })
          .then((t2) => t2.json())
          .catch(() => {})
          .finally(() => n(!1))
      : n(!1);
  }
}
customElements.get("c-product-card") ||
  customElements.define("c-product-card", CProductCard);

