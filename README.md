# vsRecog
WebKit Speech Recogination 

If the browser supports WebKit, you should be golden:
[https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility)


Include script in HTML
```
<script src="vsRecog.js"></script>
```


Init vsRecog
```
<script>
var recog = new vsRecog();
// Recog init successfully
if(recog.isSetup){

}
</script>
```


Set Parameters
```
<script>
// Phrase to trigger recogination
recog.trigger_word = 'Hey Bobby';

// Phrase(s) to trigger breakout, so you can use it without always using a trigger word
recog.trigger_breakout = ['Hey Bobby breakout'];
</script>
```



Callbacks
```
<script>
// Recog Started
recog.onStart = () = {
};

// Recog new transcript
recog.onUpdate = (transcript) => {
};

// Recog breakout
// Used for having a conversation or don't always want a trigger word
recog.onBreakout = (transcript) => {
};
</script>
```




Full Example
```
<script>
var recog = new vsRecog();
// Recog init successfully
if(recog.isSetup){
  recog.trigger_word = 'Hey Bobby';
  recog.trigger_breakout = ['Hey Bobby breakout'];
  
  recog.onStart = () = {

  };
  
  recog.onUpdate = (transcript) => {
  };
  
  recog.onBreakout = (transcript) => {
  };
}
</script>
```
