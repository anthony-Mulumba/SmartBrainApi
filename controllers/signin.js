//jshint esversion:6

const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('Email', 'Hash').from('login')
    .where('Email', '=', email)
    .then(data => {
       const isValid = bcrypt.compareSync(password, data[0].Hash);
       if(isValid) {
         return db.select('*').from('users')
          .where('Email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('error loging in'));
        } else {
            res.status(400).json('wrong password');
        }

    })
    .catch(err => res.status(400).json('wrong entries'));

};

module.exports = {
  handleSignIn
};
