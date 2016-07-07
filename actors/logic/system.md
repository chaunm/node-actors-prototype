System
===================

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
### 1.1 Finalize

Called by `service/bonjour` to finalize the initialization 

This is a `tell` request.

**mailbox:** `:request/finalize`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    owner: {
      id,
      token // raw
    },
    wifi: {
      ssid,
      password
    }
  }
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
