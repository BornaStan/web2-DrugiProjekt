const { getSetting, createUser } = require('../db/queries');
const renderPartial = require('../utils/render');
const escapeHtml = require('../utils/escapeHtml');


exports.registerForm = async (req, res) => {
  res.render('layout', {
    title: 'Registracija',
    body: await renderPartial('register', {})
  });
};

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.send('Potrebni su username ili lozinka.');

  try {
    const protect = (await getSetting('sensitive_protection')) === 'true';
    await createUser(username, password, protect);
    res.render('layout', {
      title: 'Registracija uspješna!',
      body: `<h3>Registrirani </h3><p>Korisnik ${escapeHtml(username)} created.</p>`
    });
  } catch (e) {
    console.error(e);
    res.render('layout', {
      title: 'Error',
      body: '<h3>Error</h3><p>Korisnik već postoji ili DB error.</p>'
    });
  }
};
