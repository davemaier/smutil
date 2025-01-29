import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.HANKO_API_URL}/.well-known/jwks.json`),
);

export const validateJWT = async (cookie?: string) => {
  let token = "";
  if (cookie) {
    token = cookie;
  }
  if (token === null || token.length === 0) {
    console.log("no token");
    return false;
  }
  let authError = false;
  await jwtVerify(token, JWKS).catch((err) => {
    console.log("jwt verify error");
    authError = true;
    console.log(err);
  });
  if (authError) {
    console.log("auth error");
    return false;
  }
  console.log("token valid");
  return true;
};
