class JSBReflection {

    public ararara : number = 123;

    private static instance : JSBReflection = null!;
    public static getInstance(){

        if ( !this.instance ){
            this.instance = new JSBReflection();
        }

        return this.instance;
    }


    public testFunction(){
        console.log("jsbReflection test call function");
    }
}

export const getInstance = JSBReflection.getInstance;
