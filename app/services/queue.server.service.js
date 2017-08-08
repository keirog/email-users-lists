const EventEmitter = require('events');
const Connector = require('./_connector');
const logger = require('../../config/logger');

class QueueApp extends EventEmitter {
  constructor(config, prefetch) {
    if (!config.updateQueue) {
      throw new Error('No queue name specified');
    }
    super();
    this.config = config;
    this.prefetch = prefetch;
    this.connection = new Connector(config.rabbitUrl);
    this.connection.on('ready', this.onConnected.bind(this));
    this.connection.on('lost', this.onLost.bind(this));
    this.connection.on('error', this.onError.bind(this));
  }

  onConnected() {
    let options = { durable: true };
    let ok = this.connection.defaultChannel();
    ok.then(() => this.connection.assertQueue(this.config.updateQueue, options));
    ok.then(() => this.connection.setPrefetch(this.prefetch));
    ok.then(() => this.connection.recover());
    ok.then(() => this.emit('ready'));
    ok.catch(this.onError);
  }

  onLost() {
    logger.info('connection to queue lost');
    this.emit('lost');
  }

  onError() {
    logger.error('error with queue connection');
    this.emit('lost');
  }

  publish(task, queueName) {
    return this.connection.sendToQueue(JSON.stringify(task), queueName);
  }

  countQueueMessages(queueName) {
    return this.connection.countMessages(queueName);
  }

  /* istanbul ignore next */
  closeChannel() {
    return this.connection.closeChannel();
  }

  purgeQueue(queueName) {
    return this.connection.purgeQueue(queueName);
  }


  startConsumingEvents() {
    this.connection.consume(this.config.updateQueue, this.onTask.bind(this));
  }

  stopConsuming(consumerTag) {
    this.connection.cancel(consumerTag);
  }

  onTask(task) {
    if (!this.eventConsumer) {
      this.eventConsumer = task.fields.consumerTag;
    }
    this.emit('processing-task', 'queue: ' + task.fields.routingKey);
    let e = JSON.parse(task.content.toString());
    if (!e) {
      return this.connection.ack(task);
    }

    this.sendEvent(e);
    this.connection.ack(task);
  }

  sendEvent(event) {
    logger.info('update message processed');
    // TODO
  }
}

module.exports = QueueApp;
