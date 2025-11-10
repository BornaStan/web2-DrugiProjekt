const ejs = require('ejs');
const path = require('path');

async function renderPartial(viewName, data = {}) {
  const file = path.join(__dirname, '../views', `${viewName}.ejs`);
  return await ejs.renderFile(file, data, { async: true });
}

module.exports = renderPartial;
