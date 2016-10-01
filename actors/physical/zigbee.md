ZNP Service
=======================


# Overview

This actor works with ZNP devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `service/zigbee`

# Mailboxes

The actor uses following mailboxes

## 1. Requests
For serving requests from other actors
### 1.1 Add devices

**mailbox:** `:request/add_devices`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    duration: <int, time in seconds>
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
    status: "status.{success, failure.*}"
  }
}
```

### 1.2 Remove devices

**mailbox:** `:request/remove_device`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params :{
    deviceId: <string>
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
    error: "error.actor.code" // code describing the error (if any)
  }
}
```

## 2. Response
This mailbox contains response from other actors

**mailbox:** `:response`

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
### 3.1 New device is added

**mailbox:** `:event/device_added`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params:{
    macId,
    endpoint,
    // class.device.sensor.{motion, humidity, door, fire}, class.device.keyfob.{panic, remote}
    class,
    protocol: "zigbee",
    // any key-value else
  }
}
```

### 3.2 Device is removed

**mailbox:** `:event/device_removed`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    macId
  }
}
```

### 3.3 Device's error

**mailbox:** `:event/device_error`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    macId,
    protocol: "zigbee",
    error: "error.device.code" // code describing the error (if any)  
  }
}

```

### 3.3 Device's signal strength

This event is generated when system get a message from devices update link quality of those devices.
The value may have value of:
  0 - signal is weak
  1 - signal is fair enough
  
**mailbox:** `:event/device_signal`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    macId,
    protocol: "zigbee",
    signal_strength: <0, 1>
  }
}
```

### 3.4 Device is offline

**mailbox:** `:event/device_offline`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    macId,
    protocol: "zigbee"
  }
}
```

### 3.5 Device is online

**mailbox:** `:event/device_online`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    macId,
    protocol: "zigbee"
  }
}
```

### 3.6 Device's data

**mailbox:** `:event/device_data`

**message**: messages should conform the format

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    macId,
    endpoint,
    data: { //json object

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

      // fire sensor
      fire: 0 or 1, // 1 -> fire detected
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
}
```
