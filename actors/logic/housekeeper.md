Housekeeper
===================

Version | Date          | Author | Description
------- | ------------- | ------ | ---------------
1.0     | May 30th 2016 | Anh Le | Initial release

# Overview

This actor acts as a housekeeper, being responsible for everything in our system. User actors only interact with this actors.

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `system_housekeeper`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1.1 Create or Update
**mailbox:** `request/actors/set`
