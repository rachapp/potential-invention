export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 100;
        this.height = 15;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight - 30; // Near the bottom
        this.speed = 8;
    }

    move(keys) {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x + this.width < this.gameWidth) {
            this.x += this.speed;
        }
    }

    upgrade() {
        if (this.width < 300) {
            this.width += 40; // Make paddle wider
            this.x -= 20;     // Re-center adjustment
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#0f0';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#0f0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0; // Reset
    }
}