const mongoose = require("mongoose");
const Employee = require("./employee");

const documentSchema = new mongoose.Schema({
    document_type: {
        type: String,
        required: true,
        unique: true,
    },
    document_name: {
        type: String,
        required: true,
    },
    file_url: {
        type: String,
        // required: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    content: {
        type: Buffer,
        required: true,
    },
    document_status: {
        type: String,
    },
    upload_date: {
        type: Date,
        default: Date.now,
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },
});

documentSchema.pre("deleteOne", { document: true }, async function (next) {
    try {
        // find the employee and update employee.documents
        const employee = await Employee.findById(this.employee);
        employee.documents.remove(this.id);
        await employee.save();
        return next();
    } catch (err) {
        return next(err);
    }
});

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;
