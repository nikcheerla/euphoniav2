	
var midiFileParser = require('midi-file-parser');
var fs = require('fs');


var glob = require("glob")
_ = require("underscore");

var dat = "";
// options is optional

function zpad(n, len) {
  return 0..toFixed(len).slice(2,-n.toString().length)+n.toString();
}

glob("music/*.mid", function (er, files) {
   console.log(files);
   files = _.shuffle(files);
   for(num in files) {
   		filename = files[num];
   	   	console.log(filename);

   		var file = fs.readFileSync(filename, 'binary')
   		var midi = midiFileParser(file);
   		fin = midi;
   		//dat += "\n\n" + filename + "\n\n";
		var metro = 0.01;
		var sumtime = 0;
		var i = 0;
		for(val in fin["tracks"]) {
			for(val2 in fin["tracks"][val]) {
			  note = fin["tracks"][val][val2];
			  if(note.hasOwnProperty("noteNumber")) {
			      noteNumber = note["noteNumber"];
			      delay = i*metro;
			      if(note["subtype"] === "noteOn") {
			        sumtime += note["deltaTime"];
			        delay = sumtime*metro;
			        //if(i > 500) break;
			          velocity = note["velocity"];
			        
			        dat += zpad(noteNumber, 3) + ", " + velocity + ", " + delay.toFixed(2) + "\n"; 
			        //MIDI.noteOn(0, noteNumber, velocity, delay);
			      }
			      else if(note["subtype"] === "noteOff") {
			        delay = sumtime*metro;
			        velocity = note["velocity"];
			        //MIDI.noteOff(0, noteNumber, delay + 0.1);
			        dat += zpad(noteNumber, 3) + ", " + "XX" + ", " + delay.toFixed(2) + "\n"; 
			      }
			      //if(i < 50) alert(JSON.stringify(note));
			      i++;
			  }
			}
		}
   }
   fs.writeFileSync("music/music_processed.txt", dat);
});

