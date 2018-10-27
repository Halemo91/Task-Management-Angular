/* Services to get requests from the api */

var app = angular.module('taskServices', []);

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
        console.log(id)
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
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])
