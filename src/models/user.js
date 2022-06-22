const mongoose = require('mongoose');

const Counter = require('./counter');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        _id: Number,
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        position_id: {
            type: Number,
            required: true,
        },
        registration_timestamp: {
            type: Number,
            default: Date.now(),
        },
        photo: {
            type: String,
            required: true,
            default: '',
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

userSchema.pre('save', function (next) {
    const doc = this;
    Counter.findOneAndUpdate(
        { entity: 'User' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
        function (error, counter) {
            if (error) return next(error);
            doc._id = counter.seq;
            next();
        }
    );
});

userSchema.pre('insertMany', async function (next, docs) {
    Counter.findOneAndUpdate(
        { entity: 'User' },
        { $inc: { seq: docs.length } },
        { upsert: true },
        function (error, counter) {
            if (error) return next(error);
            next();
        }
    );
});

module.exports = mongoose.model('User', userSchema);
