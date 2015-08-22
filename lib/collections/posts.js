Posts = new Mongo.Collection('posts');

Posts.allow({
	update: ownsDocument,
	remove: ownsDocument
});

Posts.deny({
	update: function(userId, post, fieldNames){
		return (_.without(fieldNames, 'url', 'title').length >0);
	}
});

Meteor.methods({
	postInsert: function(postAttributes) {
		check(Meteor.userId(), String);
		check(postAttributes, {
			url: String,
			title: String
		});

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink){
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			//title: postAttributes.title + (this.isSimulation ? '(client)': '(server)'),
			userId: user._id,
			author: user.username,
			submitted: new Date(),
    		commentsCount: 0
		});

		/*if (! this.isSimulation)
		{
			var Future = Npm.require('fibers/future');
			var future = new Future();
			Meteor.setTimeout(function() {
				future.return();
			}, 5000);
			future.wait();
		}*/

		var postId = Posts.insert(post);
		return {
			_id: postId
		}
	}
});