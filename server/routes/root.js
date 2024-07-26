'use strict'

import fastifyMongodb from "@fastify/mongodb";
import process from "process";

const db_name = "agile_estimations";
const collection_name = "rooms";

export default async function (fastify, opts) {
	fastify.register(fastifyMongodb, {
		url: "mongodb://" + process.env.DB_URL+ ":" + process.env.DB_PORT + "/" + db_name,
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



