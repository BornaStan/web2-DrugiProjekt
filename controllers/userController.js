const { getSetting, createUser } = require('../db/queries');
const renderPartial = require('../utils/render');
const escapeHtml = require('../utils/escapeHtml');


exports.registerForm = async (req, res) => {
  res.render('layout', {
    title: 'Register',
    body: await renderPartial('register', {})
  });
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.send('Username and password required.');

  try {
    const protect = (await getSetting('sensitive_protection')) === 'true';
    await createUser(username, password, protect);
    res.render('layout', {
      title: 'Registered',
      body: `<h3>Registered</h3><p>User ${escapeHtml(username)} created.</p>`
    });
  } catch (e) {
    console.error(e);
    res.render('layout', {
      title: 'Error',
      body: '<h3>Error</h3><p>User already exists or DB error.</p>'
    });
  }
};
