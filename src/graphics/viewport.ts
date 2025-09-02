import { SCALING_CONFIG, VIEWPORT_CONFIG } from './graphics-config.js';

export class Viewport {
    ctx: CanvasRenderingContext2D;
    private readonly virtualWidth: number;
    private readonly virtualHeight: number;
    private scale: number;
    private gameWidth: number;
    private gameHeight: number;
    private offsetX: number;
    private offsetY: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.virtualWidth = SCALING_CONFIG.VIRTUAL_WIDTH;
        this.virtualHeight = SCALING_CONFIG.VIRTUAL_HEIGHT;
        this.scale = 0;
        this.gameWidth = 0;
        this.gameHeight = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    // scales and centres the context
    startFrame(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        this.calculateViewPort();
        this.applyTransform();
    }

    // adds letterbox bars
    finishFrame(): void {
        this.ctx.restore();
        this.drawLetterBoxBars();
    }

    // calculates the dimensions and scale of the game based on the current window size
    private calculateViewPort(): void {
        const windowScaleX = this.ctx.canvas.width / this.virtualWidth;
        const windowScaleY = this.ctx.canvas.height / this.virtualHeight;
        this.scale = Math.min(windowScaleX, windowScaleY);
        this.gameWidth = this.virtualWidth * this.scale;
        this.gameHeight = this.virtualHeight * this.scale;
        this.offsetX = (this.ctx.canvas.width - this.gameWidth) / 2;
        this.offsetY = (this.ctx.canvas.height - this.gameHeight) / 2;
    }

    // scales and centres the context to fit perfectly in the middle of the window
    private applyTransform(): void {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
    }

    private drawLetterBoxBars(): void {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = VIEWPORT_CONFIG.letterboxColour;
        // left bar
        if (this.offsetX > 0) {
            this.ctx.fillRect(0, 0, this.offsetX, this.ctx.canvas.height);
            // right bar
            this.ctx.fillRect(this.offsetX + this.gameWidth, 0, this.offsetX, this.ctx.canvas.height);
        }
        // top bar
        if (this.offsetY > 0) {
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.offsetY);
            // bottom bar
            this.ctx.fillRect(0, this.offsetY + this.gameHeight, this.ctx.canvas.width, this.offsetY);
        }
    }
}