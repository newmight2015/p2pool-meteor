Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home',
    action: function() {
      if(this.ready()) {
        this.render();
      } else {
        this.render('loading');
      }
    }
  });
});

