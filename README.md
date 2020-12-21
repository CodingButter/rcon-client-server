# Rcon Rest API

### Overview of API FLOW
  - Make a connection request and receive a status and uid ( Refers to your unique RCON connection )
  - Make a request to one of the other enpoints such as send ( to send commands ) providing the uid that was given


#### API BASE
```
https://codingbutter.com:2080/rcon/
```

# Enpoints and Responses
### connect
```
https://codingbutter.com:2080/rcon/connect
```
#### expected url params
| Parameter | Description | Example |
|-----------|-------------|---------|
| host | The ip or domain to the server | beastcraft.codingbutter.com
| port | The Rcon port | 25575
| password| The password for the rcon connections | beastcraftpassword

#### Successful Response Example
```json
{"status":"connected","uid":"kri9rkkiybjgyw"}
```

#### Unsuccessful Response Example
```json
{
    "status":"not_connected",
    "error":{
        "errno":-3008,
        "code":"ENOTFOUND",
        "syscall":"getaddrinfo",
        "hostname":"beastcraft.codingutter.com"
    }
}
```

#### Fetch example 
   
```javascript
fetch("https://codingbutter.com?host=server.domain.com&port=25575&password=rconpass")
.then(res=>res.json())
.then(json=>{
    console.log({json.uid}) //Returns unique connection id example kri9rkkiybjgyw  
})
```
### status
```
https://codingbutter.com:2080/rcon/status
```
#### expected url params
| Parameter | Description | Example |
|-----------|-------------|---------|
| uid | The Unique Id for your connection | kri9rkkiybjgyw |

#### Successful Response Example
```json
{"status":"connected"}
```
#### or
```json
{"status":"disconnected"}
```

#### Unsuccessful Response Example
```json
{"status":"failed","error":"connection doesn't exist"}
```

#### Fetch example 
   
```javascript
fetch("https://codingbutter.com:2080/rcon/status?uid=kri9rkkiybjgyw")
.then(res=>res.json())
.then(json=>{
    console.log({json.status}) // Response from the rcon server example "connected"  
})
```


### send
```
https://codingbutter.com:2080/rcon/send
```
#### expected url params
| Parameter | Description | Example |
|-----------|-------------|---------|
| uid | The Unique Id for your connection | kri9rkkiybjgyw |
| command | The Rcon port | give CodingButter minecraft:diamond_sword |

### Successful Response Example
```json
{
    "connection":"connected",
    "status":"success",
    "response":{
        "uid":"kri48wkiycl7bt",
        "body":"Gave 1 [Diamond Sword] to CodingButter\n"
    }}
```

### Unsuccessful Response Example
```json
{"status":"failed","error":"connection doesn't exist"}
```

#### Fetch example 
   
```javascript
fetch("https://codingbutter.com:2080/rcon/send?uid=kri9rkkiybjgyw&command=give%20CodingButter%20minecraft:diamond_swords")
.then(res=>res.json())
.then(json=>{
    console.log({json.response.body}) // Response from the rcon server example "Gave 1 [Diamond Sword] to CodingButter\n"  
})
```
