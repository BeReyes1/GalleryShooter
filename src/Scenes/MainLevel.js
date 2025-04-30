class MainLevel extends Phaser.Scene {
    constructor() {
        super("mainLevel");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};   

        this.leftX = 40;
        this.rightX = 700;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("characterWhite", "characterWhite.png");
        this.load.image("football", "football.png");
        this.load.image("soccerEnemy", "soccerEnemy.png");
        this.load.image("soccer", "soccer.png");

        this.load.image("basketballEnemy", "basketballEnemy.png")
        this.load.image("basketball", "basketball.png");

        this.load.image("elephant", "elephant.png");

        this.load.audio("ballLaunch", "footstep_carpet_000.ogg");
        this.load.audio("playerLaunch", "footstep_snow_004.ogg");
        this.load.audio("playerHit", "impactBell_heavy_001.ogg");
        this.load.audio("enemyHit", "impactPunch_heavy_001.ogg");
    }

    create() {
        let my = this.my;
        
        my.sprite.mainCharacter = this.add.sprite(game.config.width/2, game.config.height - 40, "characterWhite");
        my.sprite.mainCharacter.setScale(2);
        my.sprite.mainCharacter.flipX = true;
        my.sprite.mainCharacter.angle = 90;

        // Create the "bullet" offscreen and make it invisible to start
        my.sprite.football = this.add.sprite(-10, -10, "football");
        my.sprite.football.setScale(1.6);
        my.sprite.football.visible = false;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restart = this.input.keyboard.addKey("R");

        my.sprite.enemies = this.add.group();
        my.sprite.bullets = this.add.group();

        //CREATE enemies
        let rowYPositions = [90, 200];
        for (let row = 0; row < rowYPositions.length; row++) {
            let y = rowYPositions[row];

            for (let i = this.leftX, index =0; i < this.rightX; i += 80, index++) {  
                if (index % 2 == 0) {
                    this.newSoccerBall = new SoccerBall(this, 150, 40, "soccer", this.soccerBall);
                    this.newSoccerBall.setScale(1.6);   
                    this.newSoccerBall.makeInactive();

                    my.sprite.bullets.add(this.newSoccerBall);

                    let enemyPath = new Phaser.Curves.Path(i, 90);
                    enemyPath.lineTo(i + 100, y); 
                    enemyPath.lineTo(i, y);

                    this.newSoccerEnemy = new SoccerEnemy(this, enemyPath, i, y, "soccerEnemy", this.newSoccerBall);
                    this.newSoccerEnemy.setScale(2);
                    this.newSoccerEnemy.flipX = true;
                    this.newSoccerEnemy.angle = -90;

                    my.sprite.enemies.add(this.newSoccerEnemy);

                    continue;
                }else {
                    this.newBasketBall = new Basketball(this, 150, 40, "basketball", this.newBasketBall);
                    this.newBasketBall.setScale(1.6);   
                    this.newBasketBall.makeInactive();

                    my.sprite.bullets.add(this.newBasketBall);

                    let enemyPath = new Phaser.Curves.Path(i, y); 
                    enemyPath.lineTo(i + 100, y); 
                    enemyPath.lineTo(i, y);

                    this.newBasketBallEnemy = new SoccerEnemy(this, enemyPath, i, y, "basketballEnemy", this.newBasketBall);
                    this.newBasketBallEnemy.setScale(2);
                    this.newBasketBallEnemy.flipX = true;
                    this.newBasketBallEnemy.angle = -90;

                    my.sprite.enemies.add(this.newBasketBallEnemy);
                }
            }
        }

        //VARIABLES
        this.playerSpeed = 4;
        this.bulletSpeed = 9;
        this.timeBetweenAttacks = 120;
        this.currentTime = 0;
        this.delta = 1;
        
        this.minEnemiesAttacking = 3;
        
        // Create a flag to determine if the "bullet" is currently active and moving
        this.bulletActive = false;

        this.playerHealth = 5;

        this.score = 0;

        this.gameOver = false;

        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {fontSize: '30px'});
        this.healthText = this.add.text(16, 36, 'Health: ' + this.playerHealth, {fontSize: '30px'});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Main Level.js</h2><br>A: left // D: right // Space: fire'
    }

    update() {


        let my = this.my;
        
        if (this.gameOver) {
            if (this.restart.isDown) {
                this.scene.start("mainLevel");
            }
            return;
        }

        //time between attacks
        this.currentTime += this.delta;
        if (this.currentTime % this.timeBetweenAttacks == 0) {
            let currentEnemies = my.sprite.enemies.getChildren();
            let numToFire = Math.min(this.minEnemiesAttacking, currentEnemies.length); 

            Phaser.Utils.Array.Shuffle(currentEnemies);

            for (let i = 0; i < numToFire; i++) {
                let enemy = currentEnemies[i];
                enemy.FireBall(enemy.x, enemy.y);
                this.sound.play("ballLaunch");
            }

        }

        for (let bullet of my.sprite.bullets.getChildren().filter((bullet) => bullet.active)) {
            bullet.update();
        }

        for (let enemy of my.sprite.enemies.getChildren()) {
            enemy.update();
        }

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.mainCharacter.x > (my.sprite.mainCharacter.displayWidth/2)) {
                my.sprite.mainCharacter.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.mainCharacter.x < (game.config.width - (my.sprite.mainCharacter.displayWidth/2))) {
                my.sprite.mainCharacter.x += this.playerSpeed;
            }
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (!this.bulletActive) {
                this.bulletActive = true;
                my.sprite.football.x = my.sprite.mainCharacter.x;
                my.sprite.football.y = my.sprite.mainCharacter.y - my.sprite.mainCharacter.displayHeight/2;
                my.sprite.football.visible = true;
                this.sound.play("playerLaunch");
            }
        }


        this.BulletCollision();

        
        if (this.bulletActive) {
            my.sprite.football.y -= this.bulletSpeed;
            if (my.sprite.football.y < -(my.sprite.football.height/2)) {
                this.bulletActive = false;
                my.sprite.football.visible = false;
            }
        }


        this.CheckGameConditions();
    }


    BulletCollision() {
        let my = this.my

        for (let enemy of my.sprite.enemies.getChildren()) {
            if (this.collides(enemy, my.sprite.football)) {
                my.sprite.enemies.remove(enemy);
                enemy.visible = false;

                this.bulletActive = false;
                this.sound.play("enemyHit");
                this.UpdateScore(100);
                my.sprite.football.visible = false;
                my.sprite.football.y = 1000;
            }
        }

        for (let bullet of my.sprite.bullets.getChildren().filter((bullet) => bullet.active)){
            if (this.collides(bullet, my.sprite.mainCharacter)) {
                this.playerHealth -= bullet.damage;
                this.healthText.setText('Health: ' + this.playerHealth);
                bullet.makeInactive();
                this.sound.play("playerHit");

            }
        }
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    CheckGameConditions() {
        let my = this.my;
        if (my.sprite.enemies.getChildren().length == 0) {
            this.UpdateScore(this.playerHealth * 100);
            this.gameOver = true;
            this.add.text(400, 300, "You Win!", {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 350, "Final Score: " + this.score, {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 400, "(Press 'R' to restart)", {fontSize: '32px'}).setOrigin(0.5);
        }

        if (this.playerHealth <= 0) {
            //console.log("Lose!");
            this.gameOver = true;
            this.add.text(400, 300, "You Lose", {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 350, "(Press 'R' to restart)", {fontSize: '32px'}).setOrigin(0.5);
        }
    }

    UpdateScore(score) {
        this.score += score;
        console.log(this.score);
        this.scoreText.setText('Score: ' + this.score);
    }
}