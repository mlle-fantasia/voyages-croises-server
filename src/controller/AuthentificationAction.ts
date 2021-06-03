import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import { Users } from "../entity/Users";
var jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

/**
 * 
 */
export async function authAction(request: Request, response: Response) {
	console.log("autologin")
	const userRepository = getManager().getRepository(Users);
	const users = await userRepository.find({
		where: {
			email: request.body.login,
		},
	});
	if (!users.length) {
		response.send("pas ok");
		return;
	}
	let hash = users[0].password;
		bcrypt.compare(request.body.pass, hash).then(async function (res) {
			if (res) {
				let token = jwt.sign({ id: users[0].id }, process.env.TOKEN_KEY, { expiresIn: 60 * 60 });
				var refreshtoken = jwt.sign({ id: users[0].id }, process.env.TOKEN_KEY, { expiresIn: 600 * 600 });
				//res.send({ success: "connexion_ok", data: { token, users[0], refreshtoken } });
				//let token = generateToken();
				response.send({ token });
				return;
			} else {
				response.status(401);
				response.send("pas ok");
				return;
			}

		}).catch((err) => {
			response.status(500);
			response.send("error");
		});

}

function generateToken() {
	var jeton = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 60 * 60, foo: "bar" }, process.env.TOKEN_KEY);
	return jeton;
}

	/**
	 * login
	 * vérifie si l'utilisateur exite avec cette adresse mail, vérifie le mot de passe
	 * si c'est ok, créer un token et un refreshtoken et les envoie
	 */
	 export async function autologin(request: Request, response: Response) {
		console.log("admin/autologin");
		let decoded = {id:0};
		try {
			decoded = jwt.verify(request.body.token, process.env.TOKEN_KEY);
		} catch (error) {
			return response.status(401).send();
		}
		const userRepository = getManager().getRepository(Users);
		const user = await userRepository.findOne({
			where: {
				id: decoded.id,
			},
		});
		if (!user) return response.send({ err: "user_not_found", errtxt: "utilisateur non trouvé" });

		response.send({ success: "connexion_ok", data: user });
	};
