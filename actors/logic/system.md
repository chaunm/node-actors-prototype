System
===================

# Overview

This actor acts as the core system, being responsible for:
- monitor actors status (optionally their communications, dead messages... )
- activate dynamic actor

It must conform `Actor Commons` (see more in `../actor-system.md`)

**How Gateway boots up?**
Execute boot scripts at `/boot`. It performs following things:
- Patch registry
- Start Environ
- Start System

**How System starts?**
- System checks if it's initialized (via the presence of `owner` field)
- If it's initialized, boots as normal
- Otherwise:
  + Create Anonymous user
  + Start Bonjour service
  + Waiting for `finalize` calls from `service/bonjour`
- If `finalize` is invoked:
  + Writing wifi configuration, owner
  + Boot as normal

**System record**

An example record may be:

```js
 system: {
    id,
    token, // hash 
    name: 'Evolas I',
    model: 'EVO68',
    owner, // id of the owner (user/xxx)
    platform: 'evolas system',
    version: '1.0',
    releaseDate: 'Jul 14 2016',
    time: {
      up, // system up time
      now, // current time of system, updated every minutes
      initialized // time at which the system initialized
    }, 
    configuration: {
      boot: [
        // list of services to boot (in order)
      ],
      grant: [
        // list of IDs having modification rights
      ],
      wifi: {
        password,
        security: security.{none, wep, wpa/wpa2}
      }
    },
    state : {
      battery: {
      state: state.{charging, not_charging},
      level: percent
    },
    gsm : {
      state: state.{connected, disconnected},
      network: 'viettel',
      signal: signal.{poor, fair, good, excellent},
      phoneNumber: '0987xyz',
      balance: '1000 VND',
      imei: 'xxxxx'
    },
    wifi: {
      state: state.{connected, disconnected, broadcasting},
      network: 'xyz.com',
      ip
    }
  }
}
```

# A. ID
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
