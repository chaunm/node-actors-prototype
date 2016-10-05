ZNP Service
=======================


# Overview

This actor works with ZNP devices. It must conform `Actor Commons` (see more in `../actor-system.md`)

# UID
The actor's local UID is: `service/zigbee_driver`

# Endpoints

The actor uses following endpoints

## 1. Action

For serving requests from other actors
### 1.1 Add devices

**endpoint:** `action/service/zigbee_driver/add_devices`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  type: 'action/service/zigbee_driver/add_devices',

  params: {
    duration: <int, time in seconds>
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
  type: 'response',
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

### 1.2 Remove devices

**endpoint:** `action/service/zigbee_driver/remove_device`

**message:**
```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  type: 'action/service/zigbee_driver/remove_device',

  params :{
    deviceId: <string>
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

  type: 'response',

  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    error: "error.actor.code" // code describing the error (if any)
  }
}
```

## 2. Events
### 2.1 New device added

This event is generated when an a new device is added to network.
In the params sector, beside macId information is all the endpoint information come in an array.

**endpoint:** `event/service/zigbee_driver/device_added`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_added',
  params:{
    macId: <mac Id of the device>,
    protocol: "zigbee",
    endpoints: < array of endpoint information
    [
      //array of endpoint(s) information
      {
      endpoint,
      // class.device.sensor.{motion, humidity, door, fire}, class.device.keyfob.{panic, remote}
      class,

      // any key-value else
      }
      ...
  }
}
```

### 2.2 New endpoint of device is added

This event is generated when an endpoint of an existing device is added. Normally a Xiaomi's device does not support
getting information when pairing so that endpoint of that device will be added later when there is data updated from device.

**endpoint:** `event/service/zigbee_driver/endpoint_added`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/endpoint_added',  
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

### 2.3 Device is removed

**endpoint:** `event/service/zigbee_driver/device_removed`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_removed',    
  params: {
    macId
  }
}
```

### 2.4 Device's error

**endpoint:** `event/service/zigbee_driver/device_error`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_error',      
  params: {
    macId,
    protocol: "zigbee",
    error: "error.device.code" // code describing the error (if any)  
  }
}

```

### 2.5 Device's signal strength

This event is generated when system get a message from devices update link quality of those devices.
The value may have value of:

  0 - signal is weak

  1 - signal is fair enough

**endpoint:** `event/service/zigbee_driver/device_signal`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_signal',      
  params: {
    macId,
    protocol: "zigbee",
    signal_strength: <0, 1>
  }
}
```

### 2.6 Device is offline

**endpoint:** `event/service/zigbee_driver/device_offline`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_offline',        
  params: {
    macId,
    protocol: "zigbee"
  }
}
```

### 2.7 Device is online

**endpoint:** `event/service/zigbee_driver/device_online`

**message**: messages should conform the format
```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_online',        
  params: {
    macId,
    protocol: "zigbee"
  }
}
```

### 2.8 Device's data

**endpoint:** `event/service/zigbee_driver/device_data`

**message**: messages should conform the format

```js
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  type: 'event/service/zigbee_driver/device_data',          
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
