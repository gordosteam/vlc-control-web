/* vlc-control-io */
var socketIO = {

  socket : null,

  create : function() {

    this.socket = io('10.0.0.100:3500');

	  var that = this.socket;
    this.socket.on('conectado', function(msg) {
      that.emit('cfg', {
        ip : 'localhost',
        port : 8000,
        user : '',
        password : 'asd123',
        pathImgs: 'vlc-control-web/app/public/imgs/' // 'c:\\xampp\\htdocs\\vlc-control-web\\app\\public\\imgs\\'
      });
    });

    this.socket.on('fault', function(msg) {
      alert( msg );
    });

    this.socket.on('sucess', function(msg) {
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
  command : function( command, params ) {
    this.socket.emit('command', {
      command : command,
      params : params
    });
  }
};

$(function() {
  console.log( "ready!" );
  
        var accessToken = "";
		var subscriptionKey = "";
		var baseUrl = "https://api.api.ai/v1/";
		$(document).ready(function() {
			$("#input").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					send();
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
		});
		var recognition;
		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "pt-BR";
			recognition.start();
		}
	
		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}
		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}
		function setInput(text) {
			$("#input").val(text);
			send();
		}
		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
		}
		function send() {
			var text = $("#input").val();
			$.ajax({
				type: "POST",
				url: baseUrl + "query/",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken,
					"ocp-apim-subscription-key": subscriptionKey
				},
				data: JSON.stringify({ q: text, lang: "pt-br" }),
				success: function(data) {
					setResponse(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Loading...");
		}
		function setResponse(val) {
			var obj = JSON.parse(val);
			if (obj.result.action = 'playMusic') {
				 socketIO.command( 'play', {
                    novideo : true
                  });
			}
		}

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
    socketIO.command( 'play', {
      novideo : true
    });
  });
  $('#stop').click(function() {
    socketIO.command( 'stop' );
  });
  $('#forward').click(function() {
    socketIO.command( 'next' );
  });
  $('#volume').click(function() {
    // socketIO.command( 'play' );
  });
});
