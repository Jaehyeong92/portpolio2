import { managerkey } from "./managerkey.js";
import { nodeblock } from "./nodeblock.js";

export class managerblock{
    static instance = new managerblock()
    static getinstance(){
        return this.instance;
    }
    start($tetris){
        this.$tetris = $tetris;
        this.blocklist = [];
        this.datalist = [];
        this.curblock = null;
        this.cury = 1;
        this.curx = 4;
        this.colorlist = ["w", "r", "o", "y", "g", "b", "n", "v", "" , "" ,  "dg" , "black"];
        this.WHITE = 0;
        this.BOX = 10;
        this.BLACK = 11;
        this.TIMER = 0;

        var sampleblocklist = this.getsample();
        for (var i = 0; i < sampleblocklist.length; i++){
            var sample = sampleblocklist[i];
            var block = new nodeblock(sample.name, sample.index, sample.color, sample.shape);
            this.blocklist.push(block);
        }

        console.log(this.blocklist);

        for (var y = 0; y < 22; y++){
            var tr = document.createElement("tr");
            this.$tetris.append(tr);
            var temp = []
            for (var x = 0; x < 12; x++) {
                var td = document.createElement("td");
                tr.append(td);
                temp.push(this.WHITE);
            }
            this.datalist.push(temp);
        }

        for (var i = 0; i < 12; i++){
            this.datalist[0][i] = this.BOX;
            this.datalist[21][i] = this.BOX;
            this.$tetris.children[0].children[i].classname = this.colorlist[this.BOX];
            this.$tetris.children[21].children[i].classname = this.colorlist[this.BOX];
        }

        for (var i = 0; i < 22; i++){
            this.datalist[i][0] = this.BOX;
            this.datalist[i][11] = this.BOX;
            this.$tetris.children[i].children[0].classname = this.colorlist[this.BOX];
            this.$tetris.children[i].children[11].classname = this.colorlist[this.BOX];
        }

        this.makeblock();
        
    
    }

    update(){
      


        this.TIMER += 1; // 100 => 
        if(this.TIMER >= 100){
          this.TIMER = 0;
          this.gamestart();
          if( this.down() == false){
            this.lineclear();
            this.makeblock();
          }
        }
        if(managerkey.getinstance().getkeyonce("KeyS")){
            if (this.down() == false){
                this.lineclear();
                this.makeblock();
            }
        }
        if(managerkey.getinstance().getkeyonce("KeyA")){
            this.left();
            //console.log(managerkey.getinstance().getkeyonce("KeyA"))
        }
        if(managerkey.getinstance().getkeyonce("KeyD")){
            this.right();
            //console.log(managerkey.getinstance().getkeyonce("KeyD"))
        }
        if(managerkey.getinstance().getkeyonce("KeyW")){
            this.rotate();
        }
        if(managerkey.getinstance().getkeyonce("Space")){
            while(this.down()){}
            this.lineclear();
            this.makeblock();
        }
    }

    lineclear(){
        var del = [];
        for(var y = 1; y < 22 - 1; y++){
            var count = 0;
            for(var x = 1; x < 12 - 1; x++){
                if(this.datalist[y][x] == this.BLACK){
                    count += 1
                }
                if(count === 10){
                    del.push(y);
                }
            }
        }
        console.log(del);
        for(var i = 0; i < del.length; i++){
            this.datalist.splice(del[i],1);
            this.datalist.splice(0 , 1);
            this.datalist.unshift([this.BOX,0,0,0,0,0,0,0,0,0,0,this.BOX]);
            this.datalist.unshift([10,10,10,10,10,10,10,10,10,10,10,10]);
        }
    }

    draw() {

        for(var y = 0; y < 22; y++) {
            for (var x = 0; x < 12; x++) {
                var index = this.datalist[y][x];
                this.$tetris.children[y].children[x].className = this.colorlist[index];
            }
        }
    }

    rotate() {
        var curshape = this.curblock.shape[this.curblock.index];
        var nextindex = this.curblock.index + 1;
        nextindex %= 4;
        var nextshape = this.curblock.shape[nextindex];
        var currealblock = this.getrealblock(curshape);
        var nextrealblock = this.getrealblock(nextshape);
        var canmove = this.getcanmove(nextrealblock, 0, 0);
        if (canmove == true){
            this.setdata(currealblock, 0 , 0, this.WHITE);

            this.setdata(nextrealblock, 0 , 0, this.curblock.color);

            this.curblock.index = nextindex;
        }
        return canmove;
    }

    left() {
        var shape = this.curblock.shape[this.curblock.index];
        var realblock = this.getrealblock(shape);
        var canmove = this.getcanmove(realblock, 0 , -1);
        if (canmove == true){
            this.setdata(realblock, 0, 0, this.WHITE);

            this.setdata(realblock, 0, -1, this.curblock.color);
            this.curx -= 1;

        }

        return canmove
    }

    right() {
        var shape = this.curblock.shape[this.curblock.index];
        var realblock = this.getrealblock(shape);
        var canmove = this.getcanmove(realblock, 0 , 1);
        if (canmove == true){
            this.setdata(realblock, 0, 0, this.WHITE);

            this.setdata(realblock, 0 , 1, this.curblock.color);
            this.curx += 1;
        }
        return canmove
    }
    
    down() {
        var shape = this.curblock.shape[this.curblock.index];
        var realblock = this.getrealblock(shape);
        var canmove = this.getcanmove(realblock, 1, 0);
        
        if(canmove == false){

            this.setdata(realblock, 0, 0, this.BLACK);
        }

        else if (canmove == true){
            this.setdata(realblock, 0, 0, this.WHITE);

            this.setdata(realblock, 1, 0, this.curblock.color);
            this.cury += 1;
        }

        return canmove
    }

    getrealblock(shape) {
        var realblock = [];
        for (var i = 0; i < shape.length; i++){
            for(var j = 0; j < shape.length; j++){
                if(shape[i][j] == 1){
                    realblock.push([i + this.cury , j + this.curx]);
                }
            }
        }

        return realblock;
    }

    getcanmove(realblock, ny, nx) {
        for(var i = 0; i < realblock.length; i++){
            var y = realblock[i][0];
            var x = realblock[i][1];
            if(this.datalist[y + ny][x + nx] >= this.BOX){
                return false;
            }
        }

        return true;
    }

    makeblock() {

        var r = Math.floor(Math.random() * this.blocklist.length);
        this.curblock = this.blocklist[r];

        this.curblock.index = 0;
        var shape = this.curblock.shape[0];

        this.cury = 1;
        this.curx = 4;

        for (var y = 0; y <shape.length; y++){
            for (var x = 0; x < shape.length; x++){
                if ( shape[y][x] == 1){
                    this.datalist[y + this.cury][x + this.curx] = this.curblock.color;
                }
            }
        }
    }

    setdata(realblock, ny, nx, color){
        for (var i = 0; i < realblock.length; i++){
            var y = realblock[i][0];
            var x = realblock[i][1];
            this.datalist[y + ny][x + nx] = color;
        }
    }

    gameover(){
        var shape = this.curblock.shape[this.curblock.index];
        var realblock = this.getrealblock(shape);
        var canmove = this.getcanmove(realblock, 1, 0);
        if (canmove == false && this.curx == 4 && this.cury == 1){
            return true;
        }
        return false;
    }

    gamestart(){
       // alert("~~");
        if(this.gameover() == true){
            alert("game over");
            history.go(0);
        }
        else if(this.down() == false){
            this.lineclear();
            this.makeblock();
        }
        this.draw();
    }
    
    getsample(){
        var blocks = [
            {
              name: "s",  // 블럭모양
              index: 0,   // 아래 4개의 배열중 0번인덱스
              color: 1,   // 색상번호
              shape: [    // 테트리스 모양 
                [
                  [0, 0, 0],
                  [0, 1, 1],
                  [1, 1, 0],
                ],
                [
                  [0, 1, 0],
                  [0, 1, 1],
                  [0, 0, 1],
                ],
                [
                  [0, 1, 1],
                  [1, 1, 0],
                  [0, 0, 0],
                ],
                [
                  [1, 0, 0],
                  [1, 1, 0],
                  [0, 1, 0],
                ],
              ]
            },
            {
              name: "z",
              index: 0,
              color: 2,
              shape: [
                [
                  [0, 0, 0],
                  [1, 1, 0],
                  [0, 1, 1],
                ],
                [
                  [0, 0, 1],
                  [0, 1, 1],
                  [0, 1, 0],
                ],
                [
                  [1, 1, 0],
                  [0, 1, 1],
                  [0, 0, 0],
                ],
                [
                  [0, 1, 0],
                  [1, 1, 0],
                  [1, 0, 0],
                ],
              ]
            },
            {
              name: "t",
              index: 0,
              color: 3,
              shape: [
                [
                  [0, 0, 0],
                  [1, 1, 1],
                  [0, 1, 0],
                ],
                [
                  [0, 1, 0],
                  [0, 1, 1],
                  [0, 1, 0],
                ],
                [
                  [0, 1, 0],
                  [1, 1, 1],
                  [0, 0, 0],
                ],
                [
                  [0, 1, 0],
                  [1, 1, 0],
                  [0, 1, 0],
                ],
              ]
            },
            {
              name: "l",
              index: 0,
              color: 4,
              shape: [
                [
                  [0, 1, 0],
                  [0, 1, 0],
                  [0, 1, 1],
                ],
                [
                  [0, 0, 0],
                  [1, 1, 1],
                  [1, 0, 0],
                ],
                [
                  [1, 1, 0],
                  [0, 1, 0],
                  [0, 1, 0],
                ],
                [
                  [0, 0, 1],
                  [1, 1, 1],
                  [0, 0, 0],
                ],
              ]
            },
            {
              name: "lr",
              index: 0,
              color: 5,
              shape: [
                [
                  [0, 1, 0],
                  [0, 1, 0],
                  [1, 1, 0],
                ],
                [
                  [1, 0, 0],
                  [1, 1, 1],
                  [0, 0, 0],
                ],
                [
                  [0, 1, 1],
                  [0, 1, 0],
                  [0, 1, 0],
                ],
                [
                  [0, 0, 0],
                  [1, 1, 1],
                  [0, 0, 1],
                ],
              ]
            },
            {
              name: "o",
              index: 0,
              color: 6,
              shape: [
                [
                  [0, 0, 0],
                  [0, 1, 1],
                  [0, 1, 1],
                ],
              
              ]
            },
            {
              name: "b",
              index: 0,
              color: 7,
              shape: [
                [
                  [0, 0, 0 , 0],
                  [1, 1, 1 , 1],
                  [0, 0, 0 , 0],
                  [0, 0, 0 , 0],
                ],
                [
                  [0, 0, 1 , 0],
                  [0, 0, 1 , 0],
                  [0, 0, 1 , 0],
                  [0, 0, 1 , 0],
                ],
                [
                  [0, 0, 0 , 0],
                  [0, 0, 0 , 0],
                  [1, 1, 1 , 1],
                  [0, 0, 0 , 0],
                ],
                [
                  [0, 1, 0 , 0],
                  [0, 1, 0 , 0],
                  [0, 1, 0 , 0],
                  [0, 1, 0 , 0],
                ],
              ]
            },
        ]

        return blocks;
    }
};

