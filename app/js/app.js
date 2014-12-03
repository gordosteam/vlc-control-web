/* app js */
var VLCServer = {

  url : "http://192.168.1.4:8124/",

  request : function( call, data ) {
    //var jsonpCallback = call;
    //if ( typeof params != 'undefined' ) {
    //  jsonpCallback += params;
    //}

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

$(function() {
  console.log( "ready!" );

  $('#slider').slider({
    formatter: function(value) {
      return value;
    }
  });

  $('#backward').click(function() {
    VLC.backward();
  });
  $('#play').click(function() {
    VLC.play();
  });
  $('#stop').click(function() {
    VLC.stop();
  });
  $('#forward').click(function() {
    VLC.forward();
  });
  $('#volume').click(function() {
    VLC.volume( 100 );
  });

});
