
import Enemy from "./Enemy.js";

//Classe Tornado : comportement Ennemi 01 
class Tornado extends Enemy{

    constructor(scene, x, y){
        super(scene, x,y, "enemy_run"); 
        this.init(); 
    }

    init(){
        super.init(); 
        //Variables entité
        this.speed = 50; 
        this.setVelocityX(this.speed); 


        //Physique avec le monde
        this.setSize(22,26);
        this.setOffset(3,6); 
 
        
        
        //Animations
        this.scene.anims.create({
            key: "enemy_run",
            frames: this.scene.anims.generateFrameNumbers("enemy_run", {start: 0, end: 4}),
            frameRate: 10,
            repeat: -1
        });
    }

    update(time,delta){
        super.update(time,delta);
        this.patrol(time,delta); 
        if(!this.active){return ;}
        this.play("enemy_run", true); 
        
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

   
}

export default Tornado;