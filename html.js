Router.map(function () {
  this.route('Home', {
    path: '/',
    icon:'icon-home'
  });
});
Router.map(function () {
  this.route('Search', {
    path: '/search',
    icon:'icon-search'
  });
});
if(Meteor.isClient){
    Template.navbar.route = function(){
        return Router.routes;
    }
}