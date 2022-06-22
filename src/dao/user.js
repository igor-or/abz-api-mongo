const User = require('../models/user');
const Position = require('../models/position');

class UserDao {
    async count() {
        return User.countDocuments();
    }

    async getAll(offset, limit) {
        const fetchedUsers = await User.find()
            .sort({ _id: -1 })
            .skip(offset)
            .limit(limit)
            .exec();

        if (!fetchedUsers) {
            return [];
        }

        return fetchedUsers.map(user => {
            return { id: user.id, ...user.toObject() };
        });
    }

    async getById(id) {
        const fetchedUser = await User.findById(id)
            .select('-registration_timestamp')
            .exec();

        if (!fetchedUser) {
            errorData = { userId: 'User not found' };
            const error = new Error(
                'The user with the requested identifier does not exist.'
            );
            error.statusCode = 404;
            error.data = errorData;
            throw error;
        }

        return fetchedUser;
    }

    async getByEmail(email) {
        return User.findOne({ email: email }).exec();
    }

    async getByPhone(phone) {
        return User.findOne({ phone: phone }).exec();
    }

    async create(userData) {
        const position = await Position.findById(userData.position_id);

        const user = new User({ ...userData, position: position.name });
        await user.save();
        return user;
    }
}

module.exports = new UserDao();
