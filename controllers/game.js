const request = require('request');
const { validationResult } = require('express-validator/check');
const config = require('../config/config');
const Game = require('../models/Game');


/**
 * GET /api/pinterest
 * Received values from 1 to 9
 */
exports.createNewGame = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { choosedCellNumber } = req.body;
  // table for prize-cell map
  const prizeTable = {
    1: 1,
    2: 5,
    3: 10,
    4: 20,
    5: 30,
    6: 50,
    7: 100,
    8: 200,
    9: 250
  };
  // request to api.random.org, all params are stored in config
  request.post({
    url: config.randomApiUrl,
    json: true,
    body: {
      id: 28255,
      jsonrpc: '2.0',
      method: 'generateSignedIntegers',
      params: {
        apiKey: config.randomApiKey,
        n: 9,
        min: 1,
        max: 9,
        replacement: false,
        base: 10
      }
    }
  }, (err, request, body) => {
    if (err) {
      res.status(500).json([{
        status: 500,
        error: {
          message: 'Непредвиденная ошибка на сервере! Попробуйте позже.'
        }
      }]);
    }
    const sequence = body.result.random.data;
    // decrease choosed cell number because of array starts from 0
    const choosedRandomValue = sequence[choosedCellNumber - 1];
    // choose prize value from prize-cell map
    const prizeValue = prizeTable[choosedRandomValue];

    const game = new Game({
      sequence,
      choosedCellNumber,
      prizeValue,
      randomApiResponce: JSON.stringify(body),
      randomApiSignature: body.result.signature
    });
    // Creation of game object
    game.save((err) => {
      if (err) {
        res.status(500).json([{
          status: 500,
          error: {
            message: 'Непредвиденная ошибка на сервере! Попробуйте позже.'
          }
        }]);
      }
      const sendedData = {};
      sequence.forEach((element, index) => {
        const correctIndex = index + 1;
        sendedData[`cell${correctIndex}`] = prizeTable[element];
      });
      res.status(200).json([{
        status: 200,
        data: sendedData
      }]);
    });
  });
};
