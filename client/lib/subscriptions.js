Deps.autorun(function() {
  Meteor.subscribe('pools', Session.get('ip'));
});