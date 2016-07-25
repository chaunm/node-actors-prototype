Gateway
===================


# Overview

This service acts as an entry point for users to interact with Gateway.

**Responsibility**
It's responsible for:
- Making the gateway as a Wi-Fi access point (auto)
- Serving activation requests from Anonymous user (if the gateway is NOT initialized)
  Configuration request must contain:
    wifi { ssid, password }
    owner { id, token }

- If success:
  - Updating information about the owner, initialized time
  - Mark itself as initialized

- Otherwise, rebroadcasting itself

**ACLs**
- `user/anonymous`: Anonymous can only access `:request/hi`, `:request/activate`

**Data record**
An example record may be:

```js
 {
    id, // gateway/<id>
    token, // hash
    name: 'Evolas I',
    model: 'EVO68',
    owner: {
      id,  // id of the owner (user/<id>)
      activatedTime // time at which the system's activated
    },
    platform: {
      name: 'Evolas System',
      version: '1.0',
      releasedAt: 'Jul 14th 2016',
      upTime, // system up time
      currentTime // current time of system, updated every minutes
    },

    configuration: {
      grant: [
        // list of IDs having modification rights
        
      ],
      cloud: {
        host,
        port, // 8883 by default
        token
      }
    },

    state : {
      storage: {
        total, // in Gb
        used,
        free
      },
      memory: { // updated every 5min
        total, // in Gb
        used,
        free        
      },
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

**Interfaces**

It has 2 interfaces:
- One for local network
- Another for the cloud (secured over SSL/TLS)

Actually the 2 interfaces are implemented using Actors with the same:
- IDs (tokens may be different from each other)
- Handlers for same mailboxes

So we may have:

```text
handler(mailbox='gateway/id/:request/data', interface='local')
=
handler(mailbox='gateway/id/:request/data', interface='cloud')
```

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. ID
The actor's local ID is: `service/bonjour`

# B. Mailboxes
The service uses following mailboxes

## 1. Requests
### 1.1 Get information about the system

**mailbox:** `request/hi`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's gID
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
    from, // sender's gID
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    system: {
      id,
      name,
      model,
      owner,
      location,
      platform,
      uptime,
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

### 1.2 Activate
We only process this request when the internal state is `state.initializing`

A success response is just to let `Anonymous` know that: the params is ok.

The requester then should re-connect back to the home network wifi, discovering the presence of gateway (in 3 minutes timeout )

**mailbox:** `:request/activate`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's gID
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: {
    owner: {
    	id,
    	token
    },
    wifi: {
    	ssid,
    	password
    }
  }
}
```

### 1.3 Initialize
Ask `service/gateway` to broadcast a Wi-Fi network, accepting Activation requests

Only accepts requests from `system` if the internal state is not `state.initializing`

**mailbox:** `:request/init`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's gID
    id, // generated & maintained by the sender (for callbacks)
    timestamp
  },

  params: { // blank
  }
}
```

**response**

Upon finishing these requests, it should send a response to the sender's `/:response` mailbox:

```js
{
  header: { // added by our broker
    from, // sender's gID
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    // failure may be invalid_state, unauthorized
  }
}
```
