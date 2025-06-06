// Yahir Rico

class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenuScene");
    }

    create() {
        this.bg = this.add.image(0, 0, "mainmenu").setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        document.getElementById("ui").style.display = "none";

        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height - 100, 
            "Press [SPACE] to Start", 
            {
                fontFamily: "monospace",
                fontSize: "32px",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0);

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("startLevelScene");
        }
    }
}
