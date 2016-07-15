var proxyquire =  require('proxyquire');
var util = require('util');
var amqpMock = require('./mocks.js').amqpMockDestroyedConnection;
var assert = require('assert');

// test when a connection is destroyed
exports.test_connection_destroyed = function(done) {

  var fhamqpjs = proxyquire('amqpjs.js', { 'amqp': amqpMock});
  var cfg = {
    clusterNodes: ["amqp://mock/url"],
    maxReconnectAttempts: 2,
    options: {
      connectionTimeout:50
    }
  };

  var amqpManager = new fhamqpjs.AMQPManager(cfg);
  amqpManager.connectToCluster();

  amqpManager.publishTopic("fh-topic1", "fh.event.count", {}, function(err) {
    assert.ok(err, "Expected a callback error!");
  });

  // sleep, then do various checks - TODO: what checks?
  setTimeout(function() {
    done();
  }, 100);
};
