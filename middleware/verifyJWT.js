import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyJWT = async (req, res, next) => {

  // Better Auth cookie theke token pori.
  // Production (https)-e cookie-r naam-er age __Secure- thake.
  const token =
    req.cookies["better-auth.session_data"] ||
    req.cookies["__Secure-better-auth.session_data"];

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized!",
    });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.CLIENT_URL,

    });

    req.user = payload;

    next();
  } catch (error) {
        console.log("JWT ERROR:", error.message);

    return res.status(401).send({
      message: "Unauthorized!",
    });
  }
};

export default verifyJWT;