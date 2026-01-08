(() => {
    const hero = document.querySelector('#hero-2042');
    if (!hero) return;

    const playButton = hero.querySelector('.cs-play');
    const video = hero.querySelector('video');

    if (video) {
        const attemptAutoplay = () => {
            const playback = video.play();
            if (playback && playback.catch) {
                playback.catch(() => {});
            }
        };

        attemptAutoplay();
    }

    if (video && playButton) {
        const updatePlayButtonVisibility = () => {
            playButton.classList.toggle('cs-hide', !video.paused);
        };

        updatePlayButtonVisibility();
        video.addEventListener('play', updatePlayButtonVisibility);
        video.addEventListener('pause', updatePlayButtonVisibility);

        const toggleVideoPlayback = () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        };

        video.addEventListener('click', toggleVideoPlayback);
        playButton.addEventListener('click', toggleVideoPlayback);
    }
})();
