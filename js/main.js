import { Player } from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create the player instance
const player = new Player(canvas.width, canvas.height);

// Track keyboard input
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// The main game loop
function gameLoop() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Update logic
    player.move(keys);

    // 3. Draw everything
    player.draw(ctx);

    // 4. Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();