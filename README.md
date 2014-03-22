# Pulsar

I whipped this together on a moment's notice to gain access to more bandwidth
during a popular post's outburst.

## Installation

```
git clone https://github.com/robcolbert/pulsarcms.git
```

## Usage


### MongoDB

To kill any running mongod and start a new one with the configuration
found in this directory:

```
cd pulsarcms/data
./start
```

### Pulsar API Server
To start the API server directly in node: 

```
cd pulsarcms/api
./start
```

Grunt can also be used to start the server and is useful for live-hacking...but not ideal at all.

The API server's winston log file needs manually cleaned/rotated.

API client sessions are managed with signed cookies in memcached. If a single
request directly to http://robcolbert.com:10010/posts, for example, takes about
30 seconds then logs, "ECONNREFUSED" or similar, you forgot to start memcached.
It is expected to be running on 127.0.0.1:11211 and not bound to 0.0.0.0.

### HTML5 SPA Front End

```
cd pulsarcms/frontend
grunt build
```

Grunt builds the HTML5 SPA client to /opt/robcolbert/frontend/dist. It is a
cache-busted, packed and optimized build of the default client. Simply point an
httpd at that directory as the web root exposed publicly as TCP/80, and it's
online.
