import type JWTPayload = require("jose");

declare global {
  declare namespace Express {
    export interface Request {
      payload?: JWTPayload;
    }
  }
}

export {};
