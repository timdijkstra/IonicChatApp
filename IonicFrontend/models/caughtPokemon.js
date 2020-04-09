const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const caughtPokemonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  nickName: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  pokeIndex: {
    type: Number,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pokeApiDetailsUrl: {
    type: String,
    required: false
  }
},
{
  timestamps: true
}  
);

module.exports = mongoose.model('CaughtPokemon', caughtPokemonSchema);