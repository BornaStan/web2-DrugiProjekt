const { getSetting, setSetting, getUsers, deleteUser, getXssLogs, deleteXssLog } = require('../db/queries');
const renderPartial = require('../utils/render');


exports.adminPage = async (req, res) => {
  const sensitiveProtection = (await getSetting('sensitive_protection')) === 'true';
  const storedXss = (await getSetting('stored_xss')) === 'true';
  const users = await getUsers();
  const logs = await getXssLogs();

  res.render('layout', {
    title: 'Admin',
    body: await renderPartial('admin', { sensitiveProtection, storedXss, users, logs })
  });
};

exports.toggleSettings = async (req, res) => {
  const secure = !!req.body.sensitiveProtection;
  const xss = !!req.body.storedXss;
  await setSetting('sensitive_protection', secure ? 'true' : 'false');
  await setSetting('stored_xss', xss ? 'true' : 'false');
  res.redirect('/admin');
};

exports.deleteUser = async (req, res) => {
  if (req.body.id) await deleteUser(req.body.id);
  res.redirect('/admin');
};

exports.deleteXssLog = async (req, res) => {
  const id = req.body.id;
  if (id) await deleteXssLog(id);
  res.redirect('/admin');
};

