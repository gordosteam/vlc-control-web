/**
* @author emalherbi
*/

/* vlc-control-io */
var socketIO = {

  socket : null,

  create : function() {

    this.socket = io('192.168.1.4:3500');

	  var that = this.socket;
    this.socket.on('conectado', function(msg) {
      that.emit('cfg', {
        ip : '192.168.1.4',
        port : 8080,
        user : '',
        password : 'asd123',
        pathImgs: '' // 'c:\\xampp\\htdocs\\vlc-control-web\\app\\public\\imgs\\'
      });
    });

    this.socket.on('fault', function(msg) {
      alert( msg );
    });

    this.socket.on('sucess', function(msg) {
      console.log( msg );

      $('#info').text(msg);

      var obj = JSON.parse(msg);

      if ((obj) && (obj.information) && (obj.information.category) && (obj.information.category.meta) && (obj.information.category.meta.artwork_url)) {
        $('#img').attr("src", obj.information.category.meta.artwork_url);
        $('#artist').text('Artist: ' +obj.information.category.meta.artist);
        $('#music').text('Music: ' + obj.information.category.meta.filename);
      } else {
        $('#artist').text('');
        $('#music').text('');
        $('#img').attr("src", '');
      }
    });
  },
  command : function( command ) {
    this.socket.emit('command', {
      command : command
    });
  }
};

$(function() {
  console.log( "ready!" );

  $('#slider').slider({
    formatter: function(value) {
      return value;
    }
  });

  socketIO.create();
  $('#backward').click(function() {
    socketIO.command( 'previous' );
  });
  $('#play').click(function() {
    socketIO.command( 'play' );
  });
  $('#stop').click(function() {
    socketIO.command( 'stop' );
  });
  $('#forward').click(function() {
    socketIO.command( 'next' );
  });
  $('#volume').click(function() {
    socketIO.command( 'play' );
  });
});
