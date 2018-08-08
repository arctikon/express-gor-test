const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const Game = require('../models/Game');

describe('Game Model', () => {
  it('should create a new game', (done) => {
    const GameMock = sinon.mock(new Game({ randomApiSignature: 'testSignature' }));
    const game = GameMock.object;

    GameMock
      .expects('save')
      .yields(null);

    game.save((err) => {
      GameMock.verify();
      GameMock.restore();
      expect(err).to.be.null;
      done();
    });
  });

  it('should return error if game is not created', (done) => {
    const GameMock = sinon.mock(new Game({ randomApiSignature: 'testSignature' }));
    const game = GameMock.object;
    const expectedError = {
      name: 'ValidationError'
    };

    GameMock
      .expects('save')
      .yields(expectedError);

    game.save((err, result) => {
      GameMock.verify();
      GameMock.restore();
      expect(err.name).to.equal('ValidationError');
      expect(result).to.be.undefined;
      done();
    });
  });

  it('should find game by signature', (done) => {
    const GameMock = sinon.mock(Game);
    const expectedGame = {
      randomApiSignature: 'testSignature'
    };

    GameMock
      .expects('findOne')
      .withArgs({ randomApiSignature: 'testSignature' })
      .yields(null, expectedGame);

    Game.findOne({ randomApiSignature: 'testSignature' }, (err, result) => {
      GameMock.verify();
      GameMock.restore();
      expect(result.randomApiSignature).to.equal('testSignature');
      done();
    });
  });


  it('should remove game by signature', (done) => {
    const GameMock = sinon.mock(Game);
    const expectedResult = {
      nRemoved: 1
    };

    GameMock
      .expects('remove')
      .withArgs({ randomApiSignature: 'testSignature' })
      .yields(null, expectedResult);

    Game.remove({ randomApiSignature: 'testSignature' }, (err, result) => {
      GameMock.verify();
      GameMock.restore();
      expect(err).to.be.null;
      expect(result.nRemoved).to.equal(1);
      done();
    });
  });
});
