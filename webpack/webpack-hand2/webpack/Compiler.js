const { Tapable, SyncHook} = require('tapable');


class Compiler extends Tapable{
    constructor(context){
        super(context);
        this.options = {};
        this.context = context;
        this.hooks = {
			environment: new SyncHook([]),
			/** @type {SyncHook} */
			afterEnvironment: new SyncHook([]),
        }
    }
    run(){

    }
}

module.exports = Compiler;