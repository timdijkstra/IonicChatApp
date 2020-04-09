const path = require('path');

const express = require('express');
const { body } = require('express-validator');
const trainerController = require('../controllers/trainer');
const isAuth = require('../middleware/authentication');
const router = express.Router();


//a post with validation
//router.post('/catch-pokemon', [body('name').trim().isLength({max: 1})], trainerController.catchPokemon);
router.post('/pokemon', 
//isAuth, 
trainerController.catchPokemon);

router.get('/pokemons', 
isAuth, 
trainerController.getCaughtPokemons);

router.get('/pokemon/:pokemonId', 
//isAuth, 
trainerController.getCaughtPokemonDetail);

router.put('/pokemon/:pokemonId', 
//isAuth, 
trainerController.updateCaughtPokemon);

router.delete('/pokemon/:pokemonId', 
//isAuth, 
trainerController.deleteCaughtPokemon);

router.get('/:userId', 
//isAuth, 
trainerController.getTrainerProfile);
//https://pokedab.herokuapp.com/trainer/5e887a102242d751d0dfbd78

router.put('/party/:pokemonId', trainerController.addCaughtPokemonToParty);

module.exports = router;