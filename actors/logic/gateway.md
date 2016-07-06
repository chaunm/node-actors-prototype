Gateway
===================


# Overview

This actor acts as a gateway for Users to interact with. 

User actors can `only` interact with
- `service/gateway`
- `service/bonjour`

It must conform `Actor Commons` (see more in `../actor-system.md`)

# A. UID
The actor's local UID is: `service/gateway`

# B. Mailboxes
The actor uses following mailboxes

## 1. Requests
### 1.1.1 Create or Update
**mailbox:** `request/actors/set`
