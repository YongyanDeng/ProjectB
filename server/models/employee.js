const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        first_name: {
            type: String,
            default: "",
        },
        last_name: {
            type: String,
            default: "",
        },
        middle_name: {
            type: String,
            default: "",
        },
        preferred_name: {
            type: String,
            default: "",
        },
    },
    profile_picture: {
        type: String,
        default: "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png",
    },
    role: {
        type: String,
        default: "Employee",
    },
    address: {
        building_apt: {
            type: String,
            default: "",
        },
        street_name: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        zip: {
            type: String,
            default: "",
        },
    },
    contact_info: {
        cell_phone: {
            type: String,
            default: "",
        },
        work_phone: {
            type: String,
            default: "",
        },
    },
    identification_info: {
        SSN: {
            type: String,
            default: "",
        },
        date_of_birth: {
            type: Date,
            default: "",
        },
        gender: {
            type: String,
            default: "",
        },
    },
    work_authorization: {
        title: {
            // ["Green Card", "Citizen", "Other"]
            type: String,
            default: "",
        },
        start_date: {
            type: Date,
            default: null,
        },
        end_date: {
            type: Date,
            default: null,
        },
    },
    reference: {
        referee_info: {
            first_name: {
                type: String,
                default: "",
            },
            last_name: {
                type: String,
                default: "",
            },
            middle_name: {
                type: String,
                default: "",
            },
            phone: {
                type: String,
                default: "",
            },
            email: {
                type: String,
                default: "",
            },
            relationship: {
                type: String,
                default: "",
            },
        },
        emergency_contact: {
            first_name: {
                type: String,
                default: "",
            },
            last_name: {
                type: String,
                default: "",
            },
            middle_name: {
                type: String,
                default: "",
            },
            phone: {
                type: String,
                default: "",
            },
            email: {
                type: String,
                default: "",
            },
            relationship: {
                type: String,
                default: "",
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
    feedback: {
        type: String,
        default: "",
    },
    usCitizen: {
        type: String,
        default: "",
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
