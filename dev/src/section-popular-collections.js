
function initPopularCollections(root) {
  if (!root) return;

  var tabs = Array.prototype.slice.call(
    root.querySelectorAll(".s-popular-collections__tab")
  );
  var panels = Array.prototype.slice.call(
    root.querySelectorAll(".s-popular-collections__panel")
  );

  if (!tabs.length || !panels.length) return;

  var activeIndex = 0;
  var resizeTimer = null;

  function activateTab(index) {
    tabs.forEach(function (tab, i) {
      var isActive = i === index;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach(function (panel, i) {
      panel.classList.toggle("is-active", i === index);
    });

    activeIndex = index;
  }

  function handleResize() {
    // no-op for now, but keep structure for future responsive tweaks
    activeIndex = activeIndex;
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      activateTab(index);
    });
  });

  activateTab(0);
  activeIndex = 0;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 150);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var sections = document.querySelectorAll("s-popular-collections.s-popular-collections");
  sections.forEach(function (section) {
    initPopularCollections(section);
  });
});
