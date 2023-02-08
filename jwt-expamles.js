import jwt from "jsonwebtoken";

const payload = {
  _id: "1234123412434",
  role: "User", // never store sensitive data inside the payload of the token
};

const secret = "mysupersecret";

const options = { expiresIn: "7d" };

// ******************SYNC*******************

// const token = jwt.sign(payload, secret, options);

// console.log("TOKEN: ", token);

// const originalPayload = jwt.verify(token, secret);

// console.log("PAYLOAD: ", originalPayload);

// *****************ASYNC********************

jwt.sign(payload, secret, options, (err, token) => {
  if (err) console.log(err);
  else console.log(token);
});

// ***************HOW TO CREATE A COLLBACK BASED FUNCTION INTO A PROMISE BADES FUNCTION***********

const createAccessToken = (payload) =>
  new Promise((resolve, reject) => {
    if (err) reject(err);
    else resolve(token);
  });

const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(payload, secret, options, (err, token) => {
      if (err) reject(err);
      else resolve(originalPayload);
    })
  );

try {
  const token = await createAccessToken({});
  console.log("🚀 ~ file: jwt-expamles.js:38 ~ token", token);
} catch (error) {
  console.log(error);
}
