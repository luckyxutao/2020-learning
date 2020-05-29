
const NormalModule = require('./NormalModule')

class normalModuleFactory{
    create(data){
        return new NormalModule(data)
    }
}

module.exports = normalModuleFactory;