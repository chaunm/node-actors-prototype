{
    "_id" : ObjectId("578897b356eb252faafad88b"),
    "id" : "gateway/<machine-id>",
    "token" : "ce6ff2a19ec491f736ab6912a08f1933f7f8f52ea10b95231e9d51e210954d30",

    "configuration" : {
        "grant" : [ 
            "system", 
            "user/anonymous"
        ],
        "wifi" : {
            "ssid" : "Evolas",
            "password" : ""
        }
    },

    "about": {
	    name: 'Evolas I',
	    model: 'EVO68',
      link: 'http://evolas.vn/products/evo68',
	    owner: {
	      id,  // id of the owner (user/<id>)
	      activatedTime // time at which the system's activated
	    },
	    system: {
	      name: 'Evolas System',
	      version: '1.0',
	      releasedTime: 'Jul 14th 2016',
	      upTime, // system up time
	      currentTime // current time of system, updated every minutes
	    },
    state : {
      storage: {
        total, // in Gb
        used,
        free
      },
      memory: { // updated every 5min
        total, // in Gb
        used,
        free        
      },
      power: {
        blackout, // true or false
        timeout: 60000
      },
      gsm : {
        state: 'state.{connected, disconnected}',
        network: 'viettel',
        signal: 'signal.{poor, fair, good, excellent}',
        phoneNumber: '0987xyz',
        balance: '1000 VND'
      },
      wifi: {
        state: state.{connected, disconnected, broadcasting},
        network: 'xyz.com',
        ip
      }
    }          
    },

}