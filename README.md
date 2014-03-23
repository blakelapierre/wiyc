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

## Notes
- If you run the API server under Grunt and perform a "git pull origin master" on your box, you probably just restarted your API server. Hope everyone's okay with that!
- The API server's Winston log file needs manually rotated. cron is your friend.
- API client sessions are managed with signed cookies in memcached.
- If a single request to http://api.yourserver.com:10010/sessions, for example, takes about 30 seconds and then logs "ECONNREFUSED" or similar - you need to start memcached. It is not optional, and is expected to be running on 127.0.0.1:11211 (not 0.0.0.0).

### HTML5 SPA Front End
Sales, marketing, management and all of their associated buzzwords all live in the frontend directory. In fact, they are confined to the frontend directory. They aren't allowed in the API directory and, depending on where you work, management, sales and marketing probably shouldn't be told the API server exists. They might decide to go have a look at it to see what additional value or profit they can extract from it. And, that's when I behead them with a Samurai sword. Pull request rejected. Stuff like that.

Remember: When you present to management, you *only* talk about the frontend directory. And, when you present to your IT department, you try as hard as possible to *only* talk about the API server. Application developers go in the frontend directory. Data architects go in the API directory. CSS design gods? That's right! The frontend directory! (you're getting good at this). How about: 

Crossing these two streams is just as illegal is it is in the movie Ghostbusters. Do not cross the streams.

```
cd pulsarcms/frontend
  grunt build
```

Grunt builds the HTML5 SPA client to /opt/robcolbert/frontend/dist. It is a
cache-busted, packed and optimized build of the default client. Simply point an
httpd at that directory as the web root exposed publicly as TCP/80, and it's
online.
