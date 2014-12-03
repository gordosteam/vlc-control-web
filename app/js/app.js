/* app js */

/*
* only for test    *
* vlc-control-node *

var VLCServer = {

  url : "http://192.168.1.4:8124/",

  request : function( call, data ) {
    NProgress.start();

    $.ajax({
      url: this.url,
      dataType: "jsonp",
      jsonpCallback: call,
      data : data,
      cache: false,
      timeout: 5000,
      success: function(data) {
        NProgress.done();

        var r = jQuery.parseJSON( data );
        $('#log').html( r.msg );
      },
      error: function(jqXHR, textStatus, errorThrown) {
        NProgress.done();

        alert('error ' + textStatus + " " + errorThrown);
      }
    });
  }
}

var VLC = {
  backward : function() {
    VLCServer.request( 'backward' );
  },
  play : function() {
    VLCServer.request( 'play' );
  },
  stop : function() {
    VLCServer.request( 'stop' );
  },
  forward : function() {
    VLCServer.request( 'forward' );
  },
  volume : function( val ) {
    VLCServer.request( 'setVolume', 'volume=' + val );
  }
}
*/

/* vlc-control-io */
var socketIO = {

  socket : null,

  create : function() {

    this.socket = io('192.168.1.131:3500');

    this.socket.on('conectado', function(msg) {
      this.socket.emit('cfg', {
        ip : '192.168.1.131',
        port : 8080,
        user : '',
        password : 'asd123'
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
}

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
    // VLC.backward();
  });
  $('#play').click(function() {
    socketIO.command( 'play' );
    // VLC.play();
  });
  $('#stop').click(function() {
    socketIO.command( 'stop' );
    // VLC.stop();
  });
  $('#forward').click(function() {
    socketIO.command( 'next' );
    // VLC.forward();
  });
  $('#volume').click(function() {
    socketIO.command( 'play' );
    // VLC.volume( 100 );
  });

});
