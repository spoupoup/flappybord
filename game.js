const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let frames = 0;
const degree = Math.PI / 180;

// Bird object
const bird = {
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,

    frame: 0,

    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,

    draw: function() {
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);

        ctx.restore();
    },

    flap: function() {
        this.speed = -this.jump;
    },

    update: function() {
        // If the game state is get ready state, the bird must flap slowly
        this.period = state.current == state.getReady ? 10 : 5;
        // We increment the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        // Frame goes from 0 to 4, then again to 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150; // Reset position of the bird after game over
            this.rotation = 0 * degree;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h/2 >= canvas.height - foreground.h) {
                this.y = canvas.height - foreground.h - this.h/2;
                if (state.current == state.playing) {
                    state.current = state.over;
                }
            }

            // If the speed is greater than the jump means the bird is falling down
            if (this.speed >= this.jump) {
                this.rotation = 90 * degree;
                this.frame = 1;
            } else {
                this.rotation = -25 * degree;
            }
        }
    }
};

// Handle key events
document.addEventListener('keydown', function(evt) {
    if (evt.keyCode == 32) {
        if (state.current == state.getReady) {
            state.current = state.playing;
        } else if (state.current == state.playing) {
            bird.flap();
        } else if (state.current == state.over) {
            state.current = state.getReady;
        }
    }
});

// Game state
const state = {
    current: 0,
    getReady: 0,
    playing: 1,
    over: 2
};

// Start animation
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

function update() {
    bird.update();
}

function draw() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bird.draw();
}

loop();
