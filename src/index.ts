import "reflect-metadata";
import { createConnection } from "typeorm";
import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { AppRoutes } from "./routes";
import { Users } from "./entity/Users";
const fileUpload = require("express-fileupload");
// const cors = require("cors");
import * as cors from "cors";
const bcrypt = require("bcrypt");
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}


// create connection with database
// TypeORM creates connection pools and uses them for your requests
createConnection()
	.then(async (connection) => {
		//console.log(connection)
		// create express app
		const app = express();

		const corsOptions = {
			origin: true,
			methods: "GET,PUT,POST,DELETE,OPTIONS",
			allowedHeaders: "Content-Type, Authorization, Credentials, X-Requested-With, Accept, Content-Length, headers, x-auth-accesstoken, Origin, Access-Control-Allow-Origin",
			credentials: true,
			optionsSuccessStatus: 200,
		};
		//console.log("cors", cors);
		//app.options("*", cors(corsOptions));
		app.use(cors(corsOptions));

		app.use(fileUpload({ abortOnLimit: true, responseOnLimit: "File size limit has been reached" })); // safeFileNames:true
		app.use(bodyParser.json());

		app.use(express.json());
		// create user marina front
		const userRepository = getManager().getRepository(Users);
		const marina = await userRepository.find({
			where: {
				email: "marinafront@hotmail.fr",
			},
		});
		bcrypt.hash("pass123", 10, function (err, hash) {
			//console.log("1", hash);
			let user = new Users();
			user.email = "marinafront@hotmail.fr";
			user.password = hash;
			if (!marina.length) {
				userRepository.save(user);
			}
		});

		// register all application routes
		AppRoutes.forEach((route) => {
			app[route.method](route.path, ...route.middlewares, (request: Request, response: Response, next: Function) => {
				route
					.action(request, response)
					.then(() => next)
					.catch((err) => next(err));
			});
		});

		// run app
		app.listen(3001);

		console.log("Express application is up and running on port 3001");
	})
	.catch((error) => console.log("TypeORM connection error: ", error));
