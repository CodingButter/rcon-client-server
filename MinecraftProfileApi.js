const fetch = require("node-fetch")
const path = require('path')
const atob = require('atob');
const cors = require("cors");
const API = `/mcapi`;


async function getUserId(username){
    const profileUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`
    return new Promise((resolve,reject)=>{
        let settings = {method:'GET'}
        fetch(profileUrl,settings)
        .then(res=>res.json())
        .then((json)=>{
            console.log(json)
            resolve(json);
        })
    })
}

async function getProfileById(userId){
    const profileUrl = `https://sessionserver.mojang.com/session/minecraft/profile/${userId}`;
    return new Promise((resolve,reject)=>{
        console.log({profileUrl})
        let settings = {method:'GET'}
        fetch(profileUrl,settings)
        .then(resp=>resp.json())
        .then(json=>{
            resolve(json);
        })
    })
}

async function getSkinUrl(userJson){
    
}



function MinecraftProfileApi(app) {

    
app.get(`${API}/gethead`,cors(), (req, res) => {
    const { username } = req.query;
    getUserId(username)
    .then(({id})=>{
        getProfileById(id)
        .then(({properties})=>{
            const userJson = JSON.parse(atob(properties[0].value))
            res.json(userJson);
        })
    })
});

}
module.exports = MinecraftProfileApi;