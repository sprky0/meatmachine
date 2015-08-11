(function(){

	var snd = function(){

		var a = document.createElement("audio");
		var ext = a.canPlayType('audio/mp3');
		a.src = 'audio/m' + Math.floor(Math.random() * soundcount) + ext;

		this.play = function() {
			a.play();
		}

	};

	var a = new snd();
	a.play();

});
