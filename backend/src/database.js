#!/use/bin/env node
const mongo = require("mongodb").MongoClient;

class Database {
	static instance;
	#databaseName;
	#url;
	#db;
	#collections;

	constructor() {
		this.#url          = 'mongodb://' + process.env.DATABASE_URL;
		this.#databaseName = "todo";
		this.#collections  = {};
	}

	// CREATE
	async init() {
		const client = await mongo.connect(this.#url);
		this.#db = client.db(this.#databaseName);
	}

	// READ
	static async getInstance() {
		if(Database.instance) {
			return Database.instance;
		}
		console.log("craete database");
		Database.instance = new Database();
		await Database.instance.init();
		return Database.instance;
	}

	getCollection(collection) {
		return this.#collections.collection;
	}

	doesCollectionExist(collection) {
		return collection in this.#collections;
	}

	// UPDATE
	addCollection(collection) {
			this.#collections.collection = this.#db.collection(collection);
	}

	// DELETE
};

async function connectDatabase() {
	const database = await Database.getInstance();

	const dbProxy = new Proxy(database, {
		get: function(db, collection, receiver) {

			// Check for collections
			if(db.doesCollectionExist(collection)) {
				return target.getCollection(collection);

				// Add collection
			} else {
				db.addCollection(collection);
				return db.getCollection(collection);
			}
		}
	});
	return dbProxy;
};

module.exports = { connectDatabase };
