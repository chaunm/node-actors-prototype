How to bridge?
====

## Overview
An actor can remotely interact with a certain actor system if authorized.

## Idea
- An actor can create its mirror actor in the remote system with its identity (uuid/token)
- The actor then interact with the system via request/response with its mirror one

```js
// CLOUD
// 0. Initialization
// Bridge both connects to local & cloud system with the same uuid/token pair
// both pub/sub to same mailboxes

// 1. Bob send authorized request messages to the bridge 
bob.send(
	'cloudbridge/request/bridge/housekeeper/request/get_devices',
	{
		message: ""
	},
	function(response){

	}
)

// 2. cloudbridge process the request
with topic = 'cloudbridge/request/bridge/housekeeper/request/get_devices', 
message = { message: "", from: "<bob guid>"}

- cloudbridge knows it from the cloud, from bob
- cloudbridge ask the keepper about Bob? Is he granted? Is he online? (optionally)
- if local Bob is NOT online, ask the keeper to create a local actor named Bob
- If granted & online, cloudbridge send to Bob (local) the request

// 3. local Bob process the request
with topic = 'bob/request/bridge/housekeeper/request/get_devices', 
message = { message: "", from: "<cloud bridge>"}

- This local one has the right to ask house keeper based on ACLs
- This local actor understands `Bridge request`
- He then make request to `housekeeper/request/get_devices` and returns response if any

```

## 2. Bridge events
