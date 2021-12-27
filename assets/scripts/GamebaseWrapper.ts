import { error } from "cc";



class _GamebaseWrapper {
    public ararara : number = 123;

    private static instance : _GamebaseWrapper = null!;
    public static getInstance(){

        if ( !this.instance ){
            this.instance = new _GamebaseWrapper();
        }

        return this.instance;
    }





    _gameInitCallback : Function = null!;

    public setGameInit( callback : Function ){
        this._gameInitCallback = callback;
    }

    gameInitFinished(){
        if ( typeof this._gameInitCallback === "function"){
            this._gameInitCallback();
            this._gameInitCallback = null!;
        }
        else {
            error("game init callback not registered");
        }
    }
}

declare global {
    interface Window {
        GamebaseWrapper : any
    }
  }

  window.GamebaseWrapper = _GamebaseWrapper.getInstance();


  export const GamebaseWrapper = _GamebaseWrapper.getInstance();