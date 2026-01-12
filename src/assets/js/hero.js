(() => {
    const hero = document.querySelector('#hero-2042');
    if (!hero) return;

    const playButton = hero.querySelector('.cs-play');
    let video = hero.querySelector('video');

    if (!video) return;

    const enforceMuteState = (target) => {
        target.muted = true;
        target.defaultMuted = true;
        target.volume = 0;
    };

    const updatePlayButtonVisibility = () => {
        if (!playButton) return;
        playButton.classList.toggle('cs-hide', !video.paused);
    };

    const attemptPlay = () => {
        enforceMuteState(video);
        const playback = video.play();
        if (playback && playback.catch) {
            playback.catch(() => {
                updatePlayButtonVisibility();
            });
        }
    };

    const handlePlay = () => {
        enforceMuteState(video);
        updatePlayButtonVisibility();
    };

    const handlePause = () => {
        updatePlayButtonVisibility();
    };

    const handleEnded = () => {
        enforceMuteState(video);
        video.pause();
        updatePlayButtonVisibility();
    };

    const handleVolumeChange = () => {
        if (!video.muted || video.volume !== 0) {
            enforceMuteState(video);
        }
    };

    const attachVideoListeners = () => {
        enforceMuteState(video);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('volumechange', handleVolumeChange);
    };

    attemptPlay();
    updatePlayButtonVisibility();
    attachVideoListeners();

    if (playButton) {
        const toggleVideoPlayback = () => {
            if (video.paused) {
                attemptPlay();
            } else {
                video.pause();
            }
        };

        video.addEventListener('click', toggleVideoPlayback);
        playButton.addEventListener('click', toggleVideoPlayback);
    }

    const observer = new MutationObserver(() => {
        const nextVideo = hero.querySelector('video');
        if (nextVideo && nextVideo !== video) {
            video = nextVideo;
            attachVideoListeners();
            updatePlayButtonVisibility();
        }
    });

    observer.observe(hero, { childList: true, subtree: true });
})();
