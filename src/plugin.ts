import "./metadata.js";
import * as express from "express";
import * as jose from "jose";
import z from "zod";

declare global {
  export namespace Express {
    interface Request {
      jwtPayload?: jose.JWTPayload;
    }
  }
}

const envSchema = z.object({
  SKIP_AUTH: z.stringbool().nullish(),
  AUTH_SERVER_BASE_URL: z.string(),
  AUTH_REALM_NAME: z.string(),
});

const { SKIP_AUTH, AUTH_SERVER_BASE_URL, AUTH_REALM_NAME } = envSchema.parse(
  process.env
);

const jwks = jose.createRemoteJWKSet(
  new URL(
    `${AUTH_SERVER_BASE_URL}/realms/${AUTH_REALM_NAME}/protocol/openid-connect/certs`
  )
);

export const createGatekeeper = () => {
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
    if (token === null) {
      throw new Error("Unauthorized.");
    }
    const { payload } = await jose.jwtVerify(token, jwks);
    req.jwtPayload = payload;
    next();
  };

  return gatekeeper;
};
