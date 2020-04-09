const CaughtPokemon = require('../models/caughtPokemon');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

exports.updateCaughtPokemon = (req, res, next) => {
    
    const pokemonId = req.params.pokemonId;
    const name = req.body.name;
    const nickName = req.body.nickName;
    const imageUrl = req.body.imageUrl;
    const image = req.body.imageUrl;

    CaughtPokemon.findById(pokemonId)
    .then(pokemon => {
        if(!pokemon) {
            const error = new Error('Could not find caught pokemon Id o.O');
            error.statusCode = 404;
            throw error;
        }
        // if(pokemon.userId.toString !== req.user) {
        //     const error = new Error('Not the owner of this caught pokemon, not authorized.');
        //     error.statusCode = 403;
        //     throw error;
        // }

        pokemon.name = name;
        pokemon.nickName = nickName;
        pokemon.imageUrl = imageUrl;
        //pokemon.image = image;
        return pokemon.save();
    }).then(result => {
        res.status(201).json({
            message: 'Pokemon updated!',
            pokemon: result
        });
    })
      .catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
      });
};

exports.getCaughtPokemons = (req, res, next) => {
    CaughtPokemon.find()
      .then(pokemons => {
        res.status(200).json({
            message: 'Fetched caught pokemons successfully! Pogchamp',
            pageTitle: 'Caught Pokemons in pc',
            caughtPokemons: pokemons,
          });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
};
  
exports.getCaughtPokemonDetail = (req, res, next) => {
    const caughtPokemonId = req.params.pokemonId;
    CaughtPokemon.findById(caughtPokemonId)
    .then(pokemon => {
        if(!pokemon) {
            const error = new Error('Could not find caught pokemon Id o.O');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ 
            message: 'Pokemondetail succesfully fetched :)',
            pokemon: pokemon
        })
    }).catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
    });
};

//attention
exports.addCaughtPokemonToParty = (req, res, next) => {
    const pokemonId = req.body.pokemonId;
    let targetedPokemon;
    CaughtPokemon.findById(pokemonId)
    .then(pokemon => {
        if(!pokemon) {
            const error = new Error('Could not find pokemonId to add to party o.O');
            error.statusCode = 404;
            throw error;
        }
        return pokemon;
    })
    .then(target => {
        targetedPokemon = target;
        return User.findById(req.userId);
    })
    .then(user => {
        user.party.push(targetedPokemon);
        return user.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'Pokemon added to the party!',
            pokemon: result
        });
    })
      .catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
      });
};

exports.catchPokemon = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        //in build method of express
        const error = new Error('Where the nickname at?? 1 letter is not good enough dab dab');
        error.statusCode = 422;
        //validation failed statuscode: 422
        throw error;
    }

    const name = req.body.name;
    const nickName = req.body.nickName;
    const imageUrl = req.body.imageUrl;
    
    const pokeIndex = req.body.pokeIndex;
    const pokeApiDetailsUrl = req.body.details;
    const pokemon = new CaughtPokemon({
      name: name,
      nickName: nickName,
      imageUrl: imageUrl,
      userId: req.user._id,
      pokeIndex: pokeIndex,
      pokeApiDetailsUrl: pokeApiDetailsUrl
    });
    pokemon.save()
      .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Pokemon caught (created)',
            pokemon: result
        });
      })
      .catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
      });
};

exports.deleteCaughtPokemon = (req, res, next) => {
    const pokemonId = req.params.pokemonId;
    CaughtPokemon.findById(pokemonId)
    .then(pokemon => {
        if(!pokemon){
            const error = new Error('Could not find pokemon to delete');
            error.statusCode = 404;
            throw error;
        }
        // if(pokemon.userId.toString !== req.user) {
        //     const error = new Error('Not the owner of this caught pokemon, not authorized.');
        //     error.statusCode = 403;
        //     throw error;
        // }
        return CaughtPokemon.findByIdAndRemove(pokemonId);
        //check userid
        //clearImage(post.imageUrl);
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: "Pokemon is deleted"})
    })
    .catch(err => {
        if(!err.statusCode) {

        }
    })
};

exports.getTrainerProfile = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
    .then(user => {
        if(!user) {
            const error = new Error('Could not find user Id o.O');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ 
            message: 'User succesfully fetched :)',
            user: user
        })
    }).catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
    });
};

//attention
exports.updateTrainerProfile = (req, res, next) => {
    const name = req.body.name;
    User.findById(req.userId)
    .then(user => {
        if(!user) {
            const error = new Error('Could not find user Id o.O');
            error.statusCode = 404;
            throw error;
        }
        user.name = name;
        return user.save();
    })
    .then(user => {
        res.status(200).json({ 
            message: 'User succesfully updated :)',
            user: user
        })
    })
    .catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
    });
};
