const express = require('express');
const Joi = require('joi');
const mongoose = require('mongoose');
const router = express.Router();


//Create Genre Model With Schema
const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
        }
    })
);


// Get All Genres
router.get('/', async (req, res) =>{
    const genres = await Genre.find()
        .sort('name');
    res.send(genres);
});

//Put a new Genre
router.post('/', async (req, res) =>{
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();
    res.send(genre);
});

//Update a Genre based on id
router.put('/:id', async (req, res) => {

    //validation
    const {error} = validateGenre(req.body);
    if (error) return res.send(error.details[0].message);

    //update the genre
    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id, {
            $set : {
                name: req.body.name
            }
        }, {new: true});

        if (!genre) return res.status(404).send('the genre with the given id was not found');
        res.send(genre);
    } catch (ex){
            res.send(ex.message);
    }



});


// Delete a Genre Based on Id
router.delete('/:id', async (req, res) => {

    try {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre) return res.status(404).send('The Genre with given id was not found.');

        res.send(genre);
    } catch (ex) {

       console.log('error',ex);
      res.send(ex.message);
    }

});

//Get Genre based on id
router.get('/:id', async (req, res) => {

    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send('The genre with given id was not found.')

        res.send(genre);
    } catch(error) {
        res.send(error.message);
    }

})

//Genre Validation
function validateGenre(genre) {
    const schema = {

        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);

}

module.exports = router;