import express from "express";
import createHttpError from "http-errors";
import { adminOnlyMiddleware } from "../../lib/auth/adminsOnly.js";
import { basicAuthMiddleware } from "../../lib/auth/basicAuth.js";
import UsersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.firstName} ${req.body.lastName}`;

    const user = {
      ...req.body,
    };

    const newUser = new UsersModel(user); // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UsersModel.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/:userId",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findById(req.params.userId, {
        password: 0,
      });
      if (user) {
        res.send(user);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put(
  "/:userId",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId, // WHO you want to modify
        req.body, // HOW you want to modify
        { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record PRE-MODIFICATION. If you want to get back the updated object --> new:true
        // By default validation is off here --> runValidators: true
      );

      if (updatedUser) {
        res.send(updatedUser);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete(
  "/:userId",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
      if (deletedUser) {
        res.status(204).send();
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
