(() => {
    const hero = document.querySelector('#hero-2042');
    if (!hero) return;

    const playButton = hero.querySelector('.cs-play');
    const video = hero.querySelector('video');

    if (!video) return;

    const updatePlayButtonVisibility = () => {
        if (!playButton) return;
        playButton.classList.toggle('cs-hide', !video.paused);
    };

    const attemptPlay = (shouldUnmute = false) => {
        video.muted = !shouldUnmute;
        const playback = video.play();
        if (playback && playback.catch) {
            playback.catch(() => {
                updatePlayButtonVisibility();
            });
        }
    };

    attemptPlay();
    updatePlayButtonVisibility();

    video.addEventListener('play', updatePlayButtonVisibility);
    video.addEventListener('pause', updatePlayButtonVisibility);
    video.addEventListener('ended', updatePlayButtonVisibility);

    if (playButton) {
        const toggleVideoPlayback = () => {
            if (video.paused) {
                attemptPlay(true);
            } else {
                video.pause();
            }
        };

        video.addEventListener('click', toggleVideoPlayback);
        playButton.addEventListener('click', toggleVideoPlayback);
    }
})();
