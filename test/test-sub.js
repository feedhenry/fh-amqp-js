var proxyquire =  require('proxyquire');
var util = require('util');
var amqpMock = require('./mocks.js').amqpMock;
var assert = require('assert');

// test basic sub
exports.test_sub = function(done) {

  var fhamqpjs = proxyquire('amqpjs.js', { 'amqp': amqpMock});
  var connected = false;

  var cfg = {
    // note: purposely stringified for this test, should be handled ok
    clusterNodes: JSON.stringify(["amqp://mock/url"]),
    maxReconnectAttempts: 2
  };

  var amqpManager = new fhamqpjs.AMQPManager(cfg);
  amqpManager.connectToCluster();
  amqpManager.subscribeToTopic("fh-topic1", "fh-topic-1", "fh.#", function() {}, function(err) {
    assert.ifError(err, "Unexpected error: " + util.inspect(err));
    amqpManager.disconnect();
  });

  amqpManager.on("connection", function() {
    connected = true;
  });

  // sleep, then do various checks
  setTimeout(function() {
    assert.equal(connected, true, "Failed to get connect event");
    done();
  }, 100);
};
