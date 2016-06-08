Logger
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | June 6th 2016 | Anh Le | Initial release

# Overview
This actor acts as a logger service
It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `service/logger`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1 Log
- Set the actor up with necessary information
- Only actor `system` can invoke this request.

**mailbox:** `:request/log`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    level: "log.{warning, info, critical, error}",
    message: "blah blah blah"
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
    status: "status.{success, failure.*}"
  }
}
```


## 2. Response
- Devices don't make any request. So they don't process any response

## 3. Event
- No uncommon events
