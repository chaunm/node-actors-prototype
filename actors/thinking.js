// pseudo code for module loader

meta.forEach(
	function(m){
		if(m.hosted){
			serviceHost.host(m)
		} else {
			runStandalone(m)
		}
	}
)

// for nodejs actor
module.exports = Service
// So ServiceHost could know how to host it

// ServiceHost.js
function run(meta){
	if(meta.hosted){
		runHosted(meta, callback)
	} else {
		runStandalone(meta, callback)
	}
}

runHosted(meta, callback){
	var service = new meta.service(meta)
	service.on('status', function(err){
		callback(err)
	})
}

runStandalone(meta, callback){
	runCommandInAnotherProcess('meta.start --id id --token token')


	// Question A: How to know if the service's started? 
	// Approach #1:  Service Host listen for '<meta.id>/:event/status'
	// Approach #2: Nodejs <-> Binary process via messages 
	// Currently there's no support for non-Nodejs process
	// --> Solution: #1

	// Question B: Differences in running NodeJS and non-Nodejs service in standalone mode?
	// There's no difference. The approach is:
	// #1: for nodejs:
	// var exec = require('child_process').exec;
	// exec('node runner.js --service meta.path --id id --token token')
	// #2: for non-nodejs
	// exec('./meta.path --id id --token token')
	// --> Solution: #2

}

// for other actor (usually in binaries)
module.exports = function(meta, callback)
