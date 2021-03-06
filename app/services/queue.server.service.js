/* jshint ignore:start */
const EventEmitter = require('events');
const Connector = require('./_connector');
const logger = require('../../config/logger');
const formatEvent = require('../utils/formatEvent');
const { sendEvent } = require('./events');

class QueueApp extends EventEmitter {
  constructor(config, prefetch) {
    if (!config.updateQueue || !config.updateExchange) {
      throw new Error('Missing necessary message queue information');
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
    const options = { durable: true, autoDelete: false };
    // Set DL queu for retry
    const deadLetterOptions = Object.assign({}, options, {
      arguments: {
        'x-message-ttl': this.config.deadLetterTTL,
        'x-dead-letter-exchange': this.config.updateExchange,
        'x-dead-letter-routing-key': this.config.updateQueue
      }
    });

    const ok = this.connection.defaultChannel();
    ok.then(() => this.connection.assertExchange(this.config.updateExchange, 'direct', options));
    ok.then(() => this.connection.assertQueue(this.config.updateQueue, options));
    ok.then(() => this.connection.assertQueue(this.config.deadLetterQueue, deadLetterOptions));
    ok.then(() => this.connection.bindQueue(this.config.updateQueue, this.config.updateExchange,
      this.config.updateQueue));
    ok.then(() => this.connection.bindQueue(this.config.deadLetterQueue, this.config.updateExchange,
      this.config.deadLetterQueue));
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

  publish(queueName, task) {
    return this.connection.publish(this.config.updateExchange, queueName, JSON.stringify(task));
  }

  countQueueMessages(queueName) {
    return this.connection.countMessages(queueName);
  }

  /* istanbul ignore next */
  closeChannel() {
    return this.connection.closeChannel();
  }

  closeConnection() {
    return this.connection.closeConnection();
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

  async onTask(task) {
    if (!this.eventConsumer) {
      this.eventConsumer = task.fields.consumerTag;
    }
    this.emit('processing-task', 'queue: ' + task.fields.routingKey);
    let e = JSON.parse(task.content.toString());
    if (!e) {
      return this.connection.ack(task);
    }

    try {
      await sendEvent(formatEvent(e));
      logger.info('update message processed');
    } catch (err) {
      logger.error(`Couldn't send event: ${err}`);
      try {
        await this.publish(this.config.deadLetterQueue, e);
      } catch (err) {
        logger.error(`Could not publish to DL Queue: ${err}`);
      }
    }
    this.connection.ack(task);
  }
}

module.exports = QueueApp;
/* jshint ignore:end */
