Data structures
=====
**Table Service**
- uid: also the mailbox uid/request/#, uid/response, uid/event/#
- name
- description
- version
- status: status.service.{ online, offline, error }
- developer

**Table Device**
- uid = hash256(macid :: endpoint, for zigbee)
- name
- location
- protocol (Zigbee)
- mac id
- endpoint
- class: class.device.*
- status: status.device.{ online, offline, error }
- data (current)
- lastUpdate

**Table DataSeries**
- deviceId
- data
- timestamp

**Table Actors**
- uid
