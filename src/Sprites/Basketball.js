class Basketball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        //this.visible = false;
        //this.active = false;

        this.speed = 7;
        this.moving = false;
        this.movingBackwards = false;
        this.bounces = 0;
        this.maxBounces = 4;

        this.damage = 1;

        scene.add.existing(this);
        return this;
    }

    update() {   
        if (this.moving) {
            if (this.movingBackwards) {
                this.y -= this.speed;
            }else {
                this.y += this.speed;
            }
            if (this.y > 600) {
                this.movingBackwards = true;
                this.bounces++;
            }

            if (this.movingBackwards && this.y < 0) {
                this.movingBackwards = false;
                this.bounces++;
            }
        }

        if (this.bounces >= this.maxBounces) {
            this.makeInactive();
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
        this.movingBackwards = false;
        this.bounces = 0;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
        this.moving = false;
    }

    Move(){
        this.moving = true;
    }

}