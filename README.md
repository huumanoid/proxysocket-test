# proxysocket-test

Before running tests, run
```shell
npm install
```
**Note: Don't forget to install particular version of proxysocket for test. By default, npm version installed.**

To run pipes test, do following:

1) setup socks proxy. 
if you want to use your own proxy, specify it in `config.js` file.

if you don't have one, and you are using openssh sshclient and have running sshd 
on your local machine, just run
```shell
node pipes/startsocks.js
```

2) run echo server
```shell
node util/echoserver.js
```

3) Run tests. `pipes/parallel-test.js` for simultaneous sockets test, `pipes/sync-test.js` 
for case where only one socket exists in a single moment of time.
