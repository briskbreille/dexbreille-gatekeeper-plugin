require("./metadata");
import express = require("express");
import jose = require("jose");

const SKIP_AUTH = Boolean(process.env["SKIP_AUTH"]);
const AUTH_SERVER_BASE_URL = process.env["AUTH_SERVER_BASE_URL"] as string;
const AUTH_REALM_NAME = process.env["AUTH_REALM_NAME"] as string;

const jwks = jose.createRemoteJWKSet(
  new URL(
    `${AUTH_SERVER_BASE_URL}/realms/${AUTH_REALM_NAME}/protocol/openid-connect/certs`
  )
);

const createGatekeeper = () => {
  if (SKIP_AUTH) return null;

  const extractJWTFromRequest = (req: express.Request) => {
    const authorizationHeaderWords = (req.headers.authorization ?? "").split(
      " "
    );
    if (authorizationHeaderWords.length !== 2) return null;
    const [type, token] = authorizationHeaderWords as [string, string];
    if (type !== "Bearer") return null;
    return token;
  };

  const gatekeeper: express.Handler = async (req, res, next) => {
    const token = extractJWTFromRequest(req);
    if (token === null) return res.status(401);
    const { payload } = await jose.jwtVerify(token, jwks);
    req.payload = payload;
    next();
  };

  return gatekeeper;
};

export = {
  createGatekeeper,
};
