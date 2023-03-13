import { managerblock} from "./managerblock.js";
import { managerkey} from "./managerkey.js";

export class managergame{
    static instance = new managergame()
    static getinstance(){
        return this.instance;
    }

    start($tetris){
        managerkey.getinstance().start();
        managerblock.getinstance().start($tetris);
    }

    update(){
        managerblock.getinstance().update();
        
    }
    
    draw(){
        managerblock.getinstance().draw();
    }

    // over(){
    //     managerblock.getinstance().gamestart();
        
    // }
};
