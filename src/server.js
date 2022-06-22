const mongoose = require('mongoose');

const app = require('./app');

const config = require('./config');
const seeder = require('./seeders/seeder');

class Server {
    constructor() {
        this.app = app;
    }

    static async build() {
        await this.#setup();
        return new Server();
    }

    static async #setup() {
        const db = mongoose.connection;
        db.on('error', error => console.error(error));
        db.once('open', () => console.log('Connected to database'));

        await mongoose.connect(config.MONGODB_URL);        
        await seeder.ensurePopulated();
    }

    run(port) {
        this.server = this.app.listen(port, () => {
            console.log(`API is listening on port ${port}`);
        });
    }

    stop(done) {
        this.server.close(done);
    }
}

module.exports = Server;
