var currencies = {
  'drk': 7903,
  'fst': 5150,
  'btc': 9332
};


Meteor.methods({
  scan: function(ip, currency) {
    //todo: change port based on currency
    var port = currencies[currency];
    HTTP.get('http://'+ip+':'+port+'/peer_addresses', function(err, res) {
      if(!err && res.data) {
        var nodes = res.data.split(' ');
        console.log(nodes)
        Pools.upsert({seed: ip}, {seed: ip, nodes: nodes});
        _.each(nodes, function(node) {
          var noPort = node.substring(0, node.indexOf(':'));
          HTTP.get('http://'+noPort+':'+port+'/peer_addresses', function(err, res) {
            if(!err && res.data) {
              var newNodes= res.data.split(' ');
              console.log(newNodes)
              Pools.update({seed: ip}, {$addToSet: {nodes: {$each: newNodes}}})
            }
          })
        })
      } else {
        console.log(err)
      }
    })
  }
});