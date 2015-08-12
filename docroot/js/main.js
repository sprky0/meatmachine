(function(document){

	var volume = 0.4;

	function Snd(file){

		var a = document.createElement('audio');
		var ext = !!a.canPlayType('audio/mp3') ? '.mp3' : '.wav';
		a.src = 'audio/' + file + ext;
		a.volume = volume;

		this.play = function() {
			a.currentTime = 0;
			a.play();
		}

		this.stop = function() {
			a.pause();
			a.currentTime = 0;
		}

	}

	function Sampler(files,options) {

		var sounds = [];
		var options = options || {
			polyphonic : true
		};

		for(var i = 0; i < files.length; i++) {
			sounds.push(new Snd(files[i]));
		}

		function stopAll() {
			for(var i = 0; i < sounds.length; i++) {
				sounds[i].stop();
			}
		}

		function play(number) {
			if (!options.polyphonic) {
				stopAll();
			}
			if (has(number)) {
				sounds[number].play();
			} else {
				console.log('no ' + number);
			}
		}

		function has(number) {
			return !!sounds[number];
		}

		return {
			has : has,
			play : play
		};

	}

	function meeeeeeat() {
		var a = new snd('m'+Math.ceil(Math.random() * 2));
		a.play();
		setTimeout(meeeeeeat,Math.random() * 2000);
	}

	// setTimeout(meeeeeeat,500);



	function drumMachine() {

		// btw ffmpeg -i beep.wav -codec:a libmp3lame -qscale:a 2 beep.mp3

		var sounds = {
			drums : new Sampler([
				'drums/kick',
				'drums/snare',
				'drums/snare2'
			]),
			perc : new Sampler([
				'drums/beep',
				'drums/hihat'
			]),
			vocals : new Sampler([
				'vocals/m1',
				'vocals/m2'
			], {
				polyphonic : false
			})
		};

		var patterns = {
			drums : [
				'0--01--1-1001---',
				'0---1--2-1-01--1',
				'011-1-1--1-01---',
				'0-0-111--1-01111',
				'020-12-2-120--22'
			],
			perc : [
				'-0--0-0--01-0100',
				'10--000-101-0100',
				'1010101010101010'
			],
			vocals : [
				'--------000--00-',
				'------------1111'
			]
		};

		var options = {
			bpm : 120,
			tick : 800 / 4,
			step : 0
		}

		function tick() {

			for (i in patterns) {

				var pattern = Math.floor(Math.random() * patterns[i].length);
				var step = options.step % patterns[i][pattern].length;
				var sound = patterns[i][pattern][step];

				console.log('entering ' + step + '/' + patterns[i][pattern].length + ':' + sound);

				if (sound !== -1 && sound !== '-' && sounds[i].has(sound)) {
					sounds[i].play(sound);
				}

			}

			options.step++;

		}

		setInterval(tick, options.tick);

	}

	drumMachine();

})(document);
