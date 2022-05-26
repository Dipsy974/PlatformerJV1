import Player from "/src/entities/Player.js";
import Enemy from "/src/entities/Enemy.js";
import Tornado from "/src/entities/Tornado.js";
import TCloud from "../entities/ThunderCloud.js";
import STCloud from "../entities/StaticThunderCloud.js";
import MovingPlatform from "../entities/MovingPlatform.js";
import Plant from "../entities/Plant.js";
import FirePlace from "../entities/FirePlace.js";



class Play extends Phaser.Scene{

    constructor(config){
        super("PlayScene");
        this.config = config;  
    }
    


    create(){
        //Dimensions de la scène actuelle (déterminée dans Tiled)
        this.MAP_WIDTH = 960;
        this.MAP_HEIGHT = 640; 
        const zoom = this.config.zoomFactor; 


        //Creation de la scene : map + layers
        const map = this.createMap();  
        const layers = this.createLayers(map); 
        const playerPoints = this.getPlayerPoints(layers.playerPoints); 
        const endZone = this.createEnd(playerPoints.end); 
       
 
       
        //Creation joueur
        this.player = this.createPlayer(playerPoints); 
        //ajout colliders au joueur
        this.player.addCollider(layers.layer_ground); 
        this.player.addOverlapOnce(endZone,this.endLevel); 

       

         //Creation enemies
         const enemies = this.createEnemies(layers.enemiesSpawns, layers.layer_ground); //On passe aussi les plateformes en paramètres pour gérer le raycasting
         //ajout colliders aux ennemies
         this.physics.add.collider(enemies, layers.layer_ground);
         this.physics.add.collider(enemies, this.player, this.onPlayerCollision);
         this.physics.add.collider(enemies, this.player.projectiles, this.onProjectileCollision);



         
         const myCheckpoints = this.createCheckpoint(layers.checkPointsLayer); 
         this.physics.add.overlap(this.player, myCheckpoints, this.onCheckpointCollision);

         const movingPlatforms = this.createMovingPlatforms(layers.layer_platforms); 
         this.physics.add.collider(this.player, movingPlatforms);
         this.physics.add.overlap(this.player.auraBox, movingPlatforms, this.onAuraOverlap);

         this.plants = this.createPlants(layers.layer_plants); 

         this.firePlaces = this.createFirePlaces(layers.layer_fires); 
         
     
        //WIND FORCE
        this.windActive = false; 
        this.windDirection = "left"; 
        this.maxWindVelocity = 60; 
        this.windVelocity = 0; 

        
      
        //  this.light = this.lights.addLight(this.player.x, this.player.y, 70).setIntensity(3); 
        //  this.lights.enable().setAmbientColor(0x555555);
         

        //ENVIRONNEMENT DE TEST
        //let { width, height } = this.sys.game.canvas;
    
        for(var i = 0; i < this.MAP_WIDTH; i = i + 16){
            this.add.line(0, 0, i, 0, i, this.MAP_HEIGHT, 0x00ff00, 0.1).setOrigin(0); 
        }
        for(var y = 0; y < this.MAP_HEIGHT; y = y + 16){
            this.add.line(0, 0, 0, y, this.MAP_WIDTH, y, 0x00ff00, 0.1).setOrigin(0); 
        }

        this.playerHV = this.add.text(470, 270,  ";" ).setScrollFactor(0); 
        this.currentPlayer = this.add.text(520, 270,  ";" ).setScrollFactor(0); 



        //FIN ENVIRONNEMENT DE TEST

        //Limites monde et caméra
        this.cameras.main.setBounds(0,0, this.MAP_WIDTH, this.MAP_HEIGHT); 
        this.cameras.main.setZoom(zoom); 
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.followOffset.y =  10; 
        this.physics.world.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
        
    }


    finishDrawing(pointer, layer){
        
        this.raycastLine.x2 = pointer.worldX;
        this.raycastLine.y2 = pointer.worldY;
        this.graphics.clear(); 
        this.graphics.lineStyle(1,0x00ff00, 1);
        this.graphics.strokeLineShape(this.raycastLine); 

        this.tileHits = layer.getTilesWithinShape(this.raycastLine); 

        if(this.tileHits.length > 0){
            this.tileHits.forEach(tile => {
                if(tile.index != -1){
                   tile.setCollision(false);   
                }
            });
        }

        this.drawDebug(layer); 
        this.isDrawing = false; 
    }

    onPlayerCollision(enemy, player){
        player.getHit(enemy); 
    }

    onProjectileCollision(enemy, projectile){
        enemy.getHit(); 
        projectile.hit(enemy); 
    }

    onAuraOverlap(aura, platform){
        if(aura.active){
            platform.setActive(); 
        }else{
            platform.setInactive();
        }
    }

    


    //Creation de la map
    createMap(){
        const map = this.make.tilemap({key: "map_playground"});
        map.addTilesetImage("tileset", "tileset"); //Le premier est le nom du tileset sous Tiled et dans jSon, le deuxième est la clé du png utilisé

        return map; 
    }

    //Creation des layers
    createLayers(map){
        const tileset = map.getTileset("tileset"); //Accède au tileset de la tilemap
        const layer_ground = map.createLayer("ground", tileset); //Un layer peut etre fait avec plusieurs tileset
        const layer_decor = map.createLayer("decor", tileset);
        const playerPoints = map.getObjectLayer('player_points');
        
        const enemiesSpawns = map.getObjectLayer("ennemies_points");

        const checkPointsLayer = map.getObjectLayer('checkpoints');

        const layer_platforms = map.getObjectLayer("moving_platforms"); 

        const layer_plants = map.getObjectLayer("plants_points"); 

        const layer_fires = map.getObjectLayer("fire_points"); 

        layer_ground.setCollisionByExclusion(-1, true); 

        return {layer_decor, layer_ground, playerPoints, enemiesSpawns, checkPointsLayer, layer_platforms, layer_plants, layer_fires}; 
    }

    createPlayer(playerPoints){
        return new Player(this, playerPoints.start.x, playerPoints.start.y);
    }

    getPlayerPoints(layer){
        const playerPoints = layer.objects;
        return {
            start: playerPoints[0],
            end: playerPoints[1]
        }
    }

    createEnd(end){
        const endLevel = this.physics.add.sprite(end.x, end.y, 'none')
            .setOrigin(0,0)
            .setAlpha(0)
            .setSize(5, this.MAP_HEIGHT*2); 
        return endLevel; 
    }

    createEnemies(layer, platformsLayer){
        const enemies = new Phaser.GameObjects.Group; 
        
        layer.objects.forEach(spawn => {
            let enemy = null; 
            if(spawn.type == "Tornado"){
                enemy = new Tornado(this,spawn.x, spawn.y);
                
                
            }else if(spawn.type == "Cloud"){
                enemy = new TCloud(this,spawn.x, spawn.y);
                enemy.detectionBox.addOverlap(this.player, () => {enemy.setTarget(this.player), this});     
                enemy.attackBox.addOverlap(this.player, this.onPlayerCollision);     
            }else if(spawn.type == "StaticCloud"){
                enemy = new STCloud(this,spawn.x, spawn.y);    
                enemy.attackBox.addOverlap(this.player, this.onPlayerCollision);     
            } 
            enemy.setPlatformColliders(platformsLayer); 
            enemies.add(enemy); 
            
        }); 

        return enemies; 
    }

    createMovingPlatforms(layer){
        const platforms = new Phaser.GameObjects.Group; 
        
        layer.objects.forEach(pltf => {
            let platform = new MovingPlatform(this, pltf.x, pltf.y, pltf.properties[0].value, pltf.properties[1].value, pltf.properties[2].value);  
            platforms.add(platform); 
            
        }); 

        return platforms; 
    }

    createPlants(layer){
        const plants = new Phaser.GameObjects.Group; 
        
        layer.objects.forEach(plt => {
            let plant = new Plant(this, plt.x, plt.y, plt.properties[0].value); 
            plants.add(plant);      
        }); 

        return plants; 
    }

    createFirePlaces(layer){
        const fires = new Phaser.GameObjects.Group; 
        
        layer.objects.forEach(fr => {
            let fire = new FirePlace(this, fr.x, fr.y); 
            fires.add(fire);      
        }); 

        return fires; 
    }

    checkPlantsWatered(particle){
        this.plants.children.each(function(plant) {
            if((particle.x > plant.x && particle.x < plant.x + plant.width) && (particle.y > plant.y && particle.y < plant.y + plant.height) ){

                particle.lifeCurrent = 0; 
                plant.grow();  
            }
        }, this);
    }


    createCheckpoint(layer){
        const groupCheckpoint = new Phaser.GameObjects.Group; 

        layer.objects.forEach(checkpoint => {
            const cp = this.physics.add.sprite(checkpoint.x, checkpoint.y, 'none')
            cp.setOrigin(0,0)
            cp.setAlpha(0)
            cp.setSize(5, 2000); 
           

            groupCheckpoint.add(cp); 
        })

        return groupCheckpoint; 
    }

    onCheckpointCollision(player, checkpoint){
        player.savePosition(checkpoint);
    }

   
    endLevel(){
        console.log("Bravo"); 
    }

    update(){
        //ENVIRONNEMENT DE TEST
        //Position joueur en tiles
       let playerH = Math.round(this.player.x/16);
       let playerV = Math.round(this.player.y/16);
       this.playerHV.setText(playerH + ";" + playerV);
       this.currentPlayer.setText(this.player.currentHero);

      
      
    //    this.light.x = this.player.x;
    //    this.light.y = this.player.y;

        //FIN ENVIRONNEMENT DE TEST
    }

}

export default Play;