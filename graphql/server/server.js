const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');
const model = require('./model');
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,PUT,POST,OPTIONS"
}));
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(4000, () => {
    console.log('server started on 4000');
});