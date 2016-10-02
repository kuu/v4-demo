# v4-demo
A sample web site for demonstrating Ooyala V4 player

## Configure
```
$ mkdir config
$ touch config/default.json
```
Edit `config/default.json` as follows:
```
{
  "api": {
    "key": "YOUR_OOYALA_API_KEY",
    "secret": "YOUR_OOYALA_API_SECRET"
  },
  "db": {
    "host": "Host name of the MongDB server (default=localhost)",
    "port": "Port number of the MongDB server (default=27017)"
  },
  "facebook": {
    "appID:: "YOUR_FACEBOOK_APP_ID",
    appSecret: "YOUR_FACEBOOK_APP_SECRET",
    "authCallback": "YOUR_FACEBOOK_APP_OAUTH_CALLBACK"
  },
  "player": {
    "pcode": "Provider ID",
    "id": "Player ID",
    "version": "Player Version"
  }
}
```

## Run (Docker)
Install Docker engine on your system.
```
$ docker run --name mymongo -d mongo
$ docker run --link=mymongo:mongodb -v $(pwd)/config:/usr/src/app/config -p 4000:4000 -d kuuu/oodump-webapp
```
Open localhost:4000 with your browser.

## Run (Manual)
Install Node.js (version 6+) and MongoDB on your system.
```
$ git clone git@github.com:kuu/v4-demo.git
$ cd v4-demo
$ npm install
$ npm run build
$ npm start
```
Open localhost:4000 with your browser.

## Run (Develop)
```
$ npm run watch
```
This automatically opens localhost:9000 with your browser.
