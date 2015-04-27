
var http = require('https');
var fs = require('fs');
var querystring = require('querystring');
var FormData = require('form-data');

var Thingiverse = function( options ) {
  // set up network params, you shouldn't need to do anything here
  this.hostname = "thingiverse.com";
  this.api_hostname = "api.thingiverse.com";
  this.port = 443;
  if ( options.hostname ) {
    this.hostname = options.hostname;
    if ( this.hostname.match(/staging/) )
      this.api_hostname = "api-"+this.hostname;
    else
      this.api_hostname = "api."+this.hostname;
  }
  if ( options.port )
    this.port = options.port;

  // pass in a thingiverse_token
  // see thingiverse.com/developers to learn how to get one
  if ( typeof(options)=="string" ) {
    this.token = options;
    return;
  }
  if ( options.token ) {
    this.token = options.token;
    return;
  }

  // only ever set these when using this on the server side only!
  this.app_id = options.app_id;
  this.app_secret = options.app_secret;
  if ( !this.app_id || !this.app_secret ) {
    throw new Exception("Thingiverse: attempt to initialize without app id");
  }
}

Thingiverse.prototype.get = function( path, callback )
{
  this.payloadRequest( "GET", path, {}, callback);
}
Thingiverse.prototype.remove = function( path, callback )
{
  this.payloadRequest( "DELETE", path, {}, callback);
}
Thingiverse.prototype.post = function( path, object, callback )
{
  this.payloadRequest( "POST", path, object, callback);
}
Thingiverse.prototype.patch = function( path, object, callback )
{
  this.payloadRequest( "PATCH", path, object, callback);
}

Thingiverse.prototype.payloadRequest = function( method, path, object, callback )
{
  if ( path.substring(0, 7)=='http://' || path.substring(0, 8)=='https://' )
    path = path.split('/').slice(3).join('/');
  if ( path[0]!=='/' )
    path = '/'+path;
  var options = {
    host: this.api_hostname,
    port: this.port,
    path: path,
    method: method,
    headers: {
        'Authorization': 'Bearer '+this.token,
    }
  };
  var payload_req = http.request(options, function(res) {
    if ( res.statusCode!=200 )
    {
      callback( method+" to "+path+" returned "+res.statusCode );
    }
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      data = JSON.parse(data);
      if ( typeof(callback)=='function' )
        callback(undefined, data);
    });
    res.on('error', function(err) {
      callback(err);
    });
  })

  payload_req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  var body = JSON.stringify(object);
  payload_req.write(body);

  payload_req.end();
}

function upload( uploadData, filePath, callback )
{
  if ( typeof(uploadData)=='string' )
    uploadData = JSON.parse(uploadData);

  var form = new FormData();
  for ( var name in uploadData.fields )
    if(uploadData.fields.hasOwnProperty(name))
      form.append(name, uploadData.fields[name]);
  form.append('file', fs.createReadStream(filePath));

  var request = form.submit(uploadData.action, function(err, res) {
    if ( res!=undefined && res.statusCode==303 )
    {
      post(res.headers.location, {}, function(err, data){
        if ( typeof(callback)=='function' )
          callback(undefined, data);
      });
      // seems that amazon isn't closing these sockets promptly, we may need to edited form_data.js to give access to the request and force close it here
      form.request.abort();
    }
    else
      console.log(res.headers);
  });
}


// exchange a username, password, app_id, and app_secret for a token
// don't call this, it won't always work!
// your user may not have authorized this app to access his/her api account
Thingiverse.prototype.authenticate = function( callback ) {
  if ( this.token ) {
    callback();
  } else {
    console.log("Error: tried to use thingiverse api without oauth token");
    this.login( function( cookie ) {
      this.requestAccessCode( function(code) {
        this.requestAccessToken( callback );
      });
    });
  }
}

// set your redirect_url to urn:ietf:wg:oauth:2.0:oob and bring them to this url
// in order to let them sign in and get a thingiverse_token
Thingiverse.prototype.getRedirectUrl = function()
{
  return 'http://'+this.hostname+':'+this.port+'/login/oauth/authorize?client_id='+this.app_id;
}

Thingiverse.prototype.redirectForAccessCode = function(httpResponse, args)
{
  var get_args = "";
  if ( typeof(args)=='object' )
  {
    for ( var attribute in args )
      if ( args.hasOwnProperty(attribute))
        get_args += '&'+attribute+'='+args.attribute;
  }
  httpResponse.writeHead(302, {
    'Location': this.getRedirectUrl()+get_args
  });
  httpResponse.end();
}

module.exports = Thingiverse;
