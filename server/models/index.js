require("dotenv").config();
const cron = require("node-cron");
const RegisterToken = require("./registerToken");
const mongoose = require("mongoose");

mongoose.set("debug", true);

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");

        // Automatically update registerToken's status
        async function updateExpiredStatus() {
            const currentTime = new Date();

            try {
                // Find documents with expiresAt in the past and status not already "expired"
                const expiredTokens = await RegisterToken.find({
                    expiresAt: { $lte: currentTime },
                    status: { $ne: "expired" },
                    status: { $ne: "activated" },
                });

                if (expiredTokens.length > 0) {
                    // Update status to "expired" for each expired token
                    await Promise.all(
                        expiredTokens.map((token) => token.updateOne({ status: "expired" }))
                    );
                }
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }

        // Schedule the task to run every minute
        cron.schedule("* * * * *", () => {
            updateExpiredStatus();
        });
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

module.exports = mongoose;
module.exports.Employee = require("./employee");
module.exports.Document = require("./document");
module.exports.RegisterToken = require("./registerToken");
