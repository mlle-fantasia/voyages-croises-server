import { Request, Response } from "express";
import { getManager, getRepository, getConnection } from "typeorm";
/// les entités
import { Articles } from "../entity/Articles";
/// les dépendences
const fs = require("fs-extra");
const path = require("path");

/**
 * get all
 * Loads all posts from the database sauf ceux hidden. cette fonction sert à afficher sur le site
 * on récupère pas tous les champs juste ceux à afficher
 */
export async function articlesGetAllAction(request: Request, response: Response) {
	const entities = await getRepository(Articles)
		.createQueryBuilder("article")
		.select(["article.id", "article.title", "article.miniature", "article.resume", "article.langage", "article.site"])
		.where("article.hidden = :hidden", { hidden: 0 })
		.orderBy("article.order", "ASC")
		.getMany();
	response.send(entities);
}
/**
 *  * get all
 * Loads all posts from the database y compris ceux hidden. cette fonction sert à afficher sur l'espace admin
 * on récupère pas tous les champs juste ceux à afficher
 */
export async function articlesGetAllAdminAction(request: Request, response: Response) {
	const entities = await getRepository(Articles)
		.createQueryBuilder("article")
		.select(["article.id", "article.title", "article.miniature", "article.hidden", "article.order"]).orderBy("article.order", "ASC")
		.getMany();

	response.send(entities);
}


/**
 *  * get by id
 * Loads post by a given id.
 */
export async function articlesGetByIdAction(request: Request, response: Response) {
	// get a post repository to perform operations with post
	const articleRepository = getManager().getRepository(Articles);
	const article = await articleRepository.findOne(request.params.id, { relations: ["liens"] });
	// if post was not found return 404 to the client
	if (!article) {
		response.status(404);
		response.end("article not found");
		return;
	}

	// on va chercher les autres articles
	let acticlesaside = await listeAsideGetByIdAction(request.params.id);

	// si c'est l'article openclassrooms, on va chercher les projets si non on envoie le tableau de projets vide
	let projets = [];
/* 	if (article.oc) {
		projets = await getRepository(Projet)
			.createQueryBuilder("projet")
			.select(["projet.id", "projet.title", "projet.langage", "projet.site", "projet.contenu"]).orderBy("projet.order", "ASC").where("projet.hidden = :hidden", { hidden: 0 })
			.getMany();
	} */

	// return loaded article, les autres articles et les projets(vide ou pas vide)
	let dataResponse = {
		article,
		acticlesaside,
		projets,
	};
	response.send(dataResponse);
}


/**
 * 
 * @param id id d'un article
 * 
 * récupère les articles (juste le titre) qui ne sont pas égales à celui de l'id passé en paramèttre
 * c'est pour afficher la liste des autres articles dans l'asaide
 */
export async function listeAsideGetByIdAction(id) {
	const liste = await getRepository(Articles).createQueryBuilder("article").select(["article.id", "article.title"]).getMany();
	let listaside = liste.filter((article) => {
		return article.id !== parseInt(id);
	});
	return listaside;
}


/**
 * 
 * @param req 
 * @param res 
 * récupère l'image miniature de l'article enregistrée dans uploads/miniature/ 
 * avec l'id de l'article passé en params à la route
 */
export async function articlesGetMiniatureAction(req, res) {
	const articleRepository = getManager().getRepository(Articles);
	const article = await articleRepository.findOne(req.params.id);
	let ext = "";
	if (article.miniature) ext = path.extname(article.miniature).toLowerCase();

	let filenameDest = process.cwd() + "/uploads/miniatures/article" + req.params.id + ext;
	if (!fs.existsSync(filenameDest)) return res.send("not_found");

	let readStream = fs.createReadStream(filenameDest);
	readStream.pipe(res);
}
