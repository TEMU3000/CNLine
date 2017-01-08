# Socket.io protocol
## Send message
Client send an object
```bash
to: (destination_userid),
msg: (msg)
```

## On client connect
Server send a list
```bash
  userlist[]{
    id,
    username
  }
```
