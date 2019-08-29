//jshint esversion:6

const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const {name, email, password } = req.body;
  if(!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  //Synchronous declaration for bcrypt
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction(trx => {
    trx.insert({
      Hash: hash,
      Email: email
    })
    .into('login')
    .returning('Email')
    .then(loginEmail => {
      return  trx('users')
          .returning('*')
          .insert({
            Name: name,
            Email: loginEmail[0],
            Joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
    .catch(err => res.status(400).json('Unable to register'));

};

module.exports = {
  handleRegister
};
