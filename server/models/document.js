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
    file_type: {
        type: String,
        required: true,
    },
    file_content: {
        type: Buffer,
        required: true,
    },
    upload_date: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
});

// Export the subdocument schema
const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
