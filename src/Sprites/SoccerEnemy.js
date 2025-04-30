class SoccerEnemy extends Phaser.GameObjects.PathFollower  {

    //Phaser.Physics.Arcade.Sprite
    constructor(scene, path, x, y, texture, ball) {
        super(scene, path, x, y, texture, ball);

        this.speed = 3;
        this.isAttacking = false;


        this.ball = ball;

        this.points = 200;
        this.movingRight = true;
        this.pathOffset = new Phaser.Math.Vector2(x, y);
        this.pos = 0;
        this.posRange = 300;

        scene.add.existing(this);

        this.startFollow({
            duration: 1000,
            yoyo: true,
            repeat: -1,
            rotateToPath: false
        });
        return this;
    }

    update() {
    }

    FireBall(positionX, positionY){
        this.ball.x = positionX;
        this.ball.y = positionY + 20;
        this.ball.visible = true;
        this.ball.Move(); //call function for it to move forward!
        this.ball.makeActive();
    }

}