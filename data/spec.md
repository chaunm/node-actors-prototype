Data structures
=====

**Table Service**
- uid
- token
- timestamp
- name
- type: "actor.{service, device, user}"
- description
- version
- developer
- status: status.{stopped, starting, started, stopping, error}
- configuration: {ttl, location, protocol, macId, endpoint, class...}

**Table Device**
- uid = hash256(macid :: endpoint, for zigbee)
- name
- location
- protocol (Zigbee)
- mac id
- endpoint
- class: class.device.*
- data (current)
- updated
- status: status.{stopped, starting, started, stopping, error}

**Table DataSeries**
- deviceId
- data
- timestamp

**Table Actors**
- uid
