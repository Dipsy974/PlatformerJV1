import SpriteEffect from "../entities/SpriteEffect.js";

class Projectile extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, "sun_projectile");

        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        this.init();
        
    }

    init(){
        this.speed = 250; 
        this.maxDistance = 150;
        this.traveledDistance = 0; 
        this.dir = null; 
         
        
        //Animations
        this.scene.anims.create({
            key: "projectile",
            frames: this.scene.anims.generateFrameNumbers("sun_projectile", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });
    }

    preUpdate(time, delta){
        super.preUpdate(time,delta); 
        console.log(this.body.velocity.x)
        this.traveledDistance += this.body.deltaAbsX();
        if(this.traveledDistance >= this.maxDistance){
            this.destroy(); 
        }
       
    }

    fire(caster){
    
        if(caster.dir == "right"){
            this.dir = "right"; 
            this.x = caster.x + 15; 
            this.setVelocityX(this.speed); 
        }else if(caster.dir == "left"){
            this.dir= "left";
            this.x = caster.x - 15;
            this.setFlipX(true); 
            this.setVelocityX(-this.speed); 
        }
        
        this.anims.play("projectile"); 
    }

    hit(target){
        new SpriteEffect(this.scene, 0,0, "projectile_impact").playOn(target, this.y);
        if(target.protected){
            this.getDeflected(); 
        }else{
            this.destroy();
        }
    }

    getDeflected(){
        if(this.dir == "right"){
            this.setVelocityX(-this.speed); 
            this.setFlipX(true); 
            this.dir= "left";
        }else{
            this.setVelocityX(this.speed); 
            this.setFlipX(false); 
            this.dir= "right";
        }
        this.maxDistance = 500; 
    }

}

export default Projectile; 