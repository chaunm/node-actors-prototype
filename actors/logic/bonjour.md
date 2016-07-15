Bonjour
===================


# Overview

This service runs only when the gateway device is NOT initialized.

It's responsible for: 
- Making the gateway as a Wi-Fi access point (auto)
- Serving configuration requests from Anonymous user. 
	Configuration request must contain: 
		wifi { ssid, password }
		owner { id, token }

- If success:
	- Ask the system to finalize by:
		- Updating information about the owner & wifi information
		- Removing Anonymous user 
		- Mark itself as initialized

- Otherwise, rebroadcasting itself

So the workflow will be: 

```text
Anonymous  <->  Bonjour <-> System
```

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `service/bonjour`

# B. Mailboxes
The service uses following mailboxes

## 1. Requests
### 1.1 Get information about the system

**mailbox:** `request/hi`

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

### 1.2 Setup 
We only process this request when the internal state is `state.initializing`

A success response is just to let `Anonymous` know that: the params is ok. 

The requester then should re-connect back to the home network wifi, discovering the presence of gateway (in 3 minutes timeout )

**mailbox:** `:request/setup`

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
Ask `service/bonjour` to broadcast a Wi-Fi network, accepting setup requests

Only accepts requests from `system` if the internal state is not `state.initializing`

**mailbox:** `:request/init`

**message:**

```javascript
{
  header: { // added by our broker
    from, // sender's guid
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
    from, // sender's guid
    timestamp
  },
  request, // the original request here
  response: {
    status: "status.{success, failure.*}",
    // failure may be invalid_state, unauthorized
  }
}
```