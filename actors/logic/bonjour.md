Bonjour Service
==========================

This service is used to make Evolas System discovered in a network.

Bonjour operates on a UDP port (8886 by default), waiting for Hi messages:

```js
// The messages are JSON string
{
    tell: "bonjour"
}
```

Bonjour will return following information which are also JSON strings:

```js
{
    // following fields are grabbed from `registry.json`
    "name": "Evolas One",
    "model": "EVO68",
    "link": "http://evolas.vn/products/evo68",
    "platform": {
        "name": "Evolas System",
        "version": "1.0.0",
        "systemId": "system/machine-id"
    },    
    // configuration is not included in
    //
    // other state information
    "state": {
        "activation": {
            "ownerId": "id of the owner (user/<id>)",
            "activatedTime" : "time at which the system is activated, string"
        },       

        "upTime": "up time, string",
        "currentTime": "the current system time, string"

        "storage": {
            "total": "memory size, string",
            "used": "used memory, string",
            "available": "available memory, string",
            "use" : "percent of used memory, number"
        },
        "memory": {
            "total": "memory size, string",
            "used": "used memory, string",
            "available": "available memory, string",
            "use" : "percent of used memory, number"
        },
        "power": {
            "blackout": "true or false. true if there's a electric power outage",
            "durationTime": "time in ms that the system can work by using battery",
            "elapsedTime": "elapsed time in ms since there's a blackout"
        },
        "gsm" : {
            "state": "state.{connected, disconnected}",
            "network": "viettel",
            "signal": "signal.{poor, fair, good, excellent}",
            "phoneNumber": "0987xyz",
            "balance": "1000 VND"
        },
        "wifi": {
            "state": "state.{connected, disconnected, broadcasting}",
            "network": "xyz.com",
            "ip": "127.0.0.1"
        }         
    }
}
```
