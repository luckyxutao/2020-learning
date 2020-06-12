const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;
const { CategoryModel, ProductModel } = require('./model');

const categories = [
    { id: '1', name: '图书' },
    { id: '2', name: '数码' },
    { id: '3', name: '食品' }
];
const products = [
    { id: '1', name: '红楼梦', category: '1' },
    { id: '2', name: '西游记', category: '1' },
    { id: '3', name: '三国', category: '1' },
    { id: '4', name: '水浒', category: '1' },
    { id: '5', name: 'iphone', category: '2' },
    { id: '6', name: '面包', category: '3' }
];
const CategoryType = new GraphQLObjectType({
    name: 'category',
    fields: () => (
        {
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            products: {
                type: new GraphQLList(ProductType),
                resolve(parent) {
                    return ProductModel.find({
                        category : parent.id
                    })
                }
            }
        }
    )
});

const ProductType = new GraphQLObjectType({
    name: 'product',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        category: {
            type: CategoryType,
            resolve(parent) {
                return CategoryModel.findById(parent.category);
                // return categories.find(item => item.id === parent.category);
            }
        }
    }
})

//定义根类型
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        getCategory: {
            type: CategoryType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return CategoryModel.findById(args.id)
            }
        },
        getCategories: {
            type: new GraphQLList(CategoryType),
            args: {},
            resolve(parent, args) {
                return CategoryModel.find();
            }
        },
        getProduct: {
            type: ProductType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return ProductModel.findById(args.id);
            }
        },
        getProducts: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                return ProductModel.find();
            }
        }
    }
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addCategory: {
            type: CategoryType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return CategoryModel.create(args)
                // args.id = categories.length + 1 + '';
                // categories.push(args);
                // return args;
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                return ProductModel.create(args);
                // args.id = products.length + 1 + '';
                // products.push(args);
                // return args;
            }
        }
    }
});
//定义schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:RootMutation
});