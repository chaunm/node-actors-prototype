var world = { // database evolas

	genes: [ // collections
		{
			class : 'device/zigbee',
			link: 'https://evolas.vn/product/sensor/...',
			name: {
				vi: 'Thiet bi dieu khien Zigbee',
				en: 'Zigbee controller'
			},
			actions: [
				{
					type: 'action/device/zigbee/add_devices',
					name: {
						vi: 'Them thiet bi',
						en: 'Add devices'
					},
					params: {
						type: 'object',
						properties: {

						}
					}
				}
			],
			events: [
				{
					type: 'event/device/zigbee/device_added',
					name: {
						vi: 'Thiet bi moi',
						en: 'Device added'
					},
					origin: {
						type: 'object',
						properties: {
							id: {
								type: 'string',
								description: 'ID of the associated zigbee device'
							}
						}
					},
					params: {
						type: 'object',
						properties: {

						}
					}
				}
			]
		}
	],

	things: [ // collections
		{
			_id: id,
			class, // allow query by class: 'device/sensor', 'device/#', 'service/#'
			state
		}
	],

	history: [ // how to cope with oversizing??? --> capped collections --> service home
		{
			event: {
				type,
				contextId, // optional
				state
			},
			important,
			viewed
		}
	],	

	locations: [  // collections --> service Home
		{
			id,
			name,
			icon
		}
	],

	context: [ // only for devices. Any new device registered will be placed into this collection with configured = false --> service home
		{
			_id,
			thingId, // unique
			configured, 
			name, // NA if configured = false
			locationId // NA if configured = false
		}
	],

	scenes: [
		{
			_id,
			name,
			actions
		}
	],

	automation_scene: [
		{
			automationId: sceneId
		}
	],

	automations: [
		{
			_id,
			select,
			act,
			when,
			depend: { // for later update
				things: [
				],
				location: [
				]
			}
		}
	]

}
