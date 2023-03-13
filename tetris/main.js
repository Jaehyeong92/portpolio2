import {managergame} from "./managergame.js";
import {managerblock} from "./managerblock.js";

function draw(){
    managergame.getinstance().update();
    managergame.getinstance().draw();
    //managerblock.getinstance().gamestart()
}

var $tetris = document.querySelector("#tetris");
managergame.getinstance().start($tetris);
setInterval(draw, 10);
 

