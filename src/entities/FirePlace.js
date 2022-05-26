class FirePlace extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y){
        super(scene, x,y, "none"); 
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        this.init(); 
        this.initEvents(); 

    }

    init(){
        this.setSize(32,8); 
        // this.setOrigin(0); 
        this.setVisible(false); 

        this.particles = this.scene.add.particles('fire');
        this.startParticleZone = this.x - this.width/2 + 3;
        this.endParticleZone = this.x + this.width/2 - 3;

        this.particleEmmiter = this.particles.createEmitter({
            
            x: {min: this.startParticleZone, max: this.endParticleZone},
            y: this.y + this.height/4,
            lifespan: 500,
            speedY: { min: -60, max: -100 },
            scale: { start: 0.8, end: 0.1 },
            quantity: 5,
            blendMode: "ADD", 
            
        });
        this.particles.setDepth(-1); 


    }

    initEvents(){
        //Ecoute la fonction update de la scène et appelle la fonction update de l'objet
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this); 
    }

    preUpdate(time, delta){
        super.preUpdate(time,delta);

       
    }

    update(time, delta){
        if(!this.body){ return; }
        
        for(const particle of this.particleEmmiter.alive){
            
        }
    }


}

export default FirePlace; 