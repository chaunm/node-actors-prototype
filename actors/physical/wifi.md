Wifi Service
=======================


# Overview

This actor works with Wifi devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `service/wifi`

# Endpoints
The actor uses following endpointes:

## 1. Requests
For serving requests from other actors
### 1.1 Broadcast

**endpoint:** `:request/broadcast`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    ssid: "string",
    password: ""
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' endpoint:
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    error: "describing errors if have any"
  }
}
```

### 1.2 Connect

**endpoint:** `:request/connect`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    ssid: "string",
    password: ""  
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `:response` endpoint:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"  
  }
}
```
If we can't establish a connection with the target Wifi network, this Wifi service will automatically re-broadcast.

**note**
The timeout must be set to > 3 min

### 1.3 Hi
Get information about the Wi-Fi network

**endpoint:** `:request/hi`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // left-blank
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `:response` endpoint:
```js
{
  from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    state: "state.{connected, disconnected, broadcasting}",

    // valid for state = connected
    ssid,
    ip

    // valid for state = broadcasting
    ssid
  }
}
```

## 2. Response
This endpoint contains response from other actors

**endpoint:** `response`

**message:**  messages should conform the format:
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",  
    // any key-value
  }
}
```

## 3. Events
### 3.1 Connected

**endpoint:** `:event/connected`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    ssid,
    ip
  }
}
```

### 3.2 Disconnected

**endpoint:** `:event/disconnected`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    ssid // previously connected ssid
  }
}
```
