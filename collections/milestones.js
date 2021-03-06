Milestones = new Meteor.Collection('milestones');
if (Meteor.isServer) {
	Milestones._ensureIndex({ "id": 1 }, { unique: true });
}

Meteor.methods({
	setCurrentMilestone: function(milestoneId) {
		Milestones.update({current: true, id: {$nin: [milestoneId]}}, {$set: {current: false}}, {multi: true});
		Milestones.update({id: parseInt(milestoneId)}, {$set: {current: true}});
		if (Meteor.isServer) {
			Assembla.populateTicketCollection();
		}
	},
	setDefaultMilestone: function() {
		if (!Milestones.findOne({current: true})) {
			Milestones.update({title: "Testing App"}, {$set: {current: true}});
		}
		if (Stream.find().count() !== 1) {
			Stream.remove({});
			Stream.insert({on: false});
		}
	},
	updateMilestones: function() {
		if (Meteor.isServer) {
			Assembla.populateAssemblaUsers();
			Assembla.updateMilestoneCollection();
		}
	}
})
