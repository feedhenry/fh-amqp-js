var proxyquire =  require('proxyquire');
var util = require('util');
var amqpMock = require('./mocks.js').amqpMock;
var assert = require('assert');

// test basic pub
exports.test_pub = function(done) {

  var fhamqpjs = proxyquire('amqpjs.js', { 'amqp': amqpMock});
  var connected = false;

  var cfg = {
    clusterNodes: ["amqp://test:test@mock/url", "amqp://mock2/url"],
    maxReconnectAttempts: 2,
    options:{}
  };

  var amqpManager = new fhamqpjs.AMQPManager(cfg);
  amqpManager.connectToCluster();
  amqpManager.publishTopic("fh-topic1", "fh.event.count", {count: 1}, function(err) {
    assert.ifError(err, "Unexpected error: " + util.inspect(err));
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

exports.test_rpc_success = function(done) {
  var testCorrelationId = "testCorrelationId";
  var mockUUID = {
    v4: function() {
      return testCorrelationId;
    }
  };
  var fhamqpjs = proxyquire('amqpjs.js', { 'amqp': amqpMock, 'node-uuid': mockUUID});
  var cfg = {
    clusterNodes: ["amqp://test:test@mock/url", "amqp://mock2/url"],
    maxReconnectAttempts: 2,
    options:{}
  };
  var amqpManager = new fhamqpjs.AMQPManager(cfg);
  amqpManager.connectToCluster();

  var callbackCalled = false;
  amqpManager.on("connection", function() {
    amqpManager.rpcRequest("fh-topic2", "fh.logs.test", {count: 2}, function(err, result) {
      assert.ok(!err);
      assert.ok(result && result.message === 'ok');
      callbackCalled = true;
    });

    amqpManager.getConnection(function(err, connection) {
      assert.ok(!err);
      connection.queue('', {}, function(q) {
        callbackQ = q;
        q.callSubs({message: 'ok'}, {}, {correlationId: testCorrelationId});
      });
    });
  });

  setTimeout(function() {
    assert.ok(callbackCalled);
    done();
  }, 100);
};

exports.test_rpc_timeout = function(done) {
  var fhamqpjs = proxyquire('amqpjs.js', { 'amqp': amqpMock});
  var cfg = {
    clusterNodes: ["amqp://test:test@mock/url", "amqp://mock2/url"],
    maxReconnectAttempts: 2,
    options:{}
  };
  var amqpManager = new fhamqpjs.AMQPManager(cfg);
  amqpManager.connectToCluster();

  var callbackCalled = false;
  amqpManager.on("connection", function() {

    amqpManager.rpcRequest("fh-topic3", "fh.logs.test", {count: 3}, {timeout: 100}, function(err) {
      assert.ok(err);
      assert.ok(err === 'timeout');
      callbackCalled = true;
    });
  });

  setTimeout(function() {
    assert.ok(callbackCalled);
    done();
  }, 150);
};
