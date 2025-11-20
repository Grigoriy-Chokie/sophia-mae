function _addMeToCart(e, el) {
  e = e || window.event;
  e.preventDefault();

  const cartType = el.dataset.cart_type;

  let formData = {
    'items': [
      {
        'id': el.dataset.variant_id,
        'quantity': 1
      }
    ]
  };

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
        bubbles: true
      }));
    })
    .then((data) => {
      if (cartType !== "drawer") {
        window.location.href = "/cart";
        return
      }
      if (document.querySelector("cart-drawer")) {
        document.querySelector("cart-drawer").show() 
      }
    })
    .catch((err) => {
      console.error('Error: ' + err);
    })
}


var links = document.links;
for (let i = 0, linksLength = links.length ; i < linksLength ; i++) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = '_blank';
    links[i].rel = 'noreferrer noopener';
  }
}


function getAllKarmaButtons() {
  return document.querySelectorAll(".lion-rewards-list .lion-action-button.lion-action-button--tile")
}


function createErrorMessage(hasArchivedProducts) {
  const defaultTexts = {
    inCart: "Not able to add this Reward due to Archive product in cart",
  };

  const { inCart } = window.karmaTexts || defaultTexts;
  const baseClassName = "lion-reward-item__actions-error";
  const additionalClass = hasArchivedProducts ? "" : "lion-reward-item__actions-error--hide";
  const className = `${baseClassName} ${additionalClass}`;

  const errorDiv = document.createElement("div");
  errorDiv.className = className.trim();
  errorDiv.innerHTML = hasArchivedProducts ? inCart : "";

  return errorDiv;
}




// /* 
//   ***
//     Load more btn on Collection page
//   ***
// */


class LoadMore extends HTMLElement{
  constructor() {
      super()

  }
  connectedCallback(){
      let loadMoreButton = document.querySelector(".js-load-more")

      this.nextPage = loadMoreButton.dataset.nextLink
      this.buttonText = loadMoreButton.querySelector('[load-more-text]')
      this.buttonLoader = loadMoreButton.querySelector('[load-more-loader]')
      this.loadProgress = document.querySelector(".load-more_progress")
      this.currentCollectionGrid = document.querySelector("product-list")
      loadMoreButton.addEventListener("click", this.loadMore.bind(this))
  }
  async loadMore () {
      this.buttonText.classList.add("hidden")
      this.buttonLoader.classList.remove("hidden")
      let response = await fetch(window.location.origin + this.nextPage);
      if (response.ok) {
          const parser = new DOMParser();

          let html = await response.text();
          html = parser.parseFromString(html, "text/html");
          const newCollectionGrid = html.querySelector("product-list")
          this.currentCollectionGrid.innerHTML += newCollectionGrid.innerHTML
          this.loadProgress.innerHTML = html.querySelector(".load-more_progress").innerHTML
          this.nextPage = html.querySelector(".js-load-more").dataset.nextLink
          if(!this.nextPage) {
              document.querySelector(".load-more-block").classList.add("hidden")

          }
          this.buttonText.classList.remove("hidden")
          this.buttonLoader.classList.add("hidden")
      }
  }

}

window.customElements.define("load-more", LoadMore);

class BackToTop extends HTMLElement {
  constructor() {
    super();

    this.topPoint = this.getTopPoint();
    this.triggerPoint = window.innerHeight * 0.25;

    this.handleClick = this.onClick.bind(this);
    this.handleScroll = BackToTop.throttle(this.onScroll.bind(this), 25);
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick);
    window.addEventListener("scroll", this.handleScroll);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
    window.removeEventListener("scroll", this.handleScroll);
  }

  onScroll() {
    const scrollY = window.scrollY;
    const isVisible = scrollY > this.triggerPoint;
    this.classList.toggle("back-to-top--active", isVisible);
  }

  onClick() {
    window.scrollTo({
      top: this.topPoint,
      left: 0,
      behavior: "smooth",
    });
  }

  getTopPoint() {
    return document.querySelector("header")?.getBoundingClientRect().top || 0;
  }

  static throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  }
}

window.customElements.define("back-to-top", BackToTop);

class InfiniteScroll extends HTMLElement {
  constructor() {
    super();

    this.parentContainer = document.querySelector("product-list.product-list");
    this.trigger = this.querySelector(".infinite-scroll__trigger");
    this.loader = this.querySelector(".infinite-scroll__loader");
    this.sectionId = this.getAttribute("data-section-id");
    this.observer = null;
    this.isLoading = false;
  }

  connectedCallback() {
    if (!this.trigger || !this.parentContainer) {
      console.warn("InfiniteScroll: missing trigger or parent container.");
      return;
    }
    this.initObserver();
  }

  disconnectedCallback() {
    if (this.observer) this.observer.disconnect();
  }

  getConfig() {
    const script = this.querySelector("script[data-config]");
    if (!script) return {};

    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.error("Invalid JSON in data-config:", error.message);
      return {};
    }
  }

  async fetchData() {
    const config = this.getConfig();

    if (!config?.next?.url) {
      this.cleanup();
      return null;
    }

    try {
      this.showLoader();

      const response = await fetch(`${config.next.url}&section_id=${this.sectionId}`);
      const data = await response.text();

      return new DOMParser().parseFromString(data, "text/html");
    } catch (error) {
      console.error("Fetch error:", error.message);
      return null;
    } finally {
      this.hideLoader();
    }
  }

  insertAndUpdateContent(html) {
    if (!html) return;

    const productList = html.querySelector("product-list");
    const productCards = [...(productList?.children || [])];

    if (!productCards.length) return;

    const newConfig = html.querySelector("script[data-config]");
    const currentConfig = this.querySelector("script[data-config]");
    if (newConfig && currentConfig) {
      currentConfig.replaceWith(newConfig);
    }

    this.parentContainer.append(...productCards);
  }

  initObserver() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.isLoading = true;
        this.fetchData().then((html) => {
          this.insertAndUpdateContent(html);
          this.isLoading = false;
        });
      }
    });

    this.observer.observe(this.trigger);
  }

  showLoader() {
    if (this.loader) this.loader.hidden = false;
  }

  hideLoader() {
    if (this.loader) this.loader.hidden = true;
  }

  cleanup() {
    if (this.observer) this.observer.disconnect();
    this.remove();
  }
}

window.customElements.define("infinite-scroll", InfiniteScroll);

// Account menu

(function() {
  const dropdownAccount = document.querySelector(".dropdown-account");
  const buttonsAccount = document.querySelectorAll(".link-account");
  const buttonClose = dropdownAccount?.querySelector(".dropdown-account__close");
  const dropdownContainer = dropdownAccount?.querySelector(".dropdown-account__container");

  if (!dropdownAccount || !buttonsAccount.length || !buttonClose || !dropdownContainer) return;

  buttonsAccount.forEach( button => button.addEventListener("click", handleButtonClick ));
  buttonClose.addEventListener("click", toggleMenu);
  dropdownContainer.addEventListener("click", preventPropagation);
  window.addEventListener("click", handleWindowClick);

  function handleButtonClick(event) {
    event.stopPropagation();
    event.preventDefault();
    toggleMenu();
  }

  function handleWindowClick() {
    if (!isDropdownActive()) return;
    toggleMenu();
  }

  function preventPropagation(event) {
    event.stopImmediatePropagation();
  }

  function toggleMenu() {
    document.querySelector("header-sidebar").hide()

    const isActive = isDropdownActive();
    dropdownAccount.classList.toggle("dropdown-account--active", !isActive);
    document.querySelector("html").classList.toggle("lock", !isActive);
  }

  function isDropdownActive() {
    return dropdownAccount.classList.contains("dropdown-account--active");
  }
})();


if (window.location.pathname.includes("/pages/loyalty-points")) {
  const parentLionPage = document.querySelector("[data-lion-integrated-page]");
  const triggerLink = document.querySelector(".AnnouncementBar-text-loyalty");

  if (parentLionPage) {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const targetElement = document.querySelector("#loyaltylion .lion-redeem");
          if (targetElement && targetElement.offsetTop) {

            if (!localStorage.getItem("scroll")) {
              scrollToElement(targetElement);
              localStorage.setItem("scroll", "true")
            }
            
            triggerLink.addEventListener("click", (event) => {
              event.preventDefault();
              scrollToElement(targetElement)
            })

            observer.disconnect();
            break;
          }
        }
      }
    });

    observer.observe(parentLionPage, {
      childList: true,
      subtree: true
    });

  }

  function scrollToElement(element) {
    if (!element) return;
    const formOffset = element.offsetTop;
    window.scrollTo({ top: formOffset, behavior: "smooth" });
  }
} else {
  localStorage.removeItem("scroll")
}

function updateLoyaltylion() {
  const observer = new MutationObserver((mutations, obs) => {
    const loyaltylion = document.getElementById('loyaltylion');
    if (loyaltylion) {
      const slider = loyaltylion.querySelector('.lion-in-cart-rewards-widget__rewards-slider');
      if (!slider) return;

      const sliderButton = loyaltylion.querySelector('.lion-in-cart-rewards-widget__navigator--forward')
      const numberOfSlides = slider.children.length
      if(numberOfSlides < 3) return
      const lastValue = (numberOfSlides / 2) * 100 - 100;

      const styleObserver = new MutationObserver(() => {
        const leftValue = slider.style.left;
        if (leftValue) {
          const number = Math.abs(leftValue.replace('%', '').trim());
          
          if(!sliderButton) return

          if(number === lastValue) {
            sliderButton.style.opacity = 0
            sliderButton.style.pointerEvents = 'none'
          } else {
            sliderButton.style.opacity = 1
            sliderButton.style.pointerEvents = 'all'
          }
        }
      });

      styleObserver.observe(slider, {
        attributes: true,
        attributeFilter: ['style']
      });

      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

updateLoyaltylion()