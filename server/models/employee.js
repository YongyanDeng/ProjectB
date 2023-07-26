// import documentSchema from "./document";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (emailInput) {
                const emailRegex =
                    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
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
        default:
            "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png",
    },
    role: {
        type: String,
        default: "Employee",
    },
    address: {
        building_apt: {
            type: String,
            // required: true,
        },
        street_name: {
            type: String,
            // required: true,
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
    contact_info: {
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
        title: {
            type: String,
        },
        start_date: {
            type: Date,
        },
        end_date: {
            type: Date,
        },
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
                type: String,
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
                type: String,
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
employeeSchema.methods.comparePassword = async function (
    candidatePassword,
    next
) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        return next(err);
    }
};

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
