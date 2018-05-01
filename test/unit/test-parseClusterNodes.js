var parseClusterNodes = require('../../lib/parseClusterNodes.js');
var assert = require('assert');

exports.test_parse_cluster_nodes = function(done) {

  var nodes = ['amqp://user1:pass1@localhost:5672/test'];
  var parsed = parseClusterNodes(nodes);
  assert.equal(parsed.host, 'localhost');
  assert.equal(parsed.login, 'user1');
  assert.equal(parsed.password, 'pass1');
  assert.equal(parsed.vhost, 'test');

  nodes = ['amqp://user2:pass2@localhost:5672/test1', 'amqp://host2'];
  parsed = parseClusterNodes(nodes);
  assert.equal(parsed.host.length, 2);
  assert.equal(parsed.host[0], 'localhost');
  assert.equal(parsed.host[1], 'host2');
  assert.equal(parsed.login, 'user2');
  assert.equal(parsed.password, 'pass2');
  assert.equal(parsed.vhost, 'test1');

  done();
};
