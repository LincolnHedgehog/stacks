var Docker = require('dockerode');
var http = require('http');
var docker;
var mode = process.argv[2];
var regAuth = process.argv[3];
if (mode == '-ip') {
	docker = new Docker({host: process.argv[3] , port: 2376});
	regAuth = process.argv[4];
} else if (mode == '-s') {
	 docker = new Docker({socketPath: '/var/run/docker.sock'});
}

if (mode == '-ip' || mode == '-s') {
	var auth = {'authconfig':{'key': regAuth}};
	var lineReader = require('readline').createInterface({
		input: require('fs').createReadStream('images')
	});
	
	lineReader.on('line', function (line) {
		var currentAuth = (line.indexOf('gitlab')>0)?auth:{};
		if (regAuth || line.indexOf('gitlab')<0) {
			docker.pull(line,currentAuth,
					  function (err, stream) {
				  		if (!err) {
				  			stream.pipe(process.stdout);
				  		} else {
				  			console.log(err);
				  		}
				});
		}
	});
} else {
	console.log('Usage: [-ip <remote-ip>|-s] <gitlab-token>');
}
