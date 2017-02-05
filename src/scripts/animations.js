//=require lib/bezier.js

function Animation(anim, duration, easing) {

    var bezierTransitions = {
        'ease':        [0.25, 0.1, 0.25, 1.0],
        'linear':      [0.00, 0.0, 1.00, 1.0],
        'ease-in':     [0.42, 0.0, 1.00, 1.0],
        'ease-out':    [0.00, 0.0, 0.58, 1.0],
        'ease-in-out': [0.42, 0.0, 0.58, 1.0]
    }

    this.duration = duration || 500;
    this.easing = bezierTransitions[easing] || bezierTransitions.ease;
    this.spline = new KeySpline(this.easing);

    this.frame = 1;
    this.frameDuration = this.duration / 1000 * config.FPS;
    this.progress = 0;
    this.isRunning = false;
    this.isLooping = false;

    var dir = 1;

    this.start = new Date().getTime();

    this.animate = function() {
        this.progress = this.frame / this.frameDuration;

        if(this.progress <= 0) {
            dir = 1;
            // console.log(new Date().getTime() - this.start)
        }

        if(this.isLooping) {
            this.progress *= 2;
        }

        if(this.isRunning) {
            if(this.progress <= 1) {
                anim(this.spline.get(this.progress));
                this.frame += dir;
            } else if(this.isLooping) {
                // this.frame = 1;
                anim(this.spline.get(this.progress));
                dir = -1;
                this.frame += dir;
                if(this.progress >= 2) {
                    this.frame = 1;
                }
            } else {
                anim(this.spline.get(1));
            }
        }
    };

    game.animations.push(this);
}
