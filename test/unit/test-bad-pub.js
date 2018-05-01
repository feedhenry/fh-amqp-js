var proxyquire =  require('proxyquire');
var util = require('util');
var amqpMock = require('./mocks.js').amqpMockBadAckExchange;
var assert = require('assert');

// test bad pub
exports.test_bad_pub = function(done) {

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
  amqpManager.publishTopic("fh-topic1", "fh.event.count", {count: 1}, function(err) {
    assert.ok(err, "Expected to get an error from bad publish");
  });

  // sleep, then do various checks
  setTimeout(function() {
    done();
  }, 100);
};
