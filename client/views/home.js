Template.home.helpers({
  pools: function() {
    var pool = Pools.find().fetch();
    return pool;
  }
});

Template.node.rendered = function() {
  var self = this;
  ping(this.data, function(err, res) {
  Meteor.setTimeout(function() {
    $(self.find('.blast')).append('  <span class="label label-default">'+res+'</span>');
    $(self.find('.blast')).removeClass('blast');
  }, 500);
  });
};

Template.home.events({
  'click button': function(event, template) {
    if($(event.target).attr('id') === 'nuke') {
      Meteor.call('nuke');
    } else {
      var ip = $('#ip').val();
      var port = $('#port').val();
      var currency = $(event.target).attr('id');
      Session.set('ip', ip);
      Meteor.call('scan', ip, port, currency, function(err, res) {
        if(!err) {
          console.log('boop')
        }
      });
    }
  }
});

function ping(ip, callback) {
  var now = +new Date;
  var ws = new WebSocket("ws://" + ip);
  ws.onerror = function(e){
    var later = +new Date;
    var ms = later-now;
    callback(null, ms);
    ws = null;
  };
  setTimeout(function() {
    if(ws != null) {
      ws.close();
      ws = null;
      callback(true, null);
    }
  },2000);
}

