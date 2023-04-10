module.exports = {
    PORT: process.env.PORT || 5000,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    SERVER_URL: process.env.SERVER_URL || "http://localhost:5000/api/v1",
    DATABASE: process.env.DATABASE || 'mongodb://localhost:27017/aiclub',
    DRIVE_FILE_ID : process.env.DRIVE_FILE_ID,
    COMPETITION_DRIVE_FILE_ID : process.env.COMPETITION_DRIVE_FILE_ID,
    CELERY_BROKER_URL: process.env.CELERY_BROKER_URL || "amqp://localhost",
    LOG_LEVEL: process.env.LOG_LEVEL || "debug",
} 