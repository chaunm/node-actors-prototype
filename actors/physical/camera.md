Wifi Service
=======================


# Overview

This actor works with camera devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `service/camera`

# Mailboxes
The actor uses following mailboxes:

## 1. Requests
For serving requests from other actors
### 1.1 start_streaming

**mailbox:** `:request/start_streaming`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    port: ,// port for http server to streaming out video
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
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

### 1.2 stop_streaming

**mailbox:** `:request/stop_streaming`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {    
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `:response` mailbox:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"  
  }
}
```

### 1.3 Set quality

**mailbox:** `:request/set_quality`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {    
    quality: <high, medium, low>
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's `:response` mailbox:
```js
{
  from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"  
  }
}
```

## 2. Response
This mailbox contains response from other actors

**mailbox:** `response`

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
### 3.1 Camera started

**mailbox:** `:event/camera_started`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    
  }
}
```

### 3.2 Camera stopped

**mailbox:** `:event/camera_stopped`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    
  }
}
```
