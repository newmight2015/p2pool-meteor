Template.home.helpers({
  pools: function() {
    return Pools.find({},{sort:{ts: -1}}).fetch();
  }
});

Template.node.helpers({
  pingColored: function() {
    if(this.ping === 0) {
      return 'label label-default'
    } else if(this.ping < 200) {
      return 'label label-success'
    } else if(this.ping > 200 && this.ping < 400) {
      return 'label label-warning'
    } else {
      return 'label label-danger'
    }
  }
})

Template.node.rendered = function() {
  var self = this;
  Meteor.setTimeout(function() {
    $(self.find('.blast')).removeClass('blast');
  }, 500);
};

Template.home.events({
  'click .scan': function(event, template) {
    var ip = $('#ip').val();
    var port = $('#port').val();
    var currency = $(event.target).attr('id');
    Session.set('ip', ip);
    Meteor.call('scan', ip, port, currency, function(err, res) {
      if(!err) {
        console.log('boop')
      }
    });
  },
  'click .ping': function(event, template) {
    var self = this;
    _.each(this.nodes, function(node) {
      ping(node.ip, function(err, res) {
        Meteor.call('updatePool', self._id, node.ip, res);
      });
    })
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

