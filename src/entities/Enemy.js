import collidable from "../mixins/collidable.js";


//Classe Enemy : comportement Ennemis
class Enemy extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, sprite){
        super(scene, x,y, sprite); 
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        //Mixins collisions
        Object.assign(this, collidable); 

        this.init();
        this.initEvents(); 
    }

    init(){
        //Variables entité
        this.gravity = 500; 
        this.speed = 50; 
        this.timeFromLastTurn = 0; 

        this.damages = 20; 
        this.attackDamages = 0; 

        this.hp = 1; 
        

        this.rayGraphics = this.scene.add.graphics();
        this.rayGraphics.lineStyle(1, 0xaa00aa); 

        //Physique avec le monde
        this.body.setGravityY(this.gravity); 
        this.setCollideWorldBounds(true);  
        this.setImmovable(true); 
        this.platformCollidersLayer = null; 
        
        
    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    update(time,delta){
        this.patrol(time,delta); 
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

    getHit(){
        this.hp -= 1; 
        this.playDamageTween(); 
        this.scene.time.delayedCall(500, () => {
            this.clearTint(); 
        });

        if(this.hp <= 0){
            this.rayGraphics.destroy(); 
            this.destroy();

            //VISUAL EFFECT PARTICLES
        }
    }

    playDamageTween(){
        return this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 2,
            tint: 0xff0000
        })
    }

    setPlatformColliders(layer){
        this.platformCollidersLayer = layer; 
    }

}

export default Enemy;