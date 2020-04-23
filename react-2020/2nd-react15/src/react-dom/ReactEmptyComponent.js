
var emptyComponentFactory;

var ReactEmptyComponentInjection = {
    injectEmptyComponentFactory: function (factory) {
        emptyComponentFactory = factory;
    }
};

var ReactEmptyComponent = {
    create: function (instantiate) {
        return emptyComponentFactory(instantiate);
    }
};

ReactEmptyComponent.injection = ReactEmptyComponentInjection;

module.exports = ReactEmptyComponent;