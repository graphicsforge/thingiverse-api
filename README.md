Interface to the Thingiverse API
---
**Getting started**

 1. `npm install thingiverse-api`
 1. sign in to thingiverse and create an app, when given the option to set a callback url, set it to `urn:ietf:wg:oauth:2.0:oob`
 1. Direct your user to `https://www.thingiverse.com/login/oauth/authorize?client_id=<your apps' client id>` and get a thingiverse token.
 1. Query the user for that token and initialize the thingiverse-api with it


**Usage**

    var ThingiverseAPI = require('thingiverse-api');
    var thingiverse = new ThingiverseAPI(the_users_thingiverse_token);
    thingiverse.get('users/me', function(err, data) {
      console.log("you are signed in as " + data.name);
      thingiverse.get('users/'+data.name+'/things', function(err, data) {
        console.log("you have " + data.length + " things");
      });
    });

