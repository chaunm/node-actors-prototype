Data structures
=====

**Table Service**
- uid: also the mailbox uid/request/#, uid/response, uid/event/#
- name
- description
- version
- developer
- status: status.{stopped, starting, started, stopping, error}

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
