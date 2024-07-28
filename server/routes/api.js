"use strict";

import fastifyMongodb from "@fastify/mongodb";
import websocket from "@fastify/websocket";
import process from "process";
import cors from "@fastify/cors";

const db_name = "agile_estimations";
const collection_name = "rooms";

const mode = "prod";

const dev_url = "mongodb://localhost:3000/" + db_name;
const prod_url = process.env.MONGODB_URI + db_name;

const clientsPerRoom = new Map();

export default async function (fastify, opts) {

	fastify.register(cors, {
		origin: "*", // Allow requests from any origin
		methods: ["GET", "POST", "PUT", "DELETE"], // Allow specified methods
	});

	fastify.register(websocket, {
		options: { maxPayload: 1048576 },
	});

	fastify.get('/', async (request, reply) => {
		return { hello: 'world' }
	});

	fastify.register(fastifyMongodb, {
		url: mode === "dev" ? dev_url : prod_url
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

	fastify.register(async function (fastify) {
		fastify.post("/create-room", async (request, reply) => {
			try {
				const {
					id,
					name,
					users,
					issues,
					selectedEstimationType,
					selectedEstimationValues,
				} = request.body;

				const createdAt = new Date();

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.insertOne({
					id,
					name,
					users,
					issues,
					selectedEstimationType,
					selectedEstimationValues,
					createdAt,
				});

				reply.code(201).send(result);
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async function (fastify) {
		fastify.get("/get-room-data/:roomID", async (request, reply) => {
			try {
				const { roomID } = request.params;

				const db = fastify.mongo.db;

				const roomsCollection = db.collection(collection_name);

				const room = await roomsCollection.findOne({
					id: roomID,
				});

				if (!room) {
					reply.code(404).send("No room present");
					return;
				}

				reply.code(200).send(room);
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to get room data" });
			}
		});
	});

	fastify.register(async function (fastify) {
		fastify.post("/add-issue-to-room", async (request, reply) => {
			try {
				const {
					roomID,
					id,
					title,
					description,
					finalEstimation,
					issueStatus,
					estimations,
				} = request.body;

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.updateOne(
					{ id: roomID },
					{
						$push: {
							issues: {
								id,
								title,
								description,
								finalEstimation,
								issueStatus,
								estimations,
							},
						},
					}
				);

				reply.code(201).send(result);

				if (clientsPerRoom.has(roomID)) {
					for (const client of clientsPerRoom.get(roomID)) {
						client.send(
							JSON.stringify({
								action: "issue-added",
								id,
								title,
								description,
								finalEstimation,
								issueStatus,
								estimations,
							})
						);
					}
				}
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async function (fastify) {
		fastify.delete("/remove-issue-from-room", async (request, reply) => {
			try {
				const { roomID, id } = request.body;

				console.log("roomID: " + roomID + ", issueID: " + id);

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.updateOne(
					{ id: roomID },
					{
						$pull: {
							issues: {
								id: id,
							},
						},
					}
				);

				reply.code(201).send(result);

				if (clientsPerRoom.has(roomID)) {
					for (const client of clientsPerRoom.get(roomID)) {
						client.send(
							JSON.stringify({
								action: "issue-deleted",
								id: id,
							})
						);
					}
				}
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async function (fastify) {
		fastify.delete("/remove-user-from-room", async (request, reply) => {
			try {
				const { roomID, id } = request.body;

				console.log("roomID: " + roomID + ", user: " + id);

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.updateOne(
					{ id: roomID },
					{
						$pull: {
							user: {
								id: id,
							},
						},
					}
				);

				reply.code(201).send(result);
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async (fastify) => {
		// HTTP POST route
		fastify.post("/user-estimate-issue", async (request, reply) => {
			try {
				const { roomID, issueID, userID, estimation } = request.body;

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.updateOne(
					{ id: roomID },
					{
						$push: {
							[`issues.$[issue].estimations.${estimation}`]: userID,
						},
					},
					{
						arrayFilters: [{ "issue.id": issueID }],
					}
				);

				console.log(
					"requested with roomID" +
						request.body.roomID +
						" issueID" +
						request.body.issueID +
						" userID" +
						request.body.userID +
						" estimation" +
						request.body.estimation
				);

				reply.code(201).send(result);

				if (clientsPerRoom.has(roomID)) {
					for (const client of clientsPerRoom.get(roomID)) {
						client.send(
							JSON.stringify({
								action: "user-estimated-issue",
								userID,
								issueID,
								estimation,
							})
						);
					}
				}
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async (fastify) => {
		// HTTP POST route
		fastify.post("/update-final-estimation", async (request, reply) => {
			try {
				const { roomID, selectedEstimationType, issueID } = request.body;

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.findOne({
					id: roomID,
				});

				const issue = result.issues.find((issue) => issue.id === issueID);

				const estimations = issue.estimations;

				let final_estimation;

				if (
					selectedEstimationType === "T-Shirt Sizes" ||
					selectedEstimationType === "Custom"
				) {
					const final_estimation_value = Object.keys(estimations).reduce(
						(acc, key) => {
							const estimation = estimations[key];

							if (estimation.length > acc.length) {
								return key;
							}

							return acc;
						},
						[]
					);

					final_estimation = final_estimation_value;

					const result_estimation = await roomsCollection.updateOne(
						{ id: roomID },
						{
							$set: {
								[`issues.$[issue].finalEstimation`]: final_estimation,
								[`issues.$[issue].issueStatus`]: "Estimated",
							},
						},
						{
							arrayFilters: [{ "issue.id": issueID }],
						}
					);

					reply.code(201).send(result_estimation);
				} else {
					
					const totalEstimation = Object.keys(estimations).reduce(
						(acc, key) => acc + Number(key) * estimations[key].length,
						0
					);
			
				
					const totalItems = Object.values(estimations).reduce(
						(acc, estimation) => acc + estimation.length,
						0
					);


					const avg = Math.round(totalEstimation/totalItems);

					const min = Math.min(...Object.keys(estimations).map(a => Number(a)));

					const max = Math.max(...Object.keys(estimations).map(a => Number(a)));

					final_estimation = avg;

					const result_estimation = await roomsCollection.updateOne(
						{ id: roomID },
						{
							$set: {
								[`issues.$[issue].finalEstimation`]: final_estimation,
								[`issues.$[issue].issueStatus`]: "Estimated",
							},
						},
						{
							arrayFilters: [{ "issue.id": issueID }],
						}
					);

					reply.code(201).send(result_estimation);
				}

				if (clientsPerRoom.has(roomID)) {
					for (const client of clientsPerRoom.get(roomID)) {
						client.send(
							JSON.stringify({
								action: "final-estimation-updated",
								issueID,
								issueStatus: "Estimated",
								final_estimation,
							})
						);
					}
				}
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async (fastify) => {
		// HTTP POST route
		fastify.post("/add-user-to-room", async (request, reply) => {
			try {
				const { id, user } = request.body;

				const db = fastify.mongo.db;
				const roomsCollection = db.collection(collection_name);

				const result = await roomsCollection.updateOne(
					{ id: id },
					{
						$push: {
							users: {
								name: user.name,
								id: user.id,
								type: user.type,
								isSpectator: user.isSpectator,
							},
						},
					}
				);

				reply.code(201).send(result);

				if (clientsPerRoom.has(id)) {
					for (const client of clientsPerRoom.get(id)) {
						client.send(
							JSON.stringify({
								action: "user-joined",
								user: user,
							})
						);
					}
				}
			} catch (error) {
				console.error(error);
				reply.status(500).send({ error: "Failed to create room" });
			}
		});
	});

	fastify.register(async (fastify) => {
		fastify.get(
			"/connect-to-room/:roomID",
			{ websocket: true },
			async (connection, req) => {
				const { roomID } = req.params;

				const clientsInRoom = clientsPerRoom.get(roomID) || new Set();
				clientsInRoom.add(connection);

				console.log(
					"clients in room: " +
						JSON.stringify(clientsInRoom) +
						"," +
						Array.from(clientsInRoom)
				);

				clientsPerRoom.set(roomID, clientsInRoom);

				console.log(
					"clientsPerRoom after connections: " + JSON.stringify(clientsPerRoom)
				);

				const db = fastify.mongo.db;

				const roomsCollection = db.collection(collection_name);

				const room = await roomsCollection.findOne({
					id: roomID,
				});

				if (!room) {
					connection.send(JSON.stringify({ error: "Room not found" }));
					connection.close();
					return;
				}

				console.log("room data : " + JSON.stringify(room));

				connection.roomID = room.roomID;
				connection.roomName = room.roomName;
				connection.users = room.users;
				connection.selectedEstimationType = room.selectedEstimationType;
				connection.estimationValues = room.estimationValues;
				connection.issues = room.issues;

				connection.send(
					JSON.stringify({
						action: "room-connected",
						roomID: roomID,
						name: room.name,
						users: room.users,
						issues: room.issues,
						selectedEstimationType: room.selectedEstimationType,
						estimationValues: room.estimationValues,
					})
				);

				connection.on("message", (message) => {
					// handle messages from clients
				});

				connection.on("close", () => {
					if (clientsPerRoom.has(roomID)) {
						const roomSet = clientsPerRoom.get(roomID);
						if (roomSet) roomSet.delete(connection);
					}
				});
			}
		);
	});
}
