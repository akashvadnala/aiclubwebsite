const { createLogger, transports, format } = require("winston");

const config = require("../config");

const loggerFormat = format.printf((info) => {
  let formatObject = `${info.level || "-"} ${info.timestamp || "-"} ${"-"} ${
    info.message
  }`;

  if (info.stack) {
    formatObject += `\n${info.stack}`;
  }
  return formatObject;
});

const logger = createLogger({
  level: config.LOG_LEVEL,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.colorize(),
    loggerFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.colorize(),
        loggerFormat
      ),
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    return logger.debug((message || "").trim());
  },
};

module.exports = logger;
