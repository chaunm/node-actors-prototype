Wifi Actor
=======================

| Version | Date | Author | Description |
|-------|-------|-------|-------------|
| 1.0  | May 30th 2016 | Anh Le  | Initial release |

This actor works with Wifi devices. It must conform `Actor Commons` (see more in `1.actor-system.md`)



The actor uses following mailboxes

## 1. Requests
For serving requests from other actors
### 1.1 Broadcast

**mailbox:** `request/broadcast`

**message:**
```javascript
{
	from, // sender's guid, added by Message Broker automatically  
  id, // generated & maintained by the actor (for callbacks)
  ssid: "string",
  password: ""
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
```js
{
	from, // wifi guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"
  }
}
```

### 1.2 Connect

**mailbox:** `request/connect`

**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically  
  id, // generated & maintained by the actor (for callbacks)
  ssid: "string",
  password: ""  
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.wifi.{success, failed, or anything else}",
  }
}
```

## 2. Response
This mailbox contains response from other actors

**mailbox:** `response`

**message:**  messages should conform the format:
```js
{
	from, // sender's guid, added by Message Broker automatically
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
	from, // wifi's guid, added by Message Broker automatically
  ssid
}
```

### 3.2 Disconnected

**mailbox:** `event/disconnected`

**message**: messages should conform the format
```js
{
	from, // znp's guid, added by Message Broker automatically
  ssid // previously connected ssid
}
```
