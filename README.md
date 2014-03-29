# Pulsar

Pulsar is an advanced content management system. Its main goals are to offer the best online content creation tools atop a completely decentralized social network. It exists as a dedicated JSON data-on-wire API service and an AngularJS single-page application front end. The AngularJS client is to be regarded as the reference client. It shows you how to implement every available feature of the Pulsar API.

By adhering to a rigid set of rules guaranteeing an appropriate separation of concerns, domain owners can simply "theme" the reference client or build an entire client of their own. If, for example, you need a search engine optimized version of Pulsar that presents on the server, have at it! A supported use of Pulsar would be to build a Web application that calls the Pulsar API, presents its data and returns presented HTML.

Another supported use of the Pulsar platform is as the backing store for mobile apps. A very wide array of mobile applications can be entirely implemented with the Pulsar API as their online service.

## Installation

```
git clone https://github.com/robcolbert/pulsarcms.git
```

## Usage


### MongoDB and Memcache

The Pulsar API server requires MongoDB and memcached. To help automate the proper startup of these components, the ./data directory is provided.

It contains a script "start" that will Kill all running mongod and memcached processes, then start a new pair with the configuration found in the ./data directory. If you choose not to run MongoDB as root (advised), then you *must* kill any existing mongod and memcached services that are started by the system at boot or by the administrator as permission to kill them will be denied otherwise.

```
cd pulsarcms/data
  ./start
```

### Pulsar API Server
The Pulsar API server is what "does" everything in Pulsar. It is where pulses, user accounts and everything else in Pulsar are stored and processed.

To start the API server: 

```
cd pulsarcms/api
  ./start
```

Grunt can also be used to start the server and is useful for live-hacking (but absolutely not acceptable for production service):
```
cd pulsarcms/api
  grunt
```

#### Notes
- If you run the API server under Grunt and perform a "git pull origin master" on your box, you probably just restarted your API server. Hope everyone's okay with that!
- The API server's Winston log file needs manually rotated. cron is your friend.
- API client sessions are managed with signed cookies in memcached.
- If a single request to http://api.yourserver.com:10010/sessions, for example, takes about 30 seconds and then logs "ECONNREFUSED" or similar - you need to start memcached. It is not optional, and is expected to be running on 127.0.0.1:11211 (not 0.0.0.0).

### HTML5 SPA Front End

```
cd pulsarcms/frontend
  grunt build
```
Grunt builds the HTML5 SPA client to pulsarcms/frontend/dist. It is a cache-busted, packed and optimized build of the default client. Simply point an httpd at that directory as the web root exposed publicly as TCP/80, and it's
online.
