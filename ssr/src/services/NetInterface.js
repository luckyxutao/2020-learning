const axios = require('axios');

function sendRequest(requestData) {
    return axios(requestData).then(res => {
        return res.data;
    })
}
const urlHost = 'https://hy.travel.qunar.com';
module.exports = {
    fetchBooks: function (data) {
        return sendRequest({
            url: `${urlHost}/api/book/search`,
            data
        })
    }
}