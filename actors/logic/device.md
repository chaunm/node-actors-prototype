Device
=================

| Version | Date | Author | Description |
|-------|-------|-------|-------------|
| 1.0  | May 31th 2016 | Anh Le  | Initial release |

This actor acts as a device

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `system_device_<id>`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
#### 1.1 Setup
- Set the actor up with necessary information
- Only actor `system` can invoke this request.

**mailbox:** `request/setup`
**message:**
```javascript
{
  from, // sender's guid, added by Message Broker automatically.
  id, // generated & maintained by the sender (for callbacks)

  setup: {
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
  from, // sender's guid, added by Message Broker automatically.
  id, // generated & maintained by the sender (for callbacks)

  update: {
    // any key value ...
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
  from, // sender's guid, added by Message Broker automatically.

  data: {
    // any key value ...
  },

  updated: "last time the data updated"
}
```
