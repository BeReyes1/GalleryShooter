class SoccerBall extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        //this.visible = false;
        //this.active = false;

        this.speed = 10;
        this.moving = false;

        this.movingBackwards = false;

        this.damage = 2;

        scene.add.existing(this);
        return this;
    }

    update() {        
        if (this.moving) {
            this.y+= this.speed;

            if (this.y > 600) {
                this.makeInactive();
            }

        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;

        //console.log("Yo!");
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
        this.moving = false;
        //console.log("Done");
    }

    Move(){
        this.moving = true;
    }

}