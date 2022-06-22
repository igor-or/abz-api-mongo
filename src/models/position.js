const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const positionSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                return ret;
            },
        },
    }
);

module.exports = mongoose.model('Position', positionSchema);
