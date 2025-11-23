class SliderBlogComponent extends HTMLElement {
  constructor() {
    super();

    this.sliderElement = this.querySelector('[id^="Slider-"]');
    this.slideElements = this.querySelectorAll('[id^="Slide-"]');
    this.postsListElement = this.querySelector("ul");

    if (!this.sliderElement || !this.postsListElement) return;

    this.handleResize = this.handleResize.bind(this);

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this);

    window.addEventListener("resize", this.handleResize);

    this.setDesktopColumns();

    this.handleResize();
  }

  setDesktopColumns() {
    const desktopColumns = this.dataset.columnsDesktop;

    this.postsListElement.classList.forEach(className => {
      if (className.startsWith("custom-blog-post__posts-columns--")) {
        this.postsListElement.classList.remove(className);
      }
    });

    this.postsListElement.classList.add(
      `custom-blog-post__posts-columns--${desktopColumns}`
    );
  }

  handleResize() {
    const width = window.innerWidth;

    if (width > 768) {
      this.slideElements.forEach(slide => {
        slide.style.minWidth = "";
      });
      return;
    }

    const sliderWidth = this.sliderElement.clientWidth - (18 * 2);
    const columnsMobile = parseInt(this.dataset.columnsMobile || "2", 10);
    const columns = isNaN(columnsMobile) || columnsMobile < 1 ? 2 : columnsMobile;
    const gap = 16;
    const totalGap = gap * Math.max(columns - 1, 0);
    const itemWidth = (sliderWidth - totalGap) / columns;

    this.slideElements.forEach(slide => {
      slide.style.minWidth = `${itemWidth}px`;
    });

    this.sliderElement.style.gap = `${gap}px`;
  }
}

customElements.define("slider-blog-component", SliderBlogComponent);
