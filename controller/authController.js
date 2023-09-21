const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../schema/user');
const Admin = require('../schema/admin');

exports.registerUser = async (req, res) => {
  console.log('reg');
  console.log(req.body);
  const {
    password,
    firstName,
    lastName,
    gender,
    matricNo,
    phone,
    faculty,
    department,
    level,
    email
  } = req.body;
  try {
    await User.create({
      passwordHash: CryptoJS.AES.encrypt(
        password,
        // process.env.PASSWORD_SECRET
        'whatever'
      ).toString(),
      firstName,
      lastName,
      gender,
      matricNo,
      phone,
      faculty,
      department,
      level,
      email
    });
    // console.log(register);
    // const { passwordHash, ...rest } = register;
    return res.status(201).json({
      message: `${firstName} registered successfully`
    });
  } catch (error) {
    console.log(error);
    if (error?.keyValue?.email) {
      return res
        .status(401)
        .json({ message: 'This email address is already taken' });
    } else if (error?.keyValue?.matricNo) {
      return res
        .status(401)
        .json({ message: 'This matric number is not available' });
    } else if (error?.keyValue?.phone) {
      return res
        .status(401)
        .json({ message: 'This phone number is already taken' });
    } else {
      console.log(error);
      return res.status(500).json({ error });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (password == 'WeaUp') {
    try {
      const user = await Admin.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid Admin Email',
          statusCode: 401
        });
      } else {
        const accessToken = jwt.sign(
          { matricNo: 'Admin' },
          'process.env.JWT_SECRET',
          { expiresIn: '1d' }
        );
        return res
          .cookie('access_token', accessToken, {
            httpOnly: false,
            // origin: "http://localhost:4000",
            sameSite: 'none',
            // origin: "https://kesa-bank-sigma.vercel.app",
            secure: true
            // secure: process.env.NODE_ENV === "production",
          })
          .status(201)
          .json({
            admin: true,
            Message: 'logged in successfully',
            jwt: accessToken
          });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
  try {
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(401).json({
        message: 'Email address is not registered',
        statusCode: 401
      });
    } else {
      const { passwordHash, ...rest } = user._doc;
      const unhashedPassword = CryptoJS.AES.decrypt(
        passwordHash,
        'whatever'
      ).toString(CryptoJS.enc.Utf8);
      if (password !== unhashedPassword) {
        return res.status(401).json({
          message: 'Incorrect password. Try again',
          statusCode: 401
        });
      } else {
        const accessToken = jwt.sign(
          { matricNo: user.matricNo },
          'process.env.JWT_SECRET',
          { expiresIn: '30d' }
        );
        res
          .cookie('access_token', accessToken, {
            httpOnly: false,
            // origin: "http://localhost:4000",
            sameSite: 'none',
            // origin: "https://kesa-bank-sigma.vercel.app",
            secure: true
            // secure: process.env.NODE_ENV === "production",
          })
          .status(201)
          .json({
            ...rest,
            Message: 'logged in successfully',
            jwt: accessToken
          });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.me = async (req, res) => {
  const token = req?.headers?.cookie?.split('=')[1];
  // const token = req.headers?.authorisation.split(" ")[1];
  console.log(token);
  if (token) {
    const decodedToken = jwt.verify(token, 'process.env.JWT_SECRET');
    const { matricNo } = decodedToken;
    if (!matricNo) {
      return res.status(401).json({ success: false, message: 'invalid token' });
    } else if (matricNo === 'Admin') {
      const accessToken = jwt.sign(
        { matricNo: 'Admin' },
        'process.env.JWT_SECRET',
        { expiresIn: '1d' }
      );
      return res
        .cookie('access_token', accessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production'
        })
        .status(201)
        .json({ admin: true, Message: 'logged in successfully' });
    } else {
      try {
        // account_no = +account_no - 1002784563
        const user = await User.findOne({ matricNo });
        if (!user) {
          return res.status(401).json('Invalid token');
        }
        const { passwordHash, ...rest } = user._doc;
        const accessToken = jwt.sign(
          {
            matricNo: user._doc.matricNo
          },
          'process.env.JWT_SECRET',
          { expiresIn: '30d' }
        );
        return res
          .cookie('access_token', accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production'
          })
          .status(201)
          .json({ ...rest, Message: 'logged in successfully' });
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Error! Token was not provided' });
  }
};

exports.logout = async (_req, res) => {
  console.log('logout');
  return (
    res
      // .clearCookie("access_token")
      .cookie('access_token', 'accessToken', {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
        // secure: process.env.NODE_ENV === "production",
        maxAge: 1
      })
      .status(200)
      .json({ message: 'You have successfully logged out' })
  );
};
