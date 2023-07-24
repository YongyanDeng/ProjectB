const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    document_type: {
        type: String,
        required: true,
    },
    file_name: {
        type: String,
        required: true,
    },
    file_url: {
        type: String,
        required: true,
    },
    upload_date: {
        type: Date,
        default: Date.now,
    },
});

// Export the subdocument schema
module.exports = documentSchema;
