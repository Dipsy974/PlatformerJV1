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

        this.traveledDistance += this.body.deltaAbsX();
        if(this.traveledDistance >= this.maxDistance){
            this.destroy(); 
        }
    }

    fire(caster){
    
        if(caster.dir == "right"){
            this.x = caster.x + 15; 
            this.setVelocityX(this.speed); 
        }else if(caster.dir == "left"){
            this.x = caster.x - 15;
            this.setFlipX(true); 
            this.setVelocityX(-this.speed); 
        }
        
        this.anims.play("projectile"); 
    }

    hit(target){
        new SpriteEffect(this.scene, 0,0, "projectile_impact").playOn(target, this.y);
        this.destroy();

    }

}

export default Projectile; 