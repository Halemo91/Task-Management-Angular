
var app1 = angular.module('consumeRestApp', ['ngResource','ui.grid', 'ui.grid.edit']);

// app1.constant("baseURL", "http://localhost:3000/");
app1.factory("tasks", function($resource) {
    return $resource("http://localhost:3000/tasks");
});
// app1.service('feedbackService',['$resource','baseURL',function($resource,baseURL){
//       this.getFeedback=function(){
//         return $resource(baseURL+"tasks/id",null,{
//           'update':{
//             method:'PUT'
//           }
//         });
//       };
//     }]);

app1.controller('ctrl1', ['$scope','tasks', function($scope,tasks) {
$scope.test = [];
  tasks.query(function(data) {
     $scope.tasks = data;
     $scope.gridOptions.data = data;

     $scope.test.push(data);
 }, function(err) {
     console.error("Error occured: ", err);
 });
    $scope.first = 1;
     $scope.second = 1;
     console.log('ddd',$scope.test )
     $scope.gridOptions = {
        columnDefs: [
          { field: 'name' },
          { field: 'dueDate', name: 'dueDate' },
        { field: 'priority' },
        { field: 'category' }
        ]
      };
        // $scope.feedbacks = feedbackService.getFeedback().query(function(response) {
        //     $scope.feedbacks = response;
        // });
        // $scope.sendFeedback = function() {
        //         $scope.feedback.date = new Date().toISOString();
        //         $scope.feedbacks.push($scope.feedback);
        //         feedbackService.getFeedback().update($scope.feedbacks);
        //         $scope.feedbackForm.$setPristine();
        //         $scope.feedback = {firstName: "",lastName: "",email: "", date:""};
        // };
    }])
