// import documentSchema from "./document";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (emailInput) {
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                return emailRegex.test(emailInput);
            },
            message: "Invalid Email",
        },
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        middle_name: {
            type: String,
        },
        preferred_name: {
            type: String,
        },
    },
    profile_picture: {
        data: Buffer, // To store the binary image data
        contentType: String, // To store the MIME type of the image
    },
    role: {
        type: String,
        default: "Employee",
    },
    address: {
        building_apt: {
            type: String,
            required: true,
        },
        street_name: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zip: {
            type: String,
        },
    },
    contact_Info: {
        cell_phone: {
            type: String,
        },
        work_phone: {
            type: String,
        },
    },
    identification_info: {
        SSN: {
            type: String,
        },
        date_of_birth: {
            type: Date,
        },
        gender: {
            type: String,
        },
    },
    work_authorization: {
        type: String,
    },
    reference: {
        referee_info: {
            first_name: {
                type: String,
            },
            last_name: {
                type: String,
            },
            middle_name: {
                type: String,
            },
            phone: {
                type: String,
            },
            email: {
                type: String,
            },
            relationship: {
                type: string,
            },
        },
        Emergency_contact: {
            first_name: {
                type: String,
            },
            last_name: {
                type: String,
            },
            middle_name: {
                type: String,
            },
            phone: {
                type: String,
            },
            email: {
                type: String,
            },
            relationship: {
                type: string,
            },
        },
    },
    onboarding_status: {
        type: String,
        enum: ["Never submitted", "Pending", "Rejected", "Approved"],
        default: "Never submitted",
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
        },
    ],
    document_status: {
        type: String,
    },
    steps: ["OPT Receipt", "OPT EAD", "I-983", "I-20"],
    current_file_step: {
        type: Number,
        default: 0,
    },
});

// encrypt password
employeeSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

// create user's role
employeeSchema.pre("save", async function (next) {
    try {
        if (this.email.includes("@hr.com")) this.role = "HR";
        return next();
    } catch (err) {
        return next(err);
    }
});

// password matching
employeeSchema.methods.comparePassword = async function (candidatePassword, next) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return next(err);
    }
};

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
