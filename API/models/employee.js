const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    deductions: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Employee', employeeSchema);