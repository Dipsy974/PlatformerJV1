
import Enemy from "./Enemy.js";
import collidable from "../mixins/collidable.js";

//Classe Static Thunder Cloud : comportement Ennemi 03
class STCloud extends Enemy{

    constructor(scene, x, y){
        super(scene, x,y, "enemy2_run"); 
        this.init(); 
    }

    init(){
        super.init(); 
        //Variables entité
        this.gravity = 0; 
        this.speed = 0; 
        this.maxAttackDelay = 100;
        this.attackDelay = this.maxAttackDelay; 
        this.attackDamages = 30; 

        this.attackBox = this.scene.physics.add.sprite(this.x, this.y + this.height*1.4, 'eclair')
            // .setOrigin(0,0)
            .setAlpha(0)
            .setScale(1.5)
            .setSize(this.width/2, 2)
            .setOffset(0, 0); 

        this.attackBox.damages = this.attackDamages; 

        Object.assign(this.attackBox, collidable); 


        //State
        this.states = [
            "PASSIF",
            "ATTACKING",
            "CASTING"
        ];
        this.currentState = "PASSIF"; 

        //Physique avec le monde
        this.body.setGravityY(this.gravity); 
        this.setSize(30,26);
        this.setOffset(1,6);  
 

        
        //Animations
        this.scene.anims.create({
            key: "enemy2_run",
            frames: this.scene.anims.generateFrameNumbers("enemy2_run", {start: 0, end: 1}),
            frameRate: 7,
            repeat: -1
        });

        this.scene.anims.create({
            key: "thunder_struck",
            frames: this.scene.anims.generateFrameNumbers("eclair", {start: 0, end: 5}),
            frameRate: 20,
            repeat : 0
        });
        this.scene.anims.create({
            key: "enemy2_cast",
            frames: this.scene.anims.generateFrameNumbers("enemy2_run", {start: 2, end: 5}),
            frameRate: 5,
            repeat : 0
        });
    }

    update(time,delta){
        super.update(time,delta);
        if(!this.active){return ;}
        if(this.currentState != "CASTING"){
            this.play("enemy2_run", true); 
        }

        this.attackBox.x = this.x; 
        this.attackDelay -= 1; 
        

        if(this.attackDelay <= 40){
            this.currentState = "CASTING";
            this.play("enemy2_cast", true); 
        }


        if(this.attackDelay <= 0){
            
            this.thunderAttack(this.target); 
            this.attackDelay = this.maxAttackDelay; 
            this.currentState = "ATTACKING"; 
            // Enlève l'animation de l'éclair
            setTimeout(() => {
                this.attackBox.setAlpha(0);
                this.attackBox.setSize(this.width/2, 2); 
                this.attackBox.setOffset(0, 0); 
            }, 300);
            // Met le nuage en état PASSIF
            setTimeout(() => {
                this.currentState = "PASSIF"; 
            }, 800);
                 
        }

    }


    thunderAttack(target){
        this.attackBox.setAlpha(1); 
        this.attackBox.setSize(this.width/2, 50); 
        this.attackBox.anims.play("thunder_struck");

    }

    getHit(){
        this.hp -= 1; 
        this.playDamageTween(); 
        this.scene.time.delayedCall(500, () => {
            this.clearTint(); 
        });

        if(this.hp <= 0){
            this.rayGraphics.destroy(); 
            this.attackBox.destroy();
            this.destroy();

            //VISUAL EFFECT PARTICLES
        }
    }

   
}

export default STCloud;