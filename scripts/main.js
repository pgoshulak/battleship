requirejs(['render', 'store'], function (render, store) {
  let state = store.state();
  render.renderBoards(state);
  console.log(state);

  $('#swapPlayers').click(function () {
    store.swapCurrentPlayers(state);
    render.renderBoards(state);
  });

});
