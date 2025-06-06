// Yahir Rico

class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Tilemaps
        this.load.tilemapTiledJSON("platformer_map", "PlatformerMap.tmj");
        this.load.tilemapTiledJSON("start_map", "startMap.tmj");

        // Tilesets
        this.load.image("tilemap-backgrounds_packed", "tilemap-backgrounds_packed.png");
        this.load.image("marble_packed", "marble_packed.png");
        this.load.image("rock_packed", "rock_packed.png");
        this.load.image("sand_packed", "sand_packed.png");
        this.load.image("level_background", "level_background.png");

        // Background Images used for main menu and end screen
        this.load.image("mainmenu", "mainmenu.png");
        this.load.image("gameEnd", "gameEnd.png");


        // Particle Effects
        this.load.image("coinEffect", "coinEffect.png");
        this.load.image("jumpEffect", "jumpEffect.png");
        this.load.image("runEffect", "runEffect.png");

        // Audio
        this.load.audio("coin", "coin.ogg");
        this.load.audio("death","deathSound.mp3")
        this.load.audio("door", "door.ogg");
        this.load.audio("jump", "jump.ogg");
        this.load.audio("interact", "interact.ogg");
        this.load.audio("bgm", "BGM.mp3");

        // Spritesheets
        this.load.spritesheet("tilemap_packed", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("characters", "tilemap-characters_packed.png", {
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.spritesheet("industrial_map_packed", "industrial_map_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("level_spritesheet", "level_spritesheet.png", {
            frameWidth: 18,
            frameHeight: 18
        });
    }

    create() {
        // Animations
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("characters", { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: "coinSpin",
            frames: this.anims.generateFrameNumbers("tilemap_packed", { frames: [151, 152] }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "enemyWalk",
            frames: this.anims.generateFrameNumbers("characters", { frames: [24, 25, 26] }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: "idle",
            frames: [{ key: "characters", frame: 0 }],
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: [{ key: "characters", frame: 1 }]
        });

        this.sound.play("bgm", { loop: true, volume: 0.5 });
        this.scene.start("mainMenuScene");
    }
}
