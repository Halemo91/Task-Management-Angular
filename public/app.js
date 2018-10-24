
var app1 = angular.module('consumeRestApp', ['ngResource','ui.grid', 'ui.grid.edit']);

 app1.constant("baseURL", "http://localhost:3000/");
app1.factory("tasks", function($resource) {
    return $resource("http://localhost:3000/tasks");
});
app1.service('getSubTasks',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(id){
        return $resource(baseURL+"tasks/"+id+"/subtasks",null,{
          'update':{
            method:'GET'
          }
        });
      };
    }]);

app1.controller('ctrl1', ['$scope','tasks','getSubTasks', function($scope,tasks,getSubTasks) {
$scope.test = [];
  tasks.query(function(data) {
     $scope.tasks = data;
     $scope.tasks.forEach(function(obj) {
       obj.subTask = [];

         $scope.subTasksService = getSubTasks.getFeedback(obj.id).query(function(response) {
            response.forEach(function(res) {
                    if(res.taskId == obj.id){
                      obj.subTask.push(res);

                    }
            });
         });


      });

     $scope.gridOptions.data = $scope.tasks;
     console.log('griddd',$scope.tasks)

 }, function(err) {
     console.error("Error occured: ", err);
 });
    $scope.first = 1;
     $scope.second = 1;
     $scope.gridOptions = {
        columnDefs: [
          { field: 'name' },
          { field: 'dueDate', name: 'dueDate' },
        { field: 'priority' },
        { field: 'category' }
        ]
      };

        // $scope.sendFeedback = function() {
        //         $scope.feedback.date = new Date().toISOString();
        //         $scope.feedbacks.push($scope.feedback);
        //         getSubTasks.getFeedback().update($scope.feedbacks);
        //         $scope.feedbackForm.$setPristine();
        //         $scope.feedback = {firstName: "",lastName: "",email: "", date:""};
        // };
    }])
