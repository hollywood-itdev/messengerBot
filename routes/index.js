import express from 'express';
import messengerCtrl from '../controllers/messenger.controller.js';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Messenger' });
});

router.post('/webhook', messengerCtrl.process);

router.get('/messages/:id', messengerCtrl.getMessageById);
router.get('/messages', messengerCtrl.getAllMessagesFromUsers);

router.delete('/messages/:id', messengerCtrl.deleteMessageById);
module.exports = router;
