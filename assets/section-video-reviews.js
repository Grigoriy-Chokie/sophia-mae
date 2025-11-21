document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-review__video').forEach(container => {
    const video = container.querySelector('video');
    const button = container.querySelector('.video-reviews__play-button');
    if (!video) return;

    container.addEventListener('click', () => {
      if (video.paused || video.ended) {
        video.play().catch(err => console.error('Playback error:', err));
        container.classList.add('video-review__video--play');
        button.classList.add('video-reviews__play-button--play');
        button.setAttribute('aria-label','Pause');
      } else {
        video.pause();
        container.classList.remove('video-review__video--play');
        button.classList.remove('video-reviews__play-button--play');
        button.setAttribute('aria-label','Play video');
      }
    });

    video.addEventListener('ended', () => {
      container.classList.remove('video-review__video--play');
      button.classList.remove('video-reviews__play-button--play');
      button.setAttribute('aria-label','Play video');
    });
  });
});