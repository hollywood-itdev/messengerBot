let users = 0; // counter online users.
let births = []; // register user's birthday.
let userMessages = [], messageLen = 0;

const steps = { // steps for Messenger Bot
  INIT_CHAT: 0,
  ANSWER_NAME: 1,
  ANSWER_BIRTH: 2,
  CALCULATE_NEXT_BIRTH: 3,
  OTHER: 4,
};

const answers = { // define type of users' answer. 
  YES: 0,
  NO: 1,
  MISUNDERSTANDABLE: 2
}

const messages = [ // define bot's messages. 
  'Hi, what is your name?',
  'What is your birthday?',
  'Do you want to know how many days till your next birthday?',
  'There are N days left until your next birthday.'
]

const yes = ['yes', 'yeah', 'yup', 'YES']; // available answers users can use.
const no = ['no', 'nah', 'nope', 'NO'];

function isValidDateFormat(date) {
  const dateFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
  return dateFormat.test(date);
}

function calculateDaysLeft(userId) {
  const now = new Date();
  const birth = new Date(births[userId]);

  const thisYear = now.getFullYear();
  const birthDate = birth.getDate();
  const birthMonth = birth.getMonth();
  const currentDate = now.getDate();
  const currentMonth = birth.getMonth();

  const thisYearBirth = new Date(thisYear, birthMonth, birthDate);
  const nextYearBirth = new Date(thisYear + 1, birthMonth, birthDate);

  let differenceInTime = thisYearBirth.getTime() - now.getTime();

  if (differenceInTime < 0 || (currentMonth == birthMonth && currentDate == birthDate)) { // for cases that today is birthday or already the next birthday will be in next year.
    differenceInTime = nextYearBirth.getTime() - now.getTime();
  }

  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
}

function analyseAnswer(answer) { // match user's answer to the registered answers.
  let result = yes.find(element => element === answer);
  if (result) return answers.YES;

  result = no.find(element => element === answer);
  if (result) return answers.NO;

  return answers.MISUNDERSTANDABLE
}

function process(req, res, next) {
  try {
    if (req.body.step > steps.ANSWER_BIRTH && req.body.id == undefined) {
      res.status(400).end();
      return;
    }

    switch (req.body.step) {
      case steps.INIT_CHAT: // send Hi and user id created by app for later actions.
        res.status(200).send({
          id: ++users,
          step: steps.ANSWER_NAME,
          message: messages[steps.INIT_CHAT]
        });
        break;
      case steps.ANSWER_NAME: // after getting user's name, ask the user's birthday.
        res.status(200).send({
          id: req.body.id,
          step: steps.ANSWER_BIRTH,
          message: messages[steps.ANSWER_NAME]
        });
        break;
      case steps.ANSWER_BIRTH: // after getting user's birthday, ask the user's birthday.
        if (isValidDateFormat(req.body.message)) {
          births[req.body.id] = req.body.message;
          res.status(200).send({
            id: req.body.id,
            step: steps.CALCULATE_NEXT_BIRTH,
            message: messages[steps.ANSWER_BIRTH]
          })
        } else {
          res.status(200).send({
            id: req.body.id,
            step: steps.ANSWER_BIRTH,
            message: 'wrong date format. please use YYYY-MM-DD format.'
          });
        }
        break;
      case steps.CALCULATE_NEXT_BIRTH:
        const answer = analyseAnswer(req.body.message);

        if (answer == answers.YES) {
          const days = calculateDaysLeft(req.body.id);
          let message = 'There is a day left until your next birthday';

          if (days > 1) message = `There are ${days} days left until your next birthday.`;

          res.status(200).send({
            id: req.body.id,
            step: steps.OTHER,
            message
          })
        } else if (answer == answers.NO) {
          res.status(200).send({
            id: req.body.id,
            step: steps.OTHER,
            message: 'Goodbye 👋'
          });
        } else {
          res.status(200).send({
            id: req.body.id,
            step: steps.CALCULATE_NEXT_BIRTH,
            message: messages[steps.ANSWER_BIRTH]
          });
        }
        break;
      case steps.OTHER:
        res.status(200).send({});
        break;
    }

    if (req.body.step != steps.INIT_CHAT) {
      userMessages.push({
        id: messageLen++,
        message: req.body.message
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

function getAllMessagesFromUsers(req, res) {

  res.status(200).json({
    messages: userMessages
  })
    .end();
}

function getMessageById(req, res) {
  const result = userMessages.find(item => item.id == req.params.id);
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(404).send({
      error: `Not found the message`
    })
  }
}

function deleteMessageById(req, res) {
  const result = userMessages.findIndex(item => item.id == req.params.id);

  if (result < 0) {
    res.status(404).send({
      error: `Not found the message`
    })
  } else {
    userMessages.splice(result, 1);
    res.status(200).send({
      id: req.params.id,
      message: `successfully deleted the message`
    })
  }
}

module.exports = {
  process,
  getAllMessagesFromUsers,
  getMessageById,
  deleteMessageById
};
