class vsRecog {
	recognition;
	isActivated = false;
	isBreakout = false;
	isRecognitionRunning = false;
	isSetup = false;
	
	// Callback Functions
	onUpdate; // Called on final word
	onUpdateWord; // Called on all words (interimResults needs to be `true` to work)
	onBreakout;
	onStart;
	
	// Trigger Words
	trigger_word = 'hey anastasia';
	trigger_breakout = ['hey anastasia breakout','hey anastasia break out'];
	

	constructor(useGoogle='auto'){
		console.warn('vsRecog', useGoogle);
		if(!useGoogle || useGoogle == 'auto') this.setup_webspeech();

		if(useGoogle === true || (useGoogle == 'auto' && !this.isSetup)) this.setup_webspeech_google();
	}
	setup_webspeech_google(){
		console.warn('setup_webspeech_google', 'Not setup yet');
	}
	setup_webspeech(){
		try {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			if (!SpeechRecognition) {
				console.error('SpeechRecognition API is not supported in this browser.');
				return;
			}
			this.recognition = new SpeechRecognition();
			this.recognition.continuous = true; // Set to continuous listening
			this.recognition.lang = 'en-US';
			this.recognition.interimResults = false; // You might want to capture interim results

			this.isSetup = SpeechRecognition ? true : false;
			
			if(this.isSetup) this.setup();
		}
		catch(error){
			console.error(error);
		}
	}
	setup(){
		this.recognition.onstart = () => {
			console.log('recognition.onstart');
			this.isRecognitionRunning = true;
			if(typeof this.onStart === 'function') this.onStart();
		};
		this.recognition.onresult = (event) => {
			var last = event.results.length - 1;
			var transcript = event.results[last][0].transcript.trim();
			console.log("transcripts", transcript);

			if (!this.isActivated) {
				// Check for the activation phrase
				// Breakout will allow continues talking
				if(this.trigger_breakout && this.trigger_breakout.includes(transcript.toLowerCase())){
					console.log("Activation phrase detected with breakout");
					this.isActivated = true;
					this.isBreakout = true;
					if(typeof this.onBreakout === 'function') this.onBreakout(transcript);
				}
				else if(this.trigger_word.includes(transcript.toLowerCase())){
					console.log("Activation phrase detected");
					this.isActivated = true;
				}
			}
			else {
				// Activation phrase has been said, now capturing the following speech
				// Speech has paused
				if (event.results[last].isFinal) {
					if(transcript == '') return false;

					console.log("Captured speech after activation phrase: " + transcript);
					// This is a backup detection for breakout
					if(this.trigger_breakout && this.trigger_breakout.includes(transcript.toLowerCase())){
						this.isBreakout = true;
						if(typeof this.onBreakout === 'function') this.onBreakout(transcript);
					}
					else {
						if(typeof this.onUpdate === 'function') this.onUpdate(transcript);

						if(!this.isBreakout){
							// Reset for next activation
							this.isActivated = false;
						}
					}
				}
				else if(typeof this.onUpdateWord === 'function') {
					// Keep track of previously detected transcript
					if (!this.previousTranscript) {
						this.previousTranscript = '';
					}
					// Determine the new part of the transcript
					var newWords = transcript.replace(this.previousTranscript, '').trim();

					// Update the previous transcript for the next comparison
					this.previousTranscript = transcript;
					this.onUpdateWord(newWords);
				}
			}
		};
		
		this.recognition.onerror = (event) => {
			if(event.error == 'no-speech') {
				console.log('Speech recognition error detected: ' + event.error);
				return false;
			}

			console.error('Speech recognition error detected: ' + event.error);
			if(!this.isBreakout) this.isActivated = false; // Reset on error
		};

		this.recognition.onend = () => {
			console.log('recognition.onend', this.isActivated, this.isBreakout, this.isRecognitionRunning);
			this.isRecognitionRunning = false;
			//this.isActivated = false;
			// If you want to keep listening even after a pause
			//if (!this.isActivated) {
				if(!this.isRecognitionRunning) this.recognition.start();
			//}
		};
	}
}
