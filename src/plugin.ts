import express = require("express");
import expressOAuth2JWTBearer = require("express-oauth2-jwt-bearer");

require("./metadata");

const SKIP_AUTH = Boolean(process.env["SKIP_AUTH"]);
const AUTH0_ISSUER_BASE_URL = process.env["AUTH0_ISSUER_BASE_URL"] as string;
const AUTH0_AUDIENCE = process.env["AUTH0_AUDIENCE"] as string;

const { auth } = expressOAuth2JWTBearer;

const authOptions = {
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_ISSUER_BASE_URL,
} as expressOAuth2JWTBearer.AuthOptions;

const getProtector = () => {
  if (SKIP_AUTH) {
    const nullHandler: express.Handler = (_req, _res, next) => {
      next();
    };
    return nullHandler;
  }
  return auth(authOptions);
};

export = {
  getProtector,
};
