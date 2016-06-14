Device Manager Service
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | June 13th 2016 | Anh Le | Initial release

# Overview
This actor acts as a device manager, listening for all device-related events
It must conform `Actor Commons` (see more in `../actor-system.md`)

Currently, only `service/znp` is supported.

This actor only works with `service/housekeeper`, `system`.

This service's responsible for following things:
**On boot**
- Get all devices
- Activate associated devices
- Restore their previous data

**On runtime**
- Store information about devices (in RethinkDb)
- Create new devices (if there's no such device in our database)
- Relay data events to associated devices. That is: `znp -> device-manager -> device`

# A. ID
The actor's local ID is: `service/device-manager`

# B. External mailboxes
- Subscribes to `service/znp/:event/#`

# C. Owned mailboxes

The actor uses following owned mailboxes

## 1. Requests
### 1.1 Add devices
- Allow new devices to join 
- Only `admin users` can invoke this request

**mailbox:** `:request/add`

**message:**
```js
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
    status: "status.{success, failure.*}",
  }
}
```

### 1.2 Get all devices
- Get all added devices 

**mailbox:** `:request/get`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {
    // Left-blank to get all devices
    // In the future, we may support queries against key-value pairs a devices
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
    devices: [
      {
        id : 'device/' + hash256(macid :: endpoint, for zigbee),
        name,
        location,
        protocol,
        macId,
        endpoint,
        class: class.device.*,
        data,
        status: status.{online, offline}
      },
      {
        ...
      }
    ]
  }
}
```

### 1.3 Get a device
- Get information about a device

**mailbox:** `:request/get/<id>`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },
  params: {}
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
    device: {
      id : 'device/' + hash256(macid :: endpoint, for zigbee),
      name,
      location,
      protocol,
      macId,
      endpoint,
      class: class.device.*,
      data,
      status: status.{online, offline}
    }
}
```

### 1.4 Update data
- Update meta data for a device.

**mailbox:** `:request/update/<id>`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    id, // of device (required)
    // any key value else
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

### 1.5 Remove all devices

**mailbox:** `:request/remove`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // Left-blank to get all devices
    // In the future, we may support queries against key-value pairs a devices
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

### 1.6 Remove a device

**mailbox:** `:request/remove/<id>`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {}
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}"
  }
}
```

## 2. Response
**mailbox:** `:response`

## 3. Event

