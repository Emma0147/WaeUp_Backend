const { Question } = require('../schema/question');
const Admin = require('../schema/admin');

const createQuestion = async (req, res) => {
  console.log('quest');
  console.log(req.body);
  try {
    const question = await Question.create(req.body);
    console.log(question);
    res.status(201).json({
      message: `Created successfully`
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({ error });
  }
};

const registerAdmin = async (req, res) => {
  const { password, email } = req.body;
  if (password !== 'WeaUp') {
    return res.status(401).json({ message: 'Wrong admin password' });
  }
  try {
    const register = await Admin.create({ email });
    res.status(201).json({
      message: `Admin registered successfully`
    });
  } catch (error) {
    console.log(error);
    if (error?.keyValue?.email) {
      return res
        .status(401)
        .json({ message: 'This email address is already taken' });
    } else {
      console.log(error);
      res.status(500).json({ error });
    }
  }
};

module.exports = { createQuestion, registerAdmin };
