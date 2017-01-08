# Socket.io protocol
## Send message
Client send an object
```bash
  'new message': {
    to: (destination_userid),
    msg: (msg)
  }
```

Server send an object
```bash
  'broadcast msg': {
    id,
    sender,
    msg
  }
  'online': u_id
  'offline': u_id
```

## On client connect
Server send a list
```bash
  userlist[]{
    id,
    username
  }
```
