const { test, expect } = require('@playwright/test');

test('hero video remains muted after replay', async ({ page }) => {
    await page.addInitScript(() => {
        const originalPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function play() {
            this.dispatchEvent(new Event('play'));
            return Promise.resolve(originalPlay?.call(this));
        };
    });

    await page.goto('/');

    const video = page.locator('#hero-2042 video');
    await expect(video).toBeVisible();

    const initialState = await video.evaluate((element) => ({
        muted: element.muted,
        defaultMuted: element.defaultMuted,
        volume: element.volume,
    }));

    expect(initialState.muted).toBe(true);
    expect(initialState.defaultMuted).toBe(true);
    expect(initialState.volume).toBe(0);

    const endedState = await video.evaluate((element) => {
        element.currentTime = Math.max(element.duration - 0.1, 0);
        element.dispatchEvent(new Event('ended'));
        return {
            paused: element.paused,
            muted: element.muted,
            defaultMuted: element.defaultMuted,
            volume: element.volume,
        };
    });

    expect(endedState.paused).toBe(true);
    expect(endedState.muted).toBe(true);
    expect(endedState.defaultMuted).toBe(true);
    expect(endedState.volume).toBe(0);

    await page.locator('#hero-2042 .cs-play').click();

    const replayState = await video.evaluate((element) => ({
        muted: element.muted,
        defaultMuted: element.defaultMuted,
        volume: element.volume,
    }));

    expect(replayState.muted).toBe(true);
    expect(replayState.defaultMuted).toBe(true);
    expect(replayState.volume).toBe(0);
});
