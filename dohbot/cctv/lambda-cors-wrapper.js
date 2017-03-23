'use strict';

const https = require('https');
const http = require('http');
const url = require('url');

function buildQueryString(map) {
  const qs = [];
  for (var k in map) qs.push(k + '=' + encodeURIComponent(map[k]));
  return qs.join('&');
}

function httpsCall(opt) {
  return new Promise((success, fail) => {
    if (opt.qs) opt.path += ('?' + buildQueryString(opt.qs));
    //console.log(opt);
    const caller = (opt.protocol && 0 < opt.protocol.indexOf('https')) ? https : http;
    const req = caller.request(opt, function (res) {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => success([res.statusCode, res.headers, Buffer.concat(chunks).toString()]));
    });
    req.on('error', e => fail(e));
    if (opt.body) req.write(opt.body);
    req.end();
  });
}


exports.handler = (event, context, callback) => {
  const res = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  };

  if (!event.queryStringParameters || !event.queryStringParameters['url']) {
    res.statusCode = 404;
    callback(null, res);
    return;
  }

  var target = url.parse(event.queryStringParameters['url']);

  const opt = {
    protocol: target.protocol,
    host: target.host,
    path: '/' + target.path,
    method: event.httpMethod,
    headers: {
      'connection': 'close'
    }
  };

  httpsCall(opt)
    .then(r => {
      res.statusCode = r[0];
      for (var k in r[1])
        res.headers[k] = r[1][k];
      res.body = r[2];

      callback(null, res);
    })
    .catch(e => {
      res.statusCode = 500;
      res.body = e;
      // console.log(res);
      callback(e, res);
    });
};