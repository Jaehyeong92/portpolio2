

export class managerkey{
    static instance = new managerkey()
    static getinstance(){
        return this.instance;
    }

    start(){
        this.keyoncelist = {
            "KeyD" : "ready" ,
            "KeyA" : "ready" ,
            "KeyW" : "ready" ,
            "KeyS" : "ready" ,
            "Space" : "ready" ,
        };

        document.addEventListener("keydown", (e) => {
        if (this.keyoncelist[e.code] == "ready"){
            this.keyoncelist[e.code] = "shoot";

        }
    }, false);

        document.addEventListener("keyup", (e) => {
        if (this.keyoncelist[e.code] == "wait"){
            this.keyoncelist[e.code] = "ready";

            }
    }, false);
    }

    
    getkeyonce(key){
        if(this.keyoncelist[key] == "shoot"){
            this.keyoncelist[key] = "wait";
            return true;
        }else{
            return false;
            }
        }
    };
        