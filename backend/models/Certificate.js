import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    internshipDomain: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    certificateURL: {
        type: String,
        required: false
    }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
