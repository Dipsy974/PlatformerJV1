
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
        if(!this.active){return ;}
        this.play("enemy_run", true); 
        
    }

   
}

export default Tornado;