const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


autoIncrement.initialize(mongoose.connection);

const gameSchema = new mongoose.Schema({
  number: Number,
  sequence: [Number],
  choosedCellNumber: Number,
  prizeValue: Number,
  randomApiResponce: mongoose.Schema.Types.Mixed,
  randomApiSignature: String,
}, { timestamps: true });

gameSchema.plugin(autoIncrement.plugin, { model: 'Game', field: 'number', startAt: 1 });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
