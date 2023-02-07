import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
  },
  {
    timestamps: true,
  }
);

UsersSchema.pre("save", async function (next) {
  // BEFORE saving the User in DB, executes this custom function
  // Here I am not using arrow funtions because of "this" keyword
  // (it would be undefined in case of arrow functions)
  const currentUser = this;

  if (currentUser.isModified("password")) {
    // only if the user is modifying the pw (or if the user if being created) else we skip it
    const plainPW = currentUser.password;

    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }
  // When we are done with this function --> next
  next();
});

UsersSchema.methods.toJSON = function () {
  // This .toJSON method is used EVERY TIME Express does a res.send(user/s)
  // This does mean that we could override the default behaviour of this method to remove
  // the password (an other unnecessary things)

  const userDocument = this;
  const user = userDocument.toObject();

  delete user.password;
  delete user._v;

  return user;
};

UsersSchema.static("checkCredentials", async function (email, password) {
  // My own custom Method attached to the UserModel

  // Given email and plain text password, this method has to search in the db of the user exists (by email)
  // Then it should compare the given password with the hashed one coming from the db
  // Then it should return a useful response

  // 1. Find by email
  const user = await this.findOne({ email }); // this represents UserModel

  if (user) {
    // 2. If the user is found --> compare plain password with the hashed one
    const passwordMatch = await bcrypt.compare(password, user.password);
    // 3. If passwords match --> return user
    if (passwordMatch) {
      return user;
    } else {
      // 4. else --> return null
      return null;
    }
  } else {
    // 5. In case of user not found --> return null
    return null;
  }
});
// USAGE: await UserModel.checkCredentials("rambo@gmail.com", "1234")
// if (user){
// credentials are good
// } else {
// credentials are not good
// }
export default model("User", UsersSchema);
