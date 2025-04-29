class ExpressError extends Error {
    constructor(status, message) {
        if (!message) {
            throw new Error("Message is required for ExpressError.");
        }
        super(message); // Pass message to the parent Error constructor
        this.status = status;
    }
}

module.exports = ExpressError;