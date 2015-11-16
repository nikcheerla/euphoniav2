//neural net libraries
brain = require('brain')


//definition of music
var noteExampleA = {pitch: "A", octave: "1": start: 50, duration: 10};
var noteExampleB = {pitch: "B", octave: "1": start: 100, duration: 5};
var musicExample = [A, B];

var play = function(music){
	//somehow uses HTML5 audio to play a piece of music
}
play(musicExample);










//music rating using neural nets: the networks should "learn" exactly
//how a human would rate a piece for each given category
var nets = {};
var trainSizes = {};
var trainExamples = {};

//train the networks when enough new examples put in
var trainNet = function(category){
	if (!(category in nets)) {
		nets[category] = new brain.NeuralNetwork();
		trainSizes[category] = 0;
	}

	if(trainSizes[category] + 2 < trainExamples[category].length) {
		net.train(trainExamples[category]);
		trainSizes[category] = trainExamples[category].length;
	}
}

//react to a new example being put in
var rate = function(music, category, rating) {
	if(!(category in trainExamples)) {
		trainExamples[category] = [];
	}
	trainExamples[category].append({input: music, output: rating});
	trainNet(category);
}

rate(musicExample, "Atonality", 90);

//get the neural networks guess for how a piece of music rates
//in a particular category
var getRating = function(music, category) {
	return nets[category].run(music);
}


getRating(musicExample, "Atonality");









//Genetic Algorithm that creates a piece of music that
//matches closely to a set of ratings

var popSize = 500;
var generations = 100;

var compose = function(categories) {

	//use minimum squared distance to compute how close
	//a piece of music is to the desired rating in each
	//specified category (using neural network predictions)

    var fitness = function(music){
    	var total = 0.0;
    	for(var cat in categories) {
    		total += Math.pow((categories[cat] - getRating(music, cat)), 2);
    	}
    	return total;
    }
	
    var randomSong = function() {
    	//generates a random song
    }

    var mutate = function(music){
    	//mutates a piece of music
    	var music2 = music;
    	return music2;
    }

    var child = function(song1, song2) {
    	//returns a combination of two songs

    	return song1;
    }

    //Create a random population of songs
    var population = [];
    for(i = 0; i < popSize; i++) {
    	population.push(randomSong());
    }


    //Apply natural selection to the population, "killing"
    //the songs that are not close enough to the given categories

    for(i = 0; i < generations) {

    	//Sort by the fitness function, songs
    	//closer to the categories are first
    	population.sort(function(a, b) {
    		return fitness(a) - fitness(b);
    	});

    	//kill 3/4 of population
    	for(i = 0; i < popSize*3/4; i++) {
    		population.pop();
    	}

    	//allow survivors to breed
    	for(i = 0; i < popSize*1/2; i++) {
    		var rnd1 = population[Math.floor(Math.random() * population.length)];
    		var rnd2 = population[Math.floor(Math.random() * population.length)];
    		population.push(child(rnd1, rnd2));
    	}

    	//add "immigration" of new randoms songs for diversity
    	for(i = 0; i < popSize*1/4; i++) {
    		population.push(randomSong);
    	}

    	//add genetic mutations to the population
    	for(i = 0; i < popSize; i++) {
    		population[i] = mutate(population[i]);
    	}
    }

    //After enough generations, the "first" or fittest organism
    //is probably very aligned with the specified categories
    population.sort(function(a, b) {
		return fitness(b) - fitness(a);
	});
	return population[0];
}


categoryExamples = {"Atonality": 5, "Happiness": 6, "Anger": 1};

//This song, when played, should be atonal and happy
play(compose(categoryExamples));


