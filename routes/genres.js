const express = require('express');
const Joi = require('joi');
const route = express.Router();

const genres = [
    {id: 1, name: "Action"},
    {id: 2, name: "Thriller"},
    {id:3, name: "Drama"}
];


// Get All Genres
route.get('/', (req, res) =>{
    res.send(genres);
});

//Put a new Genre
route.post('/', (req, res) =>{
    const {error} = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

//Update a Genre based on id
route.put('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if (!genre) return res.status(404).send('the genre with the given id was not found');

    const {error} = validateGenre(req.body);
    if (error) return res.send(error.details[0].message);
    genre.name = req.body.name;
    res.send(genre);
});


// Delete a Genre Based on Id
route.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if (!genre) return res.status(404).send('The Genre with given id was not found.');

    const index = genres.indexOf(genre);
    genres.splice(index,1);

    res.send(genre);
});

//Get Genre based on id
route.get('/:id',(req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with given id was not found.')

    res.send(genre);
})

//Genre Validation
function validateGenre(genre) {
    const schema = {

        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);

}

module.exports = route;