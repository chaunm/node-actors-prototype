ZNP Actor
=======================

| Version | Date | Author | Description |
|-------|-------|-------|-------------|
| 1.0  | May 26th 2016 | Anh Le  | Initial release |

This actor works with ZNP devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `system_znp`

# Mailboxes

The actor uses following mailboxes

## 1. Requests
For serving requests from other actors
### 1.1 Add devices

**mailbox:** `request/add_device`

**message:**
```javascript
{
	from, // sender's guid, added by Message Broker automatically  
  id, // generated & maintained by the actor (for callbacks)
  duration: <int, time in seconds>
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "describing errors if have any"
  }
}
```

### 1.2 Remove devices

**mailbox:** `request/remove_device`

**message:**
```javascript
{
  id, // generated & maintained by the actor (for callbacks)  
  deviceId: <string>
}
```

**response**
Upon finishing these requests, it should send a response to the sender's 'response' mailbox:
```js
{
	from, // znp's guid, added by Message Broker automatically
  request, // the original request here
  response: {
    status: "status.actor.success or status.actor.failed",
    error: "error.actor.code" // code describing the error (if any)
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
### 3.1 New device is added

**mailbox:** `event/device_added`

**message**: messages should conform the format
```js
{
	from, // znp's guid, added by Message Broker automatically
  macId,
  endpoint,
  // device.sensor.{motion, humidity, door, smoke}, device.keyfob.{panic, remote}
  deviceClass,
  protocol: "zigbee"
}
```

### 3.2 Device is removed

**mailbox:** `event/device_removed`

**message**: messages should conform the format
```js
{
	from, // znp's guid, added by Message Broker automatically
  macId,
  protocol: "zigbee"
}
```

### 3.3 Device's error

**mailbox:** `event/device_error`

**message**: messages should conform the format
```js
{
	from, // znp's guid, added by Message Broker automatically
  macId,
  protocol: "zigbee",
  error: "error.actor.code" // code describing the error (if any)  
}
```

### 3.4 Device's data

**mailbox:** `event/device_data`

**message**: messages should conform the format
```js
{
	from, // znp's guid, added by Message Broker automatically
  macId,
  endpoint,
  protocol: "zigbee",
  payload: { //json object

    // motion sensor
    motion: 0 or 1, // 0 -> no motion
    battery: 0 or 1, // 1 -> battery ok, 0 -> battery low

    // door sensor
    open: 0 or 1, // 0 -> closed, 1 -> opened
    battery: 0 or 1,    

    // temperature sensor
    temperature: 32.7, // celsius degree
    battery: 0 or 1,    

    // humidity sensor
    humidity: 32, // percentage
    battery: 0 or 1,    

    // smoke sensor
    smoke: 0 or 1, // 1 -> smoke detected
    battery: 0 or 1,    

    // panic button
    panic: 0 or 1, // 1 -> panic, on event only
    battery: 0 or 1,    // recheck if we can check this information    

    // remote button
    remote: 'arm'
        | 'disarm'
        | 'indoor'
        | 'suppress', // suppress any alarm
    battery: 0 or 1,    // recheck if we can check this information        
  }
}
```
