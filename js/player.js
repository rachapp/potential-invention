export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 50;
        this.height = 50;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight / 2 - this.height / 2;
        this.speed = 5;
        this.dx = 0;
        this.dy = 0;
    }

    move(keys) {
        this.dx = 0;
        this.dy = 0;

        if (keys['ArrowLeft']) this.dx = -this.speed;
        if (keys['ArrowRight']) this.dx = this.speed;
        if (keys['ArrowUp']) this.dy = -this.speed;
        if (keys['ArrowDown']) this.dy = this.speed;

        this.x += this.dx;
        this.y += this.dy;

        // Keep player inside the canvas boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.gameWidth) this.x = this.gameWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > this.gameHeight) this.y = this.gameHeight - this.height;
    }

    draw(ctx) {
        ctx.fillStyle = '#3498db'; // Blue square
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}