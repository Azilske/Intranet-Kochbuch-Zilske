const bcrypt = require('bcrypt');

const plainPassword = 'j0hnny22';

bcrypt.hash(plainPassword, 10).then((hash) => {
  console.log('🔐 Hash für j0hnny22:');
  console.log(hash);
});
