System
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 31th 2016 | Anh Le | Initial release

# Overview

This actor acts as the core system, being responsible for:
- monitor actors status (optionally their communications, dead messages... )
- activate dynamic actor

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `system`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1 xxx

**mailbox:** `:request/xxx`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  xxx
}
```

## 2. Response

## 3. Event
### 3.1 xxx
**mailbox:** `:event/xxx`

**message:** This is a retained message

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },

  xxx,

  updated: "last time the data updated"
}
```
