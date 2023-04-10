const celery = require("celery-node");

const logger = require("../log");

const config = require("../Config");

const client = celery.createClient(
  config.CELERY_BROKER_URL,
  config.CELERY_BROKER_URL
);

logger.info(`Connecting to celery broker: ${config.CELERY_BROKER_URL}`);

module.exports = client;
