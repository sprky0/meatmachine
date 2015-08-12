(function(document){

	var volume = 1;
	var running = false;
	var preload = [];

	function Snd(file) {

		var a = document.createElement('audio');
		var ext = !!a.canPlayType('audio/mp3') ? '.mp3' : '.wav';
		a.src = 'audio/' + file + ext;
		a.load();
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
			polyphonic : true,
			volume : 1
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
				'vocals/givemethat',
				'vocals/guh',
				'vocals/meat1',
				'vocals/meat2',
				'vocals/yell1',
				'vocals/yell2'
			], {polyphonic : false}),
			bass : new Sampler([
				'cello/1',
				'cello/2',
				'cello/3',
				'cello/4',
				'cello/5',
				'cello/6',
				'cello/7'
			], {polyphonic : false})
		};

		var patterns = {
			drums : [
				'0---2-----2-----',
				'0---1-----0-1---',
				'0---11----0-1---',
				'00--1-----0-11--'
			],
			perc : [
				'---------0------',
				// '000-00000000-000',
				'11111111111111--'
			],
			vocals : [
				'0---------------',
				'1---------------',
				'2---------------',
				'3---------------',
				'4---------------',
				'5---------------',
				'6---------------',
				'--------------0-',
				'-----------1----',
				'22222-------222-',
				'33333-------333-'
			],
			bass : [
				'0--4---2----5---',
				'0--4---2----5432',
				'0-3456-41---5-21'
			]
		};

		var options = {
			bpm : 120,
			tick : 200,
			step : 0
		}

		function tick() {

			if (!running)
				return;

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

	var noise = new Snd('noise/noise', {autoplay:true,loop:true});

	drumMachine();

	document.getElementsByTagName('body')[0].addEventListener('click',function(){

		running = !running;

		var meat = document.getElementsByClassName('meat')[0];

		if (!running) {
			document.getElementById('main').classList.add('waiting');
			meat.classList.add('desaturate');
			meat.classList.remove('dancing');
			noise.play();
		} else {
			document.getElementById('main').classList.remove('waiting');
			meat.classList.remove('desaturate');
			meat.classList.add('dancing');
			noise.stop();
		}

	})

})(document);
