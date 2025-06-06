// Yahir Rico

class GameEnd extends Phaser.Scene {
    constructor() {
        super("gameEndScene");
    }

    preload() {
        this.load.image("gameEndBG", "assets/gameEnd.png");
    }

    create() {
        document.getElementById("ui").style.display = "none";

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "gameEndBG")
            .setOrigin(0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const resultsText = `Total Coins Collected: ${totalCoins}\nTotal Deaths: ${deathCount}`;
        this.add.text(centerX, centerY + 250, resultsText, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(centerX, centerY + 335, "Press [R] to Restart", {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.rKey = this.input.keyboard.addKey('R');
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            totalCoins = 0;
            deathCount = 0;
            document.getElementById("ui").style.display = "flex";
            document.getElementById("coinCounter").innerText = `Coins: 0`;
            document.getElementById("deathCounter").innerText = `Deaths: 0`;
            this.scene.start("startLevelScene");
        }
    }
}
