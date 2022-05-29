import collidable from "../mixins/collidable.js";
import HealthBar from "../hud/HealthBar.js";
import Projectile from "./PlayerProjectile.js";
import Cloud from "./Cloud.js";
import { getTimestamp } from "../utils/functions.js";


//Classe Player : comportement personnage
class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, heroes_available, current_hero, hp){
        super(scene, x,y, "hero_run"); 
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable); 

        //Propriétés à passer de scène en scène
        this.listeHeros = heroes_available; 
        this.currentHeroIndex = current_hero; 
        this.hp = hp; 

        this.init();
        this.initEvents(); 
    }

    init(){
        //Variables personnage
        this.gravity = 500; 
        this.speed = 120; 
        this.jumpSpeed = 200; 
        this.additionalJumps = 1;
        this.jumpCount = 0; 
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.isFalling = false; 
        this.isHovering = false; 
        this.hoveringAvailable = true; 
        this.isDashing = false; 
        this.dir = "right"; 
        this.isHit = false; 
        this.cantMove = false; 
        this.bounceVelocity = 100; 

        this.projectiles = new Phaser.GameObjects.Group;
        this.clouds = new Phaser.GameObjects.Group; 
        this.fireCooldown = 400; 
        this.timeFromLastShot = 0; 

        this.lastSaveX = 0;
        this.lastSaveY = 0; 

        this.auraBox = this.scene.physics.add.sprite(this.x, this.y, 'none')
            .setOrigin(0,0)
            .setAlpha(0)
            .setSize(this.width * 2, this.height * 2)
            .setOffset(-this.width, -this.height*1.2); 

        this.auraBox.active = false; 

        this.windBox = this.scene.physics.add.sprite(this.x, this.y, 'none')
            .setOrigin(0,0)
            .setAlpha(0)
            .setSize(this.width * 12, this.height * 3)
            .setOffset(-this.width * 6, -this.height*2); 

        this.hpBar = new HealthBar(this.scene, this.scene.config.leftTopCorner.x + 5, this.scene.config.leftTopCorner.y + 5, this.hp); 

        //Personnage actif

        this.currentHero = this.listeHeros[this.currentHeroIndex]; 

        this.heroChoice = false; 

     
        //Récupère héro choisi de l'écran de sélection 
        this.scene.events.on('resume', (scene, data) => {
            
            this.currentHeroIndex = data.chosenHero; 
            this.swapCharacter(); 
        });

        //Groupe pour effet dash
        this.dashTrail = this.scene.physics.add.group({ allowGravity: false, collideWorldBounds: true });

        //Physique avec le monde
        this.body.setGravityY(this.gravity);
        this.setDepth(1);  
        this.setCollideWorldBounds(true); 
        this.setSize(16,28);
        this.setOffset(8,5);  
        
        
        //Animations
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNumbers("hero_run", {start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("hero_jump", {start: 0, end: 1}),
            frameRate: 15,
        });

        this.scene.anims.create({
            key: "fall",
            frames: this.scene.anims.generateFrameNumbers("hero_jump", {start: 2, end: 4}),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: "hover",
            frames: this.scene.anims.generateFrameNumbers("hero_jump", {start: 5, end: 5}),
            frameRate: 12,
            repeat: 0
        });

        this.scene.anims.create({
            key: "idle",
            frames: [{ key: 'hero_run', frame: 8 }],
            frameRate: 12,
            repeat: -1
        })
    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    update(time, delta){

          //Dash effect
          if(this.isDashing){
            const silhouette = this.dashTrail.create(this.x, this.y,'hero_run').setPushable(false).setDepth(-1).setAlpha(0.8).setTintFill( 0x62bf76);
            this.scene.tweens.addCounter({
                from: 255,
                to: 0,
                duration: 50,
                onUpdate: function (tween)
                {
                    const valueRB = Math.floor(tween.getValue());
                    const valueG = 115 + Math.floor(Math.floor(tween.getValue())/1.82);
    
                    silhouette.setTintFill(Phaser.Display.Color.GetColor(valueRB, valueG, valueRB));   
                }
            });
            // .setTintFill(0x62bf76)
        }

        this.dashTrail.children.each(function(silouhette) {
            
            silouhette.alpha -= 0.05 ;
            if(silouhette.alpha <= 0){
                silouhette.destroy(); 
            }
   
        }, this);

        


        if(this.cantMove){
            return; 
        }

        //Keys
        const {left, right, up, down, space} = this.cursors;
        const aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        const rKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space); 
        const isUpJustDown = Phaser.Input.Keyboard.JustDown(up); 
        const isAJustDown = Phaser.Input.Keyboard.JustDown(aKey); 
        const isEJustDown = Phaser.Input.Keyboard.JustDown(eKey); 
        const isRJustDown = Phaser.Input.Keyboard.JustDown(rKey); 

        


        const isOnFloor = this.body.onFloor(); 


        this.auraBox.x = this.x;
        this.auraBox.y = this.y; 
        this.windBox.x = this.x;
        this.windBox.y = this.y; 

        //Déplacements
        if(!this.isDashing){
            if (left.isDown){
                //Velocité en fonction du hovering
                if(this.isHovering){
                    this.setVelocityX(-this.speed + this.scene.windVelocity);
                }else{
                    this.setVelocityX(-this.speed);
                }
                
                this.setFlipX(true); 
                this.dir = "left";
            }else if (right.isDown){
                //Velocité en fonction du hovering
                if(this.isHovering){
                    this.setVelocityX(this.speed + this.scene.windVelocity);
                }else{
                    this.setVelocityX(this.speed);
                }

                this.setFlipX(false); 
                this.dir = "right";
            }else {
                //Velocité en fonction du hovering
                if(this.isHovering){
                    this.setVelocityX(this.scene.windVelocity/2);
                }else{
                    this.setVelocityX(0);
                }
               
            }
        }

      

        //Animations en fonction du déplacement
        if(this.body.velocity.y == 0 || isOnFloor){
            if(this.body.velocity.x != 0){
                this.play("run", true); 
            }else{
                this.play("idle"); 
            }
        }
       

        //Reset onFloor
        if(isOnFloor){
            this.jumpCount = 0;
            this.isFalling = false; 
            this.isHovering = false; 
            this.hoveringAvailable = true; 
        }

        
        //Saut et chute 
        if(isUpJustDown && (isOnFloor || this.jumpCount <= this.additionalJumps)){
            if(this.currentHero == "Rain"){
                this.setVelocityY(-this.jumpSpeed * 1.3);    
            }else{
                this.setVelocityY(-this.jumpSpeed);
            }
            
            this.jumpCount++; 
            this.isFalling = false; 

            this.play("jump");  
        }

        if(this.body.velocity.y > 0){
            if(this.currentHero == "Wind" && this.scene.windActive && this.hoveringAvailable){
                this.isFalling = false;
                this.isHovering = true; 
                this.play("hover", true);
                
            }else if(!this.scene.windActive && !this.isFalling){
                this.isHovering = false; 
                this.isFalling = true; 
                this.play("fall", true);
            }else if(!this.hoveringAvailable && !this.isFalling){
                this.isHovering = false; 
                this.isFalling = true; 
                this.play("fall", true);
            }
        }else{
            this.isFalling = false;
            this.isHovering = false; 
        }


         //Dash
         if(isSpaceJustDown && this.currentHero == "Wind"){
            this.hoveringAvailable = false; 
            this.isDashing = true;
            if(this.dir == "left"){
                this.setVelocityX(-this.speed * 3); 
            }else{
                this.setVelocityX(this.speed * 3); 
            }
           
            setTimeout(() => {
                this.isDashing = false;  
            }, 200);
        }

        //Projectile
        if(isSpaceJustDown && this.currentHero == "Sun"){
            if(getTimestamp() - this.timeFromLastShot < this.fireCooldown){ return; }
            const beam = new Projectile(this.scene, this.x, this.y); 
            this.projectiles.add(beam); 
            beam.fire(this); 
            this.timeFromLastShot = getTimestamp(); 
        }


        //Aura
        if(this.currentHero == "Sun"){
            if(rKey.isDown){
                this.auraBox.active = true;
                
            }else{
                this.auraBox.active = false;
            }
        }else{
            this.auraBox.active = false;
        }

        //Spawn nuage
        if(this.currentHero == "Rain"){
            if(isRJustDown){
                const cloud = new Cloud(this.scene, this.x, this.y - 50);
                this.clouds.add(cloud); 
            }
        }

        //Toggle Wind
        if(this.currentHero == "Wind"){
            if(isRJustDown){
                this.toggleWind(this.dir);  
            }
        }

        if(this.scene.windActive && this.isHovering){
            this.body.setMaxVelocityY(20); 
        }else{
            this.body.setMaxVelocityY(500); 
        }

        //  if(isSpaceJustDown ){
        //    this.respawn(); 
        // }



        //Swap Chara Screen

        if(aKey.isDown){
            this.scene.scene.launch('ChooseCharScene',
             {currentHero: this.currentHeroIndex,
              currentScene : this.scene.sceneName,
              listHeroes : this.listeHeros}); 
            this.scene.scene.pause();
        }

    }

    

    swapCharacter(){
        this.currentHero = this.listeHeros[this.currentHeroIndex];
        if(this.currentHero != "Wind"){
            this.stopWind(); 
        }
    }

    addCharacter(characterName){
        this.listeHeros.push(characterName); 
    }

  

    toggleWind(direction){
        if(this.scene.windActive){
            this.stopWind();
        }else{
           this.activateWind(direction); 
        }
        console.log(this.scene.windActive, " : ", this.scene.windVelocity)
    }

    activateWind(direction){
        this.scene.windActive = true;
        if(direction == "left"){
            this.scene.windDirection = "left"; 
            this.scene.windVelocity = -this.scene.maxWindVelocity;
        }else{
            this.scene.windDirection = "right"; 
            this.scene.windVelocity = this.scene.maxWindVelocity; 
        }
        this.scene.windEmitter.start(); 
       
    }

    stopWind(){
        this.scene.windActive = false; 
        this.scene.windVelocity = 0; 
        this.scene.windEmitter.stop(); 
    }

    savePosition(point){
        this.lastSaveX = point.x;
        this.lastSaveY = point.y;      
    }


    respawn(){
        this.body.reset(this.lastSaveX, this.lastSaveY); 
    }

    bounceHit(){
        if(this.body.touching.right){
            this.setVelocityX(-this.bounceVelocity);
        }else{
            this.setVelocityX(this.bounceVelocity);
        }
        setTimeout(() => {
            this.setVelocityY(-this.bounceVelocity);
        }, 50);
    }

    getHit(damages){
        if(!this.isHit){
            this.isHit = true;
            this.cantMove = true; 
            this.bounceHit();
            const tweenBounceAnim = this.playDamageTween(); 

            this.hp -= damages;
            this.hpBar.decrease(this.hp); 
            
            this.scene.time.delayedCall(500, () => {
                this.cantMove = false;  
            });

            this.scene.time.delayedCall(1500, () => {
                this.isHit = false;
                tweenBounceAnim.stop(); 
                this.clearTint(); 
            });

            //  Event à passer dans la scène UI
            this.scene.events.emit('loseHp', this.hp);

        }
    }

    getDragged(caster, player){
       player.cantMove = true;
       player.scene.tweens.add({
            targets: player,
            x: caster.x,
            // y: caster.y,
            duration: 800,
            ease: 'Power2',
             
        });
       setTimeout(() => {
        player.cantMove = false;
       }, 50);
    }


    playDamageTween(){
        return this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 10,
            tint: 0xffffff
        })
    }


}

export default Player;