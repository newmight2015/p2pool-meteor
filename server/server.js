var currencies = {
  'drk': 7903,
  'fst': 5150,
  'btc': 9332,
  'ltc': 9327
};


Meteor.methods({
  scan: function(ip, port, currency) {
    if(_.isEmpty(port)) {
      port = currencies[currency];
    }
    HTTP.get('http://'+ip+':'+port+'/peer_addresses', function(err, res) {
      if(!err && res.data) {
        var nodes = res.data.split(' ');
        nodes = stripPorts(nodes);
        Pools.upsert({seed: ip}, {seed: ip, nodes: nodes, found: true, ts: +new Date, currency: currency});
        _.each(nodes, function(node) {
          var secondaryPort = currencies[currency];
          HTTP.get('http://'+node+':'+secondaryPort+'/peer_addresses', function(err, res) {
            if(!err && res.data) {
              var newNodes= res.data.split(' ');
              newNodes = stripPorts(newNodes);
              Pools.update({seed: ip}, {$addToSet: {nodes: {$each: newNodes}}})
            }
          })
        })
      } else {
        console.log('error:' + err)
        Pools.upsert({seed: ip}, {seed: ip, found: false});
      }
    })
  },
  updatePool: function(id, ip, ping) {
    Pools.update({'_id': id, 'nodes.ip': ip}, {$set: {'nodes.$.ping': ping}});
  },
  nuke: function() {
    Pools.remove({});
  }
});

var stripPorts = function(arr) {
  var portless = [];
  for(var i = 0, newNode; newNode = arr[i++];) {
    newNode = newNode.substring(0, newNode.indexOf(':'));
    var nood = {};
    nood.ip = newNode;
    nood.ping = 0;
    if(!_.isEmpty(newNode)) {
      portless.push(nood);
    }
  }
  return portless;
}