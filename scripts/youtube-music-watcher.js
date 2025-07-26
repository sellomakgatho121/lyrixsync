// scripts/youtube-music-watcher.js
// Requires: npm install puppeteer axios
const puppeteer = require('puppeteer');
const axios = require('axios');

const BACKEND_ENDPOINT = 'http://localhost:3000/api/youtube-music-track'; // Change to your deployed endpoint if needed

async function getCurrentTrack(page) {
  return await page.evaluate(() => {
    const titleEl = document.querySelector('.title.ytmusic-player-bar');
    const artistEl = document.querySelector('.byline.ytmusic-player-bar');
    const coverEl = document.querySelector('.image.ytmusic-player-bar img');
    if (!titleEl || !artistEl) return null;
    return {
      title: titleEl.textContent.trim(),
      artist: artistEl.textContent.trim(),
      cover: coverEl ? coverEl.src : null,
    };
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://music.youtube.com', { waitUntil: 'networkidle2' });

  let lastTrack = null;
  while (true) {
    try {
      const track = await getCurrentTrack(page);
      if (track && (!lastTrack || track.title !== lastTrack.title || track.artist !== lastTrack.artist)) {
        lastTrack = track;
        console.log('Now playing:', track);
        // Send to backend
        await axios.post(BACKEND_ENDPOINT, track).catch(() => {});
      }
    } catch (e) {
      // Ignore errors
    }
    await new Promise(r => setTimeout(r, 2000)); // Poll every 2 seconds
  }
  // await browser.close();
})();
