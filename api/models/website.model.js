import mongoose from 'mongoose';

const downtimeSchema = new mongoose.Schema({
    url: { 
        type: String, 
    },
    logs: [{
        status: { 
            type: String, 
            required: true 
        },
        timestamp: { 
            type: Date, 
            default: Date.now 
        },
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

downtimeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days expiration

const Downtime = mongoose.model('Downtime', downtimeSchema);

export default Downtime;
