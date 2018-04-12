requirejs(['render', 'store'], function (render, store) {
  let state = store.state();
  render.renderBoards(state);
  console.log(state);

  $(document).ready(() => {
    $('#swapPlayers').click(function () {
      store.swapCurrentPlayers(state);
      render.renderBoards(state);
    });
    
    $('.board-square').click(function () {
      console.log('Board square R#C# clicked!');
    });
  });
});
