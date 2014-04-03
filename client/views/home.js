Template.home.helpers({
  pools: function() {
    var pool = Pools.find().fetch();
    return pool;
  }
});

Template.node.rendered = function() {
  var self = this;
  Meteor.setTimeout(function() {
    $(self.find('.blast')).removeClass('blast');
  }, 500);
};

Template.home.events({
  'click button': function(event, template) {
    var ip = $('input').val();
    var currency = $(event.target).attr('id');
    Session.set('ip', ip);
    Meteor.call('scan', ip, currency, function(err, res) {
      if(!err) {
        console.log('boop')
      }
    });
  }
})