// Yahir Rico

class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    preload() {
        this.load.scenePlugin("AnimatedTiles", "./lib/AnimatedTiles.js", "animatedTiles", "animatedTiles");
    }

    init() {
        // Constant values used for other aspects
        this.ACCELERATION = 400;
        this.DRAG = 900;
        this.JUMP_VELOCITY = -750;
        this.GRAVITY = 1500;
        this.SWIM_GRAVITY = 5;
        this.SWIM_ACCELERATION = 150;
        this.SWIM_DRAG = 1500;
        this.SWIM_JUMP_MULTIPLIER = 0.43;
        this.PARTICLE_VELOCITY = 50;

        this.physics.world.gravity.y = this.GRAVITY;
        this.physics.world.TILE_BIAS = 24;

        this.respawnPoint = { x: 100, y: 240 };
        this.collectedKeys = 0;
        this.totalKeys = 2;
        this.collectedCoins = 0;

        this.gameEnded = false;
    }

    create() {
        const defaultRespawn = { x: 100, y: 240 };
        const spawn = Object.assign({}, defaultRespawn, this.scene.settings.data);
        this.respawnPoint = spawn;

        this.map = this.make.tilemap({ key: "platformer_map" });

        // Tilesets
        const tilesets = [
            this.map.addTilesetImage("background", "tilemap-backgrounds_packed"),
            this.map.addTilesetImage("characters", "tilemap-characters_packed"),
            this.map.addTilesetImage("industrialTileset", "industrial_map_packed"),
            this.map.addTilesetImage("marbleTileset", "marble_packed"),
            this.map.addTilesetImage("normalTileset", "tilemap_packed"),
            this.map.addTilesetImage("rockTileset", "rock_packed"),
            this.map.addTilesetImage("sandTileset", "sand_packed")
        ];

        // Creates layers
        this.map.createLayer("Background", tilesets, 0, 0);
        this.map.createLayer("Decorations", tilesets, 0, 0);
        this.liquidLayer = this.map.createLayer("Liquids", tilesets, 0, 0);
        this.platformLayer = this.map.createLayer("Platform", tilesets, 0, 0);
        this.platformLayer.setCollisionByProperty({ collides: true });

        // Starts tile animations
        this.animatedTiles.init(this.map);

        // Creates character sprite
        my.sprite.player = this.physics.add.sprite(this.respawnPoint.x, this.respawnPoint.y, "characters", 0).setOrigin(0.5, 1);
        my.sprite.player.body.setSize(24, 24);
        my.sprite.player.body.setCollideWorldBounds(false);
        this.physics.add.collider(my.sprite.player, this.platformLayer);

        // Particles
        this.coinParticles = this.add.particles(0, 0, "coinEffect", {
            lifespan: 500,
            speed: { min: 80, max: 120 },
            scale: { start: 0.125, end: 0 },
            gravityY: 300,
            quantity: 1,
            emitting: false
        });

        this.jumpParticles = this.add.particles(0, 0, "jumpEffect", {
            lifespan: 300,
            speed: { min: 20, max: 50 },
            scale: { start: 0, end: 0.1 },
            quantity: 1,
            emitting: false
        });

        this.runParticles = this.add.particles(0, 0, "runEffect", {
            speed: 10,
            scale: { start: 0.1, end: 0 },
            lifespan: 200,
            emitting: false
        });

        this.runParticles.setPosition(my.sprite.player.x, my.sprite.player.y);

        // Coins
        this.coins = this.map.createFromObjects("Collectibles", { name: "coin", key: "tilemap_packed", frame: 151 });
        this.coins.forEach(coin => {
            coin.setOrigin(0).setDepth(1);
            coin.x -= 8;
            coin.y -= 8;
            coin.play("coinSpin");
        });
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (player, coin) => {
            this.coinParticles.setPosition(coin.x, coin.y);
            this.coinParticles.explode(1);
            this.sound.play("coin");
            coin.destroy();
            this.collectedCoins++;
            totalCoins++;
            document.getElementById("coinCounter").innerText = `Coins: ${totalCoins}`;

        });
        // Keys
        this.keys = this.map.createFromObjects("Collectibles", { name: "key", key: "tilemap_packed", frame: 27 });
        this.keys.forEach(key => { key.setOrigin(0).setDepth(1); key.x -= 8; key.y -= 8; });
        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.keys);
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (player, key) => {
            this.collectedKeys++;
            this.sound.play("interact");
            key.destroy();
        });
        // Doors
        this.doors = this.map.createFromObjects("Collectibles", { name: "door", key: "industrial_map_packed", frame: 28 });
        this.doors.forEach(door => { door.setOrigin(0).setDepth(1); door.x -= 8; door.y -= 8; });
        this.physics.world.enable(this.doors, Phaser.Physics.Arcade.STATIC_BODY);
        this.doorGroup = this.add.group(this.doors);
        this.physics.add.collider(my.sprite.player, this.doorGroup, (player, door) => {
            if (this.collectedKeys > 0) {
                this.collectedKeys--;
                this.sound.play("door");
                door.destroy();
                this.doorGroup.remove(door, true, true);
            }
        });
        // Flags
        this.flags = this.map.createFromObjects("Flags", { name: "flag", key: "tilemap_packed", frame: 111 });
        this.flags.forEach(flag => { flag.setOrigin(0); flag.setDepth(1); flag.x -= 8; flag.y -= 8; });
        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);
        this.flagGroup = this.add.group(this.flags);
        this.physics.add.overlap(my.sprite.player, this.flagGroup, (player, flag) => {
            this.respawnPoint = { x: flag.x + 8, y: flag.y };
            this.coinParticles.setPosition(flag.x, flag.y);
            this.coinParticles.explode(1);
            flag.destroy();
        });
        // End game Condition (Related to Last Flag)
        this.endFlag = this.map.createFromObjects("Flags", { name: "EndFlag", key: "tilemap_packed", frame: 111 });
        this.endFlag.forEach(flag => { flag.setOrigin(0); flag.setDepth(1); flag.x -= 8; flag.y -= 8; });
        this.physics.world.enable(this.endFlag, Phaser.Physics.Arcade.STATIC_BODY);
        this.endFlagGroup = this.add.group(this.endFlag);
        this.physics.add.overlap(my.sprite.player, this.endFlagGroup, (player, flag) => {
            flag.destroy();
            this.coinParticles.setPosition(flag.x, flag.y);
            this.coinParticles.explode(1);
            this.gameEnded = true;
            this.scene.start("gameEndScene");
        });

        // Enemies
        this.enemyGroup = this.physics.add.group();
        this.map.getObjectLayer("Enemies")?.objects.forEach(enemyObj => {
            const enemy = this.enemyGroup.create(enemyObj.x, enemyObj.y - 8, "characters", 24);
            enemy.setOrigin(0).setDepth(1).setVelocityX(40).setBounceX(1);
            enemy.body.setSize(24, 24);
            enemy.anims.play("enemyWalk");
        });

        // Enemy Collision (if player is in collision with enemy, they are sent to respawn point)
        // And adds 1 to the death counter
        this.physics.add.collider(this.enemyGroup, this.platformLayer);
        this.physics.add.overlap(my.sprite.player, this.enemyGroup, () => {
            this.sound.play("death");
            my.sprite.player.setVelocity(0);
            my.sprite.player.setX(this.respawnPoint.x);
            my.sprite.player.setY(this.respawnPoint.y);
            deathCount++;
            document.getElementById("deathCounter").innerText = `Deaths: ${deathCount}`;

        });
        
        // Restart Key
        cursors = this.input.keyboard.createCursorKeys();
        this.rKey = this.input.keyboard.addKey('R');

        // Camera Setup
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, 99999);
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0);
        this.cameras.main.setDeadzone(100, 0);
        this.cameras.main.roundPixels = true;

        // Creates UI element for Deaths and Coins at the bottom of the screen
        document.getElementById("ui").style.display = "flex";

    }

    update() {
        // Liquid Detection for different player movement while in water
        const inLiquid = this.liquidLayer.hasTileAtWorldXY(my.sprite.player.x, my.sprite.player.y);

        if (inLiquid) {
            my.sprite.player.body.allowGravity = true;
            my.sprite.player.body.gravity.y = this.SWIM_GRAVITY;
            my.sprite.player.setDragX(this.SWIM_DRAG);
            if (cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.SWIM_ACCELERATION);
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
            } else if (cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.SWIM_ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
            } else {
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.anims.play('idle');
            }

            if ((cursors.up.isDown || cursors.space?.isDown)) {
                my.sprite.player.setVelocityY(this.JUMP_VELOCITY * this.SWIM_JUMP_MULTIPLIER);
            }
        } else {
            // Normal Player Movement
            my.sprite.player.body.allowGravity = true;
            my.sprite.player.body.gravity.y = this.GRAVITY;
            my.sprite.player.setDragX(this.DRAG);

            if (cursors.left.isDown) {
                my.sprite.player.setAccelerationX(-this.ACCELERATION);
                my.sprite.player.resetFlip();
                my.sprite.player.anims.play('walk', true);
                this.runParticles.start();
            } else if (cursors.right.isDown) {
                my.sprite.player.setAccelerationX(this.ACCELERATION);
                my.sprite.player.setFlip(true, false);
                my.sprite.player.anims.play('walk', true);
                this.runParticles.start();
            } else {
                my.sprite.player.setAccelerationX(0);
                my.sprite.player.anims.play('idle');
                this.runParticles.stop();
            }

            this.runParticles.setPosition(
                my.sprite.player.flipX ? my.sprite.player.x - 20 : my.sprite.player.x + 20,
                my.sprite.player.y - 8
            );

            if (!my.sprite.player.body.blocked.down) {
                my.sprite.player.anims.play('jump');
            }

            if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play("jump");
                const feetY = my.sprite.player.y + my.sprite.player.displayHeight / 2;
                this.jumpParticles.setPosition(my.sprite.player.x, feetY);
                this.jumpParticles.explode(1);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            if (this.gameEnded) {
                this.scene.start("platformerScene");
            } else {
                this.scene.restart({ x: this.respawnPoint.x, y: this.respawnPoint.y });
            }
        }

        my.sprite.player.x = Phaser.Math.Clamp(my.sprite.player.x, 0, this.map.widthInPixels);

        // Enemy Movement (Prevents enemy from falling off platform)
        // Also changes which way enemy is facing for better game pollish
        this.enemyGroup.children.iterate(enemy => {
            const direction = enemy.body.velocity.x < 0 ? -1 : 1;
            const edgeX = enemy.x + (direction * enemy.width * 0.5);
            const tileBelow = this.platformLayer.getTileAtWorldXY(edgeX, enemy.y + enemy.height + 1);
            if (!tileBelow) {
                enemy.setVelocityX(-enemy.body.velocity.x);
            }

            enemy.setFlipX(enemy.body.velocity.x > 0);
        });
    }
}
