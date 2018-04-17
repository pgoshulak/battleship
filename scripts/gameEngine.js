define((require, exports, module) => {
  module.exports = {
    game: function(state) {
      return {
        logState () {
          console.log(state.currentPlayer);
        }
      };
    }
  };
});