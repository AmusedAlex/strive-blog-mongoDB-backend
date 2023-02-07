import createHttpError from "http-errors";
import atob from "atob";
import UsersModel from "../../api/users/model.js";

export const basicAuthMiddleware = async (req, res, next) => {
  // This will be police officer middleware. Responsible for checking "documents" of users
  // If documents are ok, user can have the access to the endpoint
  // if they are not, user is going to be rejected with an error (401 - unauthorized)
  // Here we are expecting to receive a Authorization header like "Basic 213klj123wefljkhafkjfadjh"
  // "213klj123wefljkhafkjfadjh" is basically just email:password encoded in Base64

  // 1. Check if Authorization header is provided, else -> trigger error (401)
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide credentials in Authorizations header!"
      )
    );
  } else {
    // 2. If we have the Authorization header, we should extract the credentials out of it
    const encodedCredentials = req.headers.authorization.split(" ")[1];
    // 3. Decorde credentials
    const credentials = atob(encodedCredentials); // atob converts "adfksafakhjdfgadf" into rambo@gmail.com

    const [email, password] = credentials.split(":");

    // 4. Once we have the credentials, let's check if the user is in DB and i the provided pw is ok
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      // 5a. If credentials are ok --> you can go
      req.user = user; // adding the current user to the request object is going to unlock a number of possiblities
      //   like using some subsequent middlewares to check the role of that user for instance(authorization)

      next();
    } else {
      // 5b. else --> 401
      next(createHttpError(401, "Credentials are not OK!"));
    }
  }
};
