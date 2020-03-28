const createAxios = require('./request').default;

function sendRequest(requestData) {
    const res = createAxios();
    return res.request(requestData).then(res => {
        return res.data;
    })
}
module.exports = {
    fetchBooks: function (params) {
        return sendRequest({
            url: '/api/book/search',
            params
        })
    },
    fetchBooks2: function (params) {
        sendRequest({
            url:'http://localhost:3001/cross/1'
        });
    }
}