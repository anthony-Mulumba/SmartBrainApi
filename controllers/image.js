//jshint esversion:6
const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: "4a4a7cdaa1d844b09780b0323a64c24d"
});

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
        res.json(data);
      })
      .catch(err => res.status(400).json('unable to work with data'));
};


const handleImage = (req, res, db) => {
  const { id } = req.body;

  db('users').where('Id', '=', id)
  .increment('Entries' ,1)
  .returning('Entries')
  .then(Entries => {
    res.json(Entries[0]);// array as result
  })
  .catch(err => res.status(400).json('unable to get entries'));

};

module.exports = {
  handleImage,
  handleApiCall
};
