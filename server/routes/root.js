'use strict'

import fastifyMongodb from "@fastify/mongodb";
import process from "process";

const db_name = "agile_estimations";
const collection_name = "rooms";

const mode = "prod";

const dev_url = "mongodb://localhost:3000/" + db_name;
const prod_url = process.env.MONGODB_URI + "/" + db_name;

export default async function (fastify, opts) {
	fastify.register(fastifyMongodb, {
		url: mode === "dev" ? dev_url : prod_url
	});

	fastify.get('/', async (request, reply) => {
		return { hello: 'world' }
	});
	// Create Room Collection with TTL index
	fastify.addHook("onReady", async () => {
		const db = fastify.mongo.db;
		const roomsCollection = db.collection(collection_name);

		// Create TTL index on 'createdAt' field with expiration time of 3 days
		await roomsCollection.createIndex(
			{ createdAt: 1 },
			{ expireAfterSeconds: 259200 }
		);
	});

	fastify.addHook("onError", async (request, reply, error) => {
		console.error(error);
	});
}



