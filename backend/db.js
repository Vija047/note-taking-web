const mongoose = require('mongoose');
const connectd = async function () {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connected");
    } catch (error) {
        console.error("mongo not connected:", error);
        process.exit(1);
    }
}
// Export the mongo function for use in other modules
module.exports = connectd;