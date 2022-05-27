
import Enemy from "./Enemy.js";

//Classe Caster : comportement Ennemi 
class Caster extends Enemy{

    constructor(scene, x, y, facing){
        super(scene, x,y, "enemy3_idle"); 

        this.facingLeft = facing; 

        this.init(); 
    }

    init(){
        super.init(); 
        //Variables entité
        this.speed = 0; 
        this.hp = 2; 
        this.setVelocityX(this.speed); 
        this.setFlipX(this.facingLeft); 

        this.castCooldown = 200; 
        this.lastCast = this.castCooldown; 

        if(this.facingLeft){
            this.tornadoVelocity = -100;
        }else{
            this.tornadoVelocity = 100;
        }

        this.tornadoLifespan = 3000; 

        //Physique avec le monde
        this.setSize(22,26);
        this.setOffset(3,6); 
 
        
        
        //Animations
        this.scene.anims.create({
            key: "enemy3_idle",
            frames: this.scene.anims.generateFrameNumbers("enemy3_idle", {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });
    }

    update(time,delta){
        super.update(time,delta);
        if(!this.active){return ;}
        this.play("enemy3_idle", true); 


        this.lastCast -= 1;

        if(this.lastCast <= 0){
            this.castTornado();
            this.lastCast = this.castCooldown; 
        }
        
    }

    castTornado(){
        const tornado = this.scene.physics.add.sprite(this.x, this.y, "enemy_run");
        tornado.setImmovable(true);
        tornado.setGravityY(false); 
        tornado.setScale(2); 
        tornado.setVelocityX(this.tornadoVelocity); 
        tornado.setDepth(0); 
        this.scene.physics.add.overlap(tornado, this.scene.player, this.scene.player.getDragged); 
        setTimeout(() => {
            tornado.destroy(); 
        }, this.tornadoLifespan);
      
    }

   
}

export default Caster;