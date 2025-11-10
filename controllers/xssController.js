const { getSetting, createMessage, getMessages, logXss, deleteMessage } = require('../db/queries');
const renderPartial = require('../utils/render');


exports.showMessages = async (req, res) => {
  const storedXss = (await getSetting('stored_xss')) === 'true';
  const messages = await getMessages();
  res.render('layout', {
    title: 'Messages',
    body: await renderPartial('messages', { messages, storedXss })
  });
};

exports.newMessageForm = async (req, res) => {
  res.render('layout', {
    title: 'New Message',
    body: await renderPartial('new_message', {})
  });
};

exports.saveMessage = async (req, res) => {
  const { title, body } = req.body;
  await createMessage(title, body);
  res.redirect('/messages');
};

exports.deleteMessage = async (req, res) => {
  const id = req.body.id;
  if (id) await deleteMessage(id);
  res.redirect('/messages');
};


exports.logData = async (req, res) => {
  const note = req.query.note || '';
  if (note) await logXss(note);
  res.type('text/plain').send('OK');
};
