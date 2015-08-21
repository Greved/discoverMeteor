Template.layout.helpers({
	pageTitle: function() { return Session.get('pageTitle'); }
});
Meteor.startup(function() {
  Tracker.autorun(function() {
    console.log('There are ' + Posts.find().count() + ' posts');
  });
});