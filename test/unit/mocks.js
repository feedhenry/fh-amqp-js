// proxyquire mock of aqmp module

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Queue(name) {
  EventEmitter.call(this);
  this.name = name;
}
util.inherits(Queue, EventEmitter);

Queue.prototype.subscribe = function(sub) {
  this.once('sub', sub);
};

Queue.prototype.bind = function() {

};

Queue.prototype.callSubs = function(message, headers, deliveryInfo, messageObj) {
  this.emit('sub', message, headers, deliveryInfo, messageObj);
};

function Connection(args, opts) {
  EventEmitter.call(this);
  var self = this;
  this.queues = {};
}

util.inherits(Connection, EventEmitter);

Connection.prototype.options = { url: 'amqp://mock/url'};
Connection.prototype.end = Connection.prototype.disconnect = function() {};
Connection.prototype.exchange = function(name, opts, cb) {
  var ex = {
    publish: function(topic, message, opts, cb1) { return cb1(false);},
    close :function() {}
  };
  return cb(ex);
};
Connection.prototype.queue = function(name, opts, cb) {
  if (this.queues[name]) {
    return cb(this.queues[name]);
  } else {
    var q = new Queue(name);
    this.queues[name] = q;
    return cb(q);
  }
};

var amqpMock = {
  createConnection: function(args, opts) {
    var c = new Connection(args, opts);
    setTimeout(function() {
      c.emit('ready');
    }, 10);
    return c;
  }
};

var amqpMockDestroyedConnection = {
  createConnection: function(args, opts) {
    var c = new Connection(args, opts);
    c._isClosed = true;
    return c;
  }
};

var amqpMockBadAckExchange = {
  createConnection: function(args, opts) {
    var c = new Connection(args, opts);
    c.exchange  = function(name, opts, cb) {
      var ex = {
        publish: function(topic, message, opts, cb1) { return cb1(true);},
        close: function() {}

      };
      return cb(ex);
    };
    setTimeout(function() {
      c.emit('ready');
    }, 10);
    return c;
  }
};


exports.amqpMock = amqpMock;
exports.amqpMockDestroyedConnection = amqpMockDestroyedConnection;
exports.amqpMockBadAckExchange = amqpMockBadAckExchange;