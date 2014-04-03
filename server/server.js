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
        console.log(nodes)
        Pools.upsert({seed: ip}, {seed: ip, nodes: nodes, found: true});
        _.each(nodes, function(node) {
          var secondaryPort = currencies[currency];
          HTTP.get('http://'+node+':'+secondaryPort+'/peer_addresses', function(err, res) {
            if(!err && res.data) {
              var newNodes= res.data.split(' ');
              newNodes = stripPorts(newNodes);
              console.log(newNodes)
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
  nuke: function() {
    Pools.remove({});
  }
});

var stripPorts = function(arr) {
  var portless = [];
  for(var i = 0, newNode; newNode = arr[i++];) {
    newNode = newNode.substring(0, newNode.indexOf(':'));
    portless.push(newNode);
  }
  return portless;
}