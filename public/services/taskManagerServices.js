/* Services to get requests from the api */

var app = angular.module('taskServices', ['ngResource']);

/*assging the url to constant value*/
app.constant("baseURL", "http://localhost:3000/")

/*factory to get the tasks data */
app.factory("tasks", ['$resource','baseURL',function($resource,baseURL) {
    return $resource(baseURL+"tasks/");
}]);
/*services to get one task */
app.service('getOneTask',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(id){
        return $resource(baseURL+"tasks/"+id,null,{
          'update':{
            method:'GET'
          }
        });
      };
}])
/*services to get the subtasks data */
app.service('getSubTasks',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(id){
        return $resource(baseURL+"tasks/"+id+"/subtasks",null,{
          'update':{
            method:'GET'
          }
        });
      };
}])
/*services to get one subtask */
app.service('getOneSubTask',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(id){
        return $resource(baseURL+"subtasks/"+id,null,{
          'update':{
            method:'GET'
          }
        });
      };
}])
/*services to get the category data */
app.service('getCategories',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(){
        return $resource(baseURL+"categories",null,{
          'update':{
            method:'GET'
          }
        });
      };
}])
/*services to update the tasks data */
app.service('updateTaskService',['$resource','baseURL',function($resource,baseURL){
      this.patchFeedback=function(id){
        return $resource(baseURL+"tasks/"+id,null,{
          'update':{
            method:'PATCH'
          }
        });
      };
}])
/*services to update the subtasks data */
app.service('updateSubTaskService',['$resource','baseURL',function($resource,baseURL){
      this.patchFeedback=function(id){
        return $resource(baseURL+"subtasks/"+id,null,{
          'update':{
            method:'PATCH'
          }
        });
      };
}])
/*services to get one user */
app.service('getOneUser',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(id){
        return $resource(baseURL+"users/",null,{
          'update':{
            method:'GET'
          }
        });
      };
}])
/*to handel errorRejections*/
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])
/*to get user email*/
app.controller('userCtr', ['$scope','getOneUser', function($scope,getOneUser) {
  getOneUser.getFeedback().query(function(response) {
    if(response && response.length > 0){
        response.forEach(function(res) {
            if(res && res.email && res.id == 1){ //hardcoded user id 1 as mentioned in the task
              $scope.email = res.email;
              $scope.pass = res.email;
            }
        });
    }else {
    console.error("Could not get any users");
   } });
}])
