module.exports = {
    PORT: process.env.PORT || 5000,
    SERVER_URL: process.env.SERVER_URL ||  "http://localhost:5000",
    CLIENT_URL: process.env.CLIENT_URL ||  "http://localhost:3000",
    DATABASE: "mongodb://localhost:27017/aiclub",
    // DATABASE: process.env.DATABASE || "mongodb://localhost:27017/aiclub",
} 