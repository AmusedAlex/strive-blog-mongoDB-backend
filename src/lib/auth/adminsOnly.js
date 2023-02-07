import createHttpError from "http-errors";

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    next(createHttpError(401, "Credentials are not OK!"));
  }
};
