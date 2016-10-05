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

# B. Endpoints
The actor uses following endpointes

## 1. Requests
### 1.1 Finalize

Called by `service/bonjour` to finalize the initialization 

**endpoint:** `:request/finalize`

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

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

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

### 1.2 Hi

Get information about `system`. No restriction on ACL.

**endpoint:** `:request/hi`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: { // blanks
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

```js
{
  header: { // added by our broker
    from, // sender's guid
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
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
      // configuration information is removed ....
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
  }
}
```

### 1.3 Reset
Reset the whole system by:
- forgeting Wi-Fi
- removing data in `mqtt_data`, `mqtt_health`
- removing any time series data
- removing `user/.*` in `mqtt_entity`
- removing `system.owner`, `time.initialized`

**endpoint:** `:request/reset`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: { // blanks
  }
}
```

**response** Upon finishing these requests, it should send a response to the sender's `/:response` endpoint:

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

Only accepts requests from the owner (or a system service)

## 2. Response

## 3. Event
### 3.1 xxx
**endpoint:** `:event/xxx`

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
