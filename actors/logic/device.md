Device
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 31th 2016 | Anh Le | Initial release

# Overview
This actor acts as a device
It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `system_device_<id>`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1 Setup
- Set the actor up with necessary information
- Only actor `system` can invoke this request.

**mailbox:** `request/setup`

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

### 1.2 Update data
- Update data.
- Only actor `system` can invoke this request.

**mailbox:** `request/update`

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

**response** Upon finishing these requests, it should send a response to the sender's `/response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success,failed}",
    error: "describing errors if have any"
  }
}
```

## 2. Response
- Devices don't make any request. So they don't process response

## 3. Event
### 3.1 Data
**mailbox:** `event/data`

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
