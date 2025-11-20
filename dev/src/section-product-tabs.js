
function initProductTabs(root) {
  if (!root) return;

  var tabs = Array.prototype.slice.call(
    root.querySelectorAll(".s-product-tabs__tab")
  );
  var panels = Array.prototype.slice.call(
    root.querySelectorAll(".s-product-tabs__panel")
  );
  var tabsContainer = root.querySelector(".s-product-tabs__tabs");
  var tabBar = root.querySelector(".s-product-tabs__tab-bar");
  var tabBarTrack = root.querySelector(".s-product-tabs__tab-bar-track");
  var tabBarThumb = root.querySelector(".s-product-tabs__tab-bar-thumb");

  if (!tabs.length || !panels.length) return;

  var swipers = {};
  var activeIndex = 0;

  function getTabsMetrics() {
    if (!tabBar || !tabs.length) return null;
    var wrapperRect = tabBar.parentElement
      ? tabBar.parentElement.getBoundingClientRect()
      : tabBar.getBoundingClientRect();
    var firstRect = tabs[0].getBoundingClientRect();
    var lastRect = tabs[tabs.length - 1].getBoundingClientRect();

    var start = firstRect.left - wrapperRect.left;
    var end = lastRect.right - wrapperRect.left;
    return {
      start: start,
      width: Math.max(end - start, 0),
    };
  }

  function updateBarLayout() {
    if (!tabBar) return;
    var metrics = getTabsMetrics();
    if (!metrics) return;

    tabBar.style.width = metrics.width + "px";

    if (tabBarTrack) {
      tabBarTrack.style.width = "100%";
    }
  }

  function moveThumb(index) {
    if (!tabBarThumb || !tabBar) return;
    var activeTab = tabs[index];
    if (!activeTab) return;

    var tabRect = activeTab.getBoundingClientRect();
    var barRect = tabBar.getBoundingClientRect();
    var thumbWidth = tabRect.width;
    var thumbOffset = tabRect.left - barRect.left;

    tabBarThumb.style.width = thumbWidth + "px";
    tabBarThumb.style.transform = "translateX(" + thumbOffset + "px)";
  }

  function updateTabBar(index) {
    updateBarLayout();
    moveThumb(index);
    activeIndex = index;
  }

  function activateTab(index) {
    tabs.forEach(function (tab, i) {
      var isActive = i === index;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach(function (panel, i) {
      panel.classList.toggle("is-active", i === index);
    });

    if (swipers[index]) {
      swipers[index].update && swipers[index].update();
    }

    updateTabBar(index);
  }

  function handleResize() {
    updateTabBar(activeIndex);
  }

  var resizeTimer = null;

  function initSwiperForPanel(panel) {
    var swiperEl = panel.querySelector(".s-product-tabs__swiper");
    if (!swiperEl || swiperEl._swiperInitialized) return;

    if (typeof Swiper === "undefined") return;

    var prevButton = panel.querySelector(".s-product-tabs__arrow--prev");
    var nextButton = panel.querySelector(".s-product-tabs__arrow--next");

    var swiper = new Swiper(swiperEl, {
      loop: false,
      spaceBetween: 12,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 28
        },
      },
    });

    function updateNavState() {
      if (!prevButton || !nextButton) return;
      var totalSlides = swiper.slides ? swiper.slides.length : 0;
      var perView =
        typeof swiper.params.slidesPerView === "number"
          ? swiper.params.slidesPerView
          : parseFloat(swiper.params.slidesPerView) || 1;

      var hideAll = totalSlides <= perView;
      prevButton.classList.toggle("is-hidden", hideAll || swiper.isBeginning);
      nextButton.classList.toggle("is-hidden", hideAll || swiper.isEnd);
    }

    swiper.on("slideChange", updateNavState);
    swiper.on("resize", updateNavState);
    swiper.on("update", updateNavState);

    swiperEl._swiperInitialized = true;
    var tabIndex = parseInt(panel.getAttribute("data-tab-index"), 10) || 0;
    swipers[tabIndex] = swiper;
    updateNavState();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateTab(index);
      initSwiperForPanel(panels[index]);
    });
  });

  // Initialize first tab and its swiper
  activateTab(0);
  initSwiperForPanel(panels[0]);
  updateTabBar(0);

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });

  window.addEventListener("load", function () {
    updateTabBar(activeIndex);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var sections = document.querySelectorAll("s-product-tabs.s-product-tabs");
  sections.forEach(function (section) {
    initProductTabs(section);
  });
});
