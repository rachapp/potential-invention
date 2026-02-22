import { Player } from './player.js';
import { Ball, Block, Particle } from './entities.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const levelDisplay = document.getElementById('levelDisplay');

let player = new Player(canvas.width, canvas.height);
let ball = new Ball(canvas.width / 2, canvas.height - 50);
let blocks = [];
let particles = [];
let score = 0;
let level = 1;

// Colors for the destructible blocks
const colors = ['#ff0055', '#ffaa00', '#00ffaa', '#00aaff'];

function buildLevel() {
    blocks = [];
    const rows = 3 + level; // Add a row every level
    const cols = 8;
    const blockWidth = 80;
    const blockHeight = 25;
    const padding = 15;
    const offsetX = 30;
    const offsetY = 50;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let x = c * (blockWidth + padding) + offsetX;
            let y = r * (blockHeight + padding) + offsetY;
            blocks.push(new Block(x, y, blockWidth, blockHeight, colors[r % colors.length]));
        }
    }
    // Increase ball speed per level
    ball.speed = 5 + (level * 0.5);
    ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
    ball.dy = -ball.speed;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
}

function triggerShake() {
    canvas.classList.remove('shake');
    void canvas.offsetWidth; // Trigger reflow to restart animation
    canvas.classList.add('shake');
}

function spawnParticles(x, y, color) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle(x, y, color));
    }
}

// Input handling
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Upgrade System: Press Space to buy a wider paddle
    if (e.code === 'Space' && score >= 50) {
        score -= 50;
        player.upgrade();
        scoreDisplay.innerText = `Score: ${score}`;
    }
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Move Player
    player.move(keys);
    player.draw(ctx);

    // 2. Move Ball & Wall Collisions
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
    if (ball.y - ball.radius < 0) ball.dy *= -1;

    // Reset if ball falls off bottom
    if (ball.y > canvas.height) {
        score = Math.max(0, score - 10); // Penalty
        scoreDisplay.innerText = `Score: ${score}`;
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 50;
        ball.dy = -ball.speed;
    }

    // 3. Ball & Player Collision
    if (ball.y + ball.radius >= player.y && ball.y - ball.radius <= player.y + player.height &&
        ball.x >= player.x && ball.x <= player.x + player.width) {
        ball.dy *= -1;
        ball.y = player.y - ball.radius; // Prevent getting stuck inside
    }

    // 4. Ball & Block Collisions
    let activeBlocks = 0;
    blocks.forEach(block => {
        if (block.active) {
            activeBlocks++;
            // Basic AABB Collision
            if (ball.x > block.x && ball.x < block.x + block.width &&
                ball.y - ball.radius < block.y + block.height && ball.y + ball.radius > block.y) {
                
                block.active = false;
                ball.dy *= -1;
                score += 10;
                scoreDisplay.innerText = `Score: ${score}`;
                
                triggerShake();
                spawnParticles(block.x + block.width/2, block.y + block.height/2, block.color);
            }
        }
    });

    // 5. Level Up Check
    if (activeBlocks === 0) {
        level++;
        levelDisplay.innerText = `Level: ${level}`;
        buildLevel();
    }

    // 6. Draw Blocks & Ball
    blocks.forEach(block => block.draw(ctx));
    ball.draw(ctx);

    // 7. Update & Draw Particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.update();
        p.draw(ctx);
    });

    requestAnimationFrame(gameLoop);
}

// Initialize and start
buildLevel();
gameLoop();