Wifi Actor
=======================

| Version | Date | Author | Description |
|-------|-------|-------|-------------|
| 1.0  | May 30th 2016 | Anh Le  | Initial release |

# Overview

This actor works with Wifi devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `system_wifi`

# Mailboxes
The actor uses following mailboxes:

## 1. Requests
For serving requests from other actors
### 1.1 Broadcast

**mailbox:** `request/broadcast`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    id, // generated & maintained by the actor (for callbacks)
    ssid: "string",
    password: ""
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
    status: "status.{success,failed}",
    error: "describing errors if have any"
  }
}
```

### 1.2 Connect

**mailbox:** `request/connect`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    id, // generated & maintained by the actor (for callbacks)
    ssid: "string",
    password: ""  
  }
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.{success,failed}",
    error: "describing errors if have any"    
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
    // any key-value
  }
}
```

## 3. Events
### 3.1 Connected

**mailbox:** `event/connected`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    ssid
  }
}
```

### 3.2 Disconnected

**mailbox:** `event/disconnected`

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
