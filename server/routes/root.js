'use strict'

import fastifyMongodb from "@fastify/mongodb";

const db_name = "planning_poker";
const collection_name = "rooms";

export default async function (fastify, opts) {
	fastify.register(fastifyMongodb, {
		url: "mongodb://localhost:27017/" + db_name,
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



