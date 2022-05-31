class Preload extends Phaser.Scene{

    constructor(){
        super("PreloadScene");
    }
    
    preload(){
        //PRELOAD DES TILES/MAPS
        this.load.tilemapTiledJSON("map_playground", "/maps/map_playground.json");
        this.load.tilemapTiledJSON("scene_02", "/maps/scene02.json");
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

        //PRELOAD JOUEUR
        this.load.spritesheet("sun_spritesheet", "/assets/player/sun_spritesheet.png",
        {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("rain_spritesheet", "/assets/player/rain_spritesheet.png",
        {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("wind_spritesheet", "/assets/player/wind_spritesheet.png",
        {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("beam_sun", "/assets/player/beam_sun.png",
        {frameWidth: 16, frameHeight: 8});
        this.load.image("wind_dash", "/assets/player/wind_dash.png" )


        //PRELOAD DIVERS
        this.load.image("plant", "/assets/plant.png");
        this.load.image("cloud", "/assets/player/cloud_rain.png");
        this.load.image("drop", "/assets/drop.png");
        this.load.image("fire", "/assets/fire.png");
        this.load.image("smoke", "/assets/smoke.png");
        this.load.image("leaf", "/assets/leaf.png");
        this.load.image("dialogUI", "/assets/dialog.png");
        this.load.image("dialog_sun", "/assets/dialog_sun.png");
        this.load.image("dialog_rain", "/assets/dialog_rain.png");
        this.load.image("dialog_wind", "/assets/dialog_wind.png");
        this.load.image("choose_sun", "/assets/choose_sun.png");
        this.load.image("choose_rain", "/assets/choose_rain.png");
        this.load.image("choose_wind", "/assets/choose_wind.png");
        this.load.image("choose_screen", "/assets/chooseScreen.png");
        this.load.image("hpUI", "/assets/ui_life.png");
        this.load.image("bg", "/assets/bg_tempo.png"); 


        this.load.spritesheet("platform", "/assets/objects/platform.png",
        {frameWidth: 41, frameHeight: 13});
        this.load.spritesheet("growing_plant", "/assets/objects/growing_plant2.png",
        {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet("plant_platform", "/assets/objects/plant_platform_spritesheet.png",
        {frameWidth: 60, frameHeight: 21});


        this.load.image("beam_particles", "/assets/beam_particles.png");
        this.load.image("light_particles", "/assets/light_particles.png");

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
        this.scene.start("PlayScene",{
            heroes_available: ["Sun"],
            current_hero : 0,
            hero_hp : 150
        });
        this.scene.launch("UIScene"); 

    }

}

export default Preload;