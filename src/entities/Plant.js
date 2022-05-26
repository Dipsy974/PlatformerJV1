class Plant extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, size){
        super(scene, x,y, "plant"); 
        scene.add.existing(this); //Ajoute l'objet à la scène 
        scene.physics.add.existing(this); //Donne un physic body à l'objet

        this.maxSize =  size;   
        this.init(); 
        this.initEvents(); 

    }

    init(){
        this.size = 1;
        this.isGrowing = false; 
      
        this.setOrigin(0);
        
        
        //Animations
        this.scene.anims.create({
            key: "growing",
            frames: this.scene.anims.generateFrameNumbers("growing_plant", {start: 0, end: 3}),
            frameRate: 10,
        });



    }

    initEvents(){

    }

    grow(){
        if(!this.isGrowing){
            this.anims.play("growing"); 
            this.isGrowing = true;
            this.on('animationcomplete', () => {
                if(this.size < this.maxSize){
                    this.addNewStem(this);
                }else{
                    this.addPlantPlatform(this);
                }
            });
           
        }   
    }

    addNewStem(previousPlant){
        this.size += 1; 
        const newStem = this.scene.physics.add.sprite(previousPlant.x, previousPlant.y - previousPlant.height, "growing_plant").setOrigin(0);
        newStem.anims.play("growing"); 
        newStem.on('animationcomplete', () => {
            if(this.size < this.maxSize){
                this.addNewStem(newStem);
            }else{
                this.addPlantPlatform(newStem);
            }
            
        });
    }

    addPlantPlatform(previousPlant){
        const plantPlatform = this.scene.physics.add.sprite(previousPlant.x - previousPlant.width/2, previousPlant.y - previousPlant.height/2, "plant_platform");
        plantPlatform.setOrigin(0); 
        plantPlatform.setImmovable(true); 
        this.scene.physics.add.collider(this.scene.player, plantPlatform); 
    }


}

export default Plant; 