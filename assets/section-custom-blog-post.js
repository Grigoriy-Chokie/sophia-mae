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

    if (width <= 425) {
      this.slideElements.forEach(slide => {
        slide.style.minWidth = sliderWidth * 1 + "px";
      });
    } else {
      const gap = 16;
      this.slideElements.forEach(slide => {
        slide.style.minWidth = ((sliderWidth - gap) / 2) + "px";
      });
    }
  }
}

customElements.define("slider-blog-component", SliderBlogComponent);