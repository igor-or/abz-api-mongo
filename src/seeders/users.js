const { faker } = require('@faker-js/faker');

const Counter = require('../models/counter');
const Position = require('../models/position');
const User = require('../models/user');

class UserSeeder {
    #users;

    constructor() {
        this.#users = [];
    }

    async ensurePopulated() {
        const usersCount = await User.countDocuments();
        if (!usersCount) {
            await this.#generateRandomUsers(45);
            // await User.collection.drop(err => {
            //     if (err) {
            //         console.log('Users collection not exists');
            //     }
            // });
            await Counter.findOneAndRemove({ entity: 'User' }).exec();
            await User.insertMany(this.#users);
            console.log('Users seeded to database');
        }
    }

    async #generateRandomUsers(usersCount) {
        const numberOfPositions = await Position.count();

        const currentYear = new Date().getFullYear();

        for (let i = 1; i <= usersCount; i++) {
            const firstName = faker.name.findName();
            const positionId = Math.floor(
                Math.random() * numberOfPositions + 1
            );

            const position = await Position.findById(positionId).exec();

            const newRandomUser = {
                _id: i,
                name: firstName,
                email: faker.internet.email(firstName).toLowerCase(),
                phone: faker.phone.number('+380#########'),
                position: position.name,
                position_id: position.id,
                registration_timestamp: faker.date
                    .between(
                        new Date(currentYear - 60, 0, 1),
                        new Date(currentYear - 18, 0, 1)
                    )
                    .getTime(),
                photo: faker.image.avatar(),
            };
            this.#users.push(newRandomUser);
        }
    }
}

module.exports = new UserSeeder();
