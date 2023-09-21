const jwt = require('jsonwebtoken');
const User = require('../schema/user');
const { Question } = require('../schema/question');

const deleteAll = async () => {
  //   const user = await User.deleteMany();
  //   console.log(user);
  const question = await Question.deleteMany();
  console.log(question);
};

const qs = async (req, res) => {
  const token = req?.headers?.cookie?.split('=')[1];
  if (token) {
    const decodedToken = jwt.verify(token, 'process.env.JWT_SECRET');
    const { matricNo } = decodedToken;
    if (!matricNo) {
      return res.status(401).json({ success: false, message: 'invalid token' });
    } else {
      try {
        const user = await User.findOne({ matricNo });
        if (!user) {
          return res.status(401).json('Invalid token');
        }
        const { faculty, department, level } = user._doc;
        const questions = await Question.where('faculty')
          .equals(faculty)
          .where('department')
          .equals(department)
          .where('level')
          .equals(level);
        questions.map((a) => a.q.map((b) => (b.answer = '')));
        console.log(questions);
        res.status(201).json({ questions });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Error! Token was not provided' });
  }
};

const quiz = async (req, res) => {
  const token = req?.headers?.cookie?.split('=')[1];
  const cou = req.params.course;
  console.log(1);
  console.log(cou);
  console.log(2);

  if (token) {
    const decodedToken = jwt.verify(token, 'process.env.JWT_SECRET');
    const { matricNo } = decodedToken;
    if (!matricNo) {
      return res.status(401).json({ success: false, message: 'invalid token' });
    } else {
      try {
        const user = await User.findOne({ matricNo });
        if (!user) {
          return res.status(401).json('Invalid token');
        }
        const { faculty, department, level } = user._doc;
        const questions = await Question.where('faculty')
          .equals(faculty)
          .where('department')
          .equals(department)
          .where('level')
          .equals(level)
          .where('course')
          .equals(cou);
        console.log(questions);
        questions.map((a) => a.q.map((b) => (b.answer = '')));
        res.status(201).json({ questions });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Error! Token was not provided' });
  }
};

const answers = async (req, res) => {
  const token = req?.headers?.cookie?.split('=')[1];
  console.log(req.body);
  console.log({ answer: token });
  if (token) {
    const decodedToken = jwt.verify(token, 'process.env.JWT_SECRET');
    const { matricNo } = decodedToken;
    if (!matricNo) {
      return res.status(401).json({ success: false, message: 'invalid token' });
    } else {
      try {
        const qs = await Question.where('course').equals(req.body.course);
        const { q } = qs[0];
        const score = q.filter(
          (a, i) => a.answer == req.body.q[i].answer
        ).length;
        console.log(score);
        const len = q.length;
        // await User.findOne({ matricNo }).updateOne({ course, score });
        // if (!user) {
        //   return res.status(401).json('Invalid token');
        // }
        res.status(201).json({ score, len });
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Error! Token was not provided' });
  }
};

module.exports = { qs, quiz, answers, deleteAll };
