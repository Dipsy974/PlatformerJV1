class Preload extends Phaser.Scene{

    constructor(){
        super("PreloadScene");
    }
    
    preload(){
        //PRELOAD DES TILES/MAPS
        this.load.tilemapTiledJSON("map_playground", "/maps/map_playground.json");
        this.load.image("tileset", "/assets/tileset.png");
        //this.load.image("hero", "/assets/hero.png"); 

        //PRELOAD JOUEUR
        this.load.spritesheet("hero_run", "/assets/player/chara01_run.png",
        {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("hero_jump", "/assets/player/chara01_jump.png",
        {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("sun_projectile", "/assets/player/sun_projectile.png",
        {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("projectile_impact", "/assets/player/projectile_impact.png",
        {frameWidth: 16, frameHeight: 16});


        //PRELOAD DIVERS
        this.load.image("plant", "/assets/plant.png");
        this.load.image("plant_platform", "/assets/plant_platform.png"); 
        this.load.image("cloud", "/assets/cloud.png");
        this.load.image("drop", "/assets/drop.png");
        this.load.image("fire", "/assets/fire.png");
        this.load.image("smoke", "/assets/smoke.png");
        this.load.image("leaf", "/assets/leaf.png");
        this.load.spritesheet("platform", "/assets/platform.png",
        {frameWidth: 32, frameHeight: 8});
        this.load.spritesheet("growing_plant", "/assets/growing_plant.png",
        {frameWidth: 16, frameHeight: 16});

        //PRELOAD ENNEMIS
        this.load.spritesheet("enemy_run", "/assets/enemy/enemy01_run.png",
        {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet("enemy2_run", "/assets/enemy/enemy02_run.png",
        {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet("eclair", "/assets/enemy/eclair.png",
        {frameWidth: 16, frameHeight: 48});

        this.load.spritesheet("enemy3_idle", "/assets/enemy/enemy03_idle.png",
        {frameWidth: 16, frameHeight: 32});

        this.load.spritesheet("enemy4_run", "/assets/enemy/enemy04_run.png",
        {frameWidth: 16, frameHeight: 32});
    }

    create(){
        this.scene.start("PlayScene");
    }

}

export default Preload;