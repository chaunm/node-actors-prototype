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
	The request is a `tell` one

- If success:
	- Ask the system to finalize by:
		- Updating information about the owner & wifi information
		- Removing Anonymous user 
		- Mark itself as initialized
		- Ask the system to reboot
	- Kill itself

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

**mailbox:** `request/info`

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
			signal: 'high | medium | low',
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

This is a `tell` request

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