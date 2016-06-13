Data structures
=====

**Table Service**
- id
- token
- name
- class: "class.{service, device, user}"
- description
- version
- developer
- status: status.{online, offline}
- timestamp // last update


**Table Device**
- id = hash256(macid :: endpoint, for zigbee)
- token
- name
- location
- protocol (Zigbee)
- mac id
- endpoint
- class: class.device.*
- data (current)
- status: status.{online, offline}
- timestamp // last update

**Table DataSeries** series must have capacities configured in Registry
- deviceId
- data : [{}, {}]
- timestamp // last update

**Table Users**
- id
- token
- name
- phone // number
- address
- gender
- location
- class: class.user.{guest, admin}
- permissions: ['publish #', 'subscribe #', 'pubsub #']

**Table Notifcation**