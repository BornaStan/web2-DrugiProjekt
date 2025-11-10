require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const initDb = require('./db/init');
const { getSetting } = require('./db/queries');
const renderPartial = require('./utils/render');


const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const xssRoutes = require('./routes/xssRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const s = await getSetting('sensitive_protection');
  const x = await getSetting('stored_xss');
  const body = await renderPartial('index', {
    sensitiveProtection: s === 'true',
    storedXss: x === 'true'
  });
  res.render('layout', { title: 'Home', body });
});


app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', xssRoutes);


(async () => {
  await initDb();
  app.listen(PORT, () =>
    console.log(`✅ Server running on http://localhost:${PORT}`)
  );
})();
