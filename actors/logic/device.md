Device
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | June 16th 2016 | Anh Le | Initial release

# Overview
This actor acts as a device. Trigger services may then operate on such device
It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. ID
The actor's local ID is: `device/<macId>@<endpoint>`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1 Get
Get information about the device

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
    // left blank
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
    status: "status.{success, failure.*}",
    device: {
      id : 'device/' + <macId> @ <endpoint>,
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
}
```

### 1.2 Get history data 

This is a time series data

**mailbox:** `:request/history`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // left blank
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
    status: "status.{success, failure.*}",
    data: [
      // currently we dont figure out how to ...
    ]
  }
}
```

### 1.3 Update

- Update data
- Only actor `service/device-manager` can invoke this request.

**mailbox:** `:request/update`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // any key value ...
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

## 2. Response
- Devices don't make any request. So they don't process any response

## 3. Event
### 3.1 Device data
**mailbox:** `:event/device_data`

**message:** This is a retained message

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    // any key value ...
  },
}
```
### 3.2 Device status
**mailbox:** `:event/device_status`

**message:** This is a retained message

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    status: 'status.{online, offline, error}'
  },
}
```
