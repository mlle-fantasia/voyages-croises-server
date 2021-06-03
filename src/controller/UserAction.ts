import { LOADIPHLPAPI } from "dns";
import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Users } from "../entity/Users";
const fs = require("fs-extra");
const path = require("path");

/**
 * Loads all posts from the database.
 */
export async function userGetAction(request: Request, response: Response) {
	const entities = await getRepository(Users)
		.createQueryBuilder("user")
		.select(["user.id", "user.email", "user.firstname"])
		.getMany();
	response.send(entities);
}

export async function userPutAction(request: Request, response: Response) {
	const userRepository = getManager().getRepository(Users);

	const user = await userRepository.findOne(request.params.id);

	user.email = request.body.email;
	user.firstname = request.body.firstname;

	await userRepository.save(user);
	response.send(user);
}


