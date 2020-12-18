var path = require('path')
var request = require('request') // or hyperquest, simple-get, etc...
var concat = require('concat-stream')
const cors = require("cors");
const API = "/minecraftinfo";
async function getBase64Image(url) {
    return new Promise((resolve, reject) => {
        image.pipe(concat({ encoding: 'buffer' }, function (buf) {
            resolve(`data:image/png;base64, ${buf.toString('base64')}`)
        })
    });
}



function MinecraftProfileApi(app) {

    
app.get(`${API}/gethead`,cors(), (req, res) => {
    const { username } = req.query;
    res.setHeader('Content-Type', 'image/png');
    draw().pngStream().pipe(res);
});

});

}
module.exports = MinecraftProfileApi;