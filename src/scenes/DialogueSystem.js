import "../data/dialogs_data.js"
import { getDialogs } from "../data/dialogs_data.js";

class DialogueSystem extends Phaser.Scene{

    constructor(config){
        super("DialogueSystem");
        this.config = config; 
    }
    
    init(data){ 
        this.nbDialog = data.nbDialog; //Numéro du dialogue à lancer, récupéré de la scène de jeu
        this.sceneNameData = data.currentScene;
        this.currentChoice = data.currentHero; //Garde en mémoire le personnage selectionné, quand la scène en cours est resume
    }

    create(){
        this.scene.bringToTop(); 

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.SCREEN_WIDTH = this.config.width;
        this.SCREEN_HEIGHT = this.config.height;

        this.dialogBox = this.physics.add.sprite(180 , this.SCREEN_HEIGHT/2 - 50, "dialogUI").setOrigin(0).setScrollFactor(0); 
        this.dialogueText = this.add.text(400, this.SCREEN_HEIGHT/2 +50, 'Dialogue ici', { fontSize: '20px', color:"white"});
        this.dialogueName = this.add.text(400, this.SCREEN_HEIGHT/2 , 'Dialogue ici', { fontSize: '40px', color:"white"});
        this.dialogueAvatar = this.physics.add.sprite(300 , this.SCREEN_HEIGHT/2 +50, "dialog_sun").setOrigin(0);

        

        this.currentDialog = getDialogs()[this.nbDialog]; 
        this.dialogStep = 0; 
        this.soloStep = 0; 

        this.dialogueName.setText(this.currentDialog[this.dialogStep].name); 
        this.dialogueText.setText(this.currentDialog[this.dialogStep].words[this.soloStep]);
        this.dialogueAvatar.setTexture(this.currentDialog[this.dialogStep].avatar);

    }


    update(){
        const {left, right, up, down, space} = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space); 

        if(isSpaceJustDown){
            this.nextLine();
        }
      
    }

    nextLine(){
        this.soloStep += 1;

        if(this.currentDialog[this.dialogStep].words.length > this.soloStep){
            this.dialogueName.setText(this.currentDialog[this.dialogStep].name); 
            this.dialogueText.setText(this.currentDialog[this.dialogStep].words[this.soloStep]);
            this.dialogueAvatar.setTexture(this.currentDialog[this.dialogStep].avatar);
        }else{
            this.soloStep = 0; 
            this.dialogStep += 1; 
            if(this.currentDialog.length > this.dialogStep){
                this.dialogueName.setText(this.currentDialog[this.dialogStep].name); 
                this.dialogueText.setText(this.currentDialog[this.dialogStep].words[this.soloStep]);
                this.dialogueAvatar.setTexture(this.currentDialog[this.dialogStep].avatar);
            }else{
                this.scene.resume(this.sceneNameData, {chosenHero : this.currentChoice});
                this.scene.stop();
            }
        }  
        
    }

}

export default DialogueSystem;