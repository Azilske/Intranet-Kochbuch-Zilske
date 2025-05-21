const bcrypt = require('bcrypt');

const password = 'Sicher123!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Fehler beim Hashen:', err);
    return;
  }
  console.log('Gehashtes Passwort:', hash);
});
