Meteor.publish('pools', function(ip) {
  return Pools.find();
});