class VideoReviewsSlider extends HTMLElement {
  constructor() {
    super();

    this.sliderElement = this.querySelector('.video-reviews__slider-list');
    this.slideElements = this.querySelectorAll('.video-reviews__slider-list-item');

    if (!this.sliderElement || this.slideElements.length === 0) return;

    this.handleResize = this.handleResize.bind(this);

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(this.sliderElement);

    window.addEventListener('resize', this.handleResize);

    this.handleResize();
  }

  handleResize() {
    const width = window.innerWidth;
    const sliderWidth = this.sliderElement.clientWidth;
    const desktopGap = 17;
    const mobileGap = 10;
    let slidesToShow;
    let gap;

    if (width > 1200) {
      slidesToShow = 4;
      gap = desktopGap;
    } else if (width > 768) {
      slidesToShow = 3.2;
      gap = desktopGap;
    } else if (width > 375) {
      slidesToShow = 2.2;
      gap = mobileGap;
    } else {
      slidesToShow = 1.2;
      gap = mobileGap;
    }

    const numberOfGaps = Math.max(0, slidesToShow - 1);
    const totalGap = numberOfGaps * gap;

    const slideWidth = (sliderWidth - totalGap) / slidesToShow;
    const finalSlideWidth = Math.max(40, Math.floor(slideWidth));

    this.slideElements.forEach(slide => {
      slide.style.flex = `0 0 ${finalSlideWidth}px`;
      slide.style.maxWidth = `${finalSlideWidth}px`;
      slide.style.boxSizing = 'border-box';
    });

    this.sliderElement.style.gap = `${gap}px`;
  }
}

customElements.define('video-reviews-slider', VideoReviewsSlider);
