#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var brain = require('brain');
var midiFileParser = require('midi-file-parser');
var fs = require('fs');

var glob = require("glob")
_ = require("underscore");


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.app = express();
        self.app.use(express.static("public"));
        
        self.app.get("/generate", function(req, res){
            /*


                TODO: call lua script sample.lua 
                with latest checkpoint and use it to create text file for gen music


            */

            var txt = require('fs').readFileSync('music/genmusic11.txt', "utf8")
            txt = String(txt);
            arr = txt.split("\n");
            //console.log(arr);
            res.send(arr);
        });
        self.app.get("/retrain", function(req, res){
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
               fs.writeFileSync("music/input.txt", dat);

               /*


                    TODO: call train.lua and train RNN

               */
            });

            

        });

    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */


var zapp = new SampleApp();
zapp.initialize();
zapp.start();



