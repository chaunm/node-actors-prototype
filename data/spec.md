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
- status: status.{online, offline}


**Table Device**
- uid = hash256(macid :: endpoint, for zigbee)
- name
- location
- protocol (Zigbee)
- mac id
- endpoint
- class: class.device.*
- data (current)
- status: status.{online, offline}

**Table DataSeries**
- deviceId
- data
- timestamp

**Table Actors**
- uid
