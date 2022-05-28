
import Enemy from "./Enemy.js";

//Classe ProtectedEnemy : comportement Ennemi 
class ProtectedEnemy extends Enemy{

    constructor(scene, x, y){
        super(scene, x,y, "enemy4_run"); 
        this.init(); 
    }

    init(){
        super.init(); 
        //Variables entité
        this.speed = 30; 
        this.protected = true; 
        this.protectionDuration = 100; 
        this.hp = 2; 


        //Physique avec le monde
        this.setSize(22,26);
        this.setOffset(3,6); 
        this.setVelocityX(this.speed); 
 
        
        
        //Animations
        this.scene.anims.create({
            key: "enemy3_idle",
            frames: this.scene.anims.generateFrameNumbers("enemy3_idle", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "enemy4_run",
            frames: this.scene.anims.generateFrameNumbers("enemy4_run", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });


        this.protectionParticles = this.scene.add.particles('leaf');
        this.protectionEmitter = this.protectionParticles.createEmitter({
            
            x: this.x,
            y: this.y,
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 }, 
            lifespan: 300,
            scale: { start: 2, end: 1 },
            quantity : 10, 
            frequency: 10, 
            on:  false, 
              
        });
    }

    update(time,delta){
        super.update(time,delta);
        this.patrol(time,delta); 
        if(!this.active){return ;}
        if(this.protected){
            this.play("enemy4_run", true); 
        }

       this.protectionEmitter.setPosition(this.x, this.y); 
   
        
    }

    patrol(time,delta){
        // Pour éviter les erreurs : ne lance pas le raycasting si pas de body ou si ennemi dans les airs
        if(!this.body || !this.body.onFloor()){
            return; 
        }

        //Raycasting pour changer direction ennemi quand près d'un rebord 
        const {ray, isHitting} = this.raycast(this.body, this.platformCollidersLayer , 30, 2, 1); 
        this.rayGraphics.clear(); 
        this.rayGraphics.strokeLineShape(ray); 

        //Threshold de 100ms pour ne pas répéter l'action Turn plein de fois d'affilé
        if(!isHitting && this.timeFromLastTurn + 1000 < time){
            this.setFlipX(!this.flipX); 
            this.setVelocityX(this.speed = -this.speed); 
            this.timeFromLastTurn = time; 
        }
    }

    getHit(projectile){
   

        if(!this.protected){
            super.getHit(projectile); 
        }
    }

    loseProtection(){
        this.play("enemy3_idle", true); 
        this.protectionDuration -= 1; 
        if(this.protectionDuration <= 0){
            this.protected = false; 
            this.protectionEmitter.explode(); 
        }   
    }

   
}

export default ProtectedEnemy;