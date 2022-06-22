const Position = require('../models/position');

class PositionDao {
    async getAll() {
        const positions = await Position.find().exec();

        return positions.map(position => {
            return { id: position.id, ...position.toObject() };
        });
    }
}

module.exports = new PositionDao();
