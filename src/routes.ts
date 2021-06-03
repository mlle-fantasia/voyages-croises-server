import { userGetAction, userPutAction } from "./controller/UserAction";
import { articlesGetAllAction, articlesGetAllAdminAction , articlesGetMiniatureAction, articlesGetByIdAction} from "./controller/ArticlesGetAllAction";
import {
	articlesSaveAction,
	articlesPutAction,
	articlesPostMiniatureAction,
	
	articlesHiddenAction,
	articlesDeleteArticleAction,
} from "./controller/ArticlesSaveAction";
import { authAction, autologin } from "./controller/AuthentificationAction";
import { Request, Response } from "express";

var jwt = require("jsonwebtoken");

function authMiddleware(request: Request, response: Response, next) {
	try {
		jwt.verify(request.headers.authorization, process.env.TOKEN_KEY);
		next();
	} catch (error) {
		response.status(401).send();
	}
}

/**
 * All application routes.
 */
export const AppRoutes = [
	{
		path: "/",
		method: "get",
		action: articlesGetAllAction,
		middlewares: [],
	},
	{
		path: "/login",
		method: "post",
		action: authAction,
		middlewares: [],
	},
	{
		path: "/autologin",
		method: "post",
		action: autologin,
		middlewares: [],
	},
	{
		path: "/articles/list",
		method: "get",
		action: articlesGetAllAction,
		middlewares: [],
	},
	{
		path: "/articles/:id",
		method: "get",
		action: articlesGetByIdAction,
		middlewares: [],
	},

	{
		path: "/user",
		method: "get",
		action: userGetAction,
		middlewares: [],
	},
	{
		path: "/admin/user/modifier/:id",
		method: "put",
		action: userPutAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/add",
		method: "post",
		action: articlesSaveAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/modifier/:id",
		method: "put",
		action: articlesPutAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/hide/:id",
		method: "put",
		action: articlesHiddenAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/list",
		method: "get",
		action: articlesGetAllAdminAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/:id",
		method: "delete",
		action: articlesDeleteArticleAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/admin/articles/:id/image",
		method: "post",
		action: articlesPostMiniatureAction,
		middlewares: [authMiddleware],
	},
	{
		path: "/articles/:id/miniature",
		method: "get",
		action: articlesGetMiniatureAction,
		middlewares: [],
	},
];
