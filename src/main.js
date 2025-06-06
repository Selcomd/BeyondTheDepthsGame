// Yahir Rico

"use strict"

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 1440,
    height: 900,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: { pixelArt: true },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Load, MainMenu, StartLevel, Platformer, GameEnd]
};

var cursors;
const SCALE = 2.0;
var my = { sprite: {}, text: {}, vfx: {} };

let totalCoins = 0;
let deathCount = 0;

const game = new Phaser.Game(config);
