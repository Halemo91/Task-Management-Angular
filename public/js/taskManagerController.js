
var app = angular.module('taskManagerApp', ['ngResource','ui.grid', 'ui.grid.edit', 'ui.bootstrap']);

app.constant("baseURL", "http://localhost:4000/");
app.service('getSubTasks',['$resource','baseURL',function($resource,baseURL){
      this.getFeedback=function(id){
        return $resource(baseURL+"tasks/"+id+"/subtasks",null,{
          'update':{
            method:'GET'
          }
        });
      };
    }]);
app.factory("tasks", function($resource) {
    return $resource("http://localhost:4000/tasks");
});
app.controller('taskManagerCtr', ['$scope','tasks','getSubTasks','uiGridConstants','$q', '$injector','$uibModal', function($scope,tasks,getSubTasks,uiGridConstants,$q, $injector,$uibModal) {
    'use strict';
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

     $scope.gridOptions = {
       enableSorting: true,

       enableRowSelection: true,
       enableFiltering: true,
       infiniteScrollDown: false,
       paginationPageSizes: [5, 10, 25, 50],
       paginationPageSize: 25,
       enableColumnResizing: true,
       enableGridMenu: true,
       hideItemCount: false,

       enableExpandableRowHeader: false,
        columnDefs: [
          { field: 'name' ,
          cellTemplate: '<div ui-sref=\"http://localhost:4000/tasks/1\"  > ' +
          "<div ng-click='grid.appScope.gridRowClick(row)' >     {{row.entity.name}}   </div>"+
          '</div>'
        },
          { field: 'dueDate', name: 'dueDate' },
          {
          field: 'priority' ,
            sort: {
                priority: 0,
                direction: uiGridConstants.ASC
            }
         },
        { field: 'category' }
        ]
      };
$scope.gridRowClick = function(row) {
console.log(row)
var childController = function ($scope, $uibModalInstance) {
  $scope.taskname = row.entity.name;
  $scope.subtaskname = row.entity.subTask;

          $scope.ok = function () {
              $uibModalInstance.close({ my: 'data' });
          }
          $scope.cancel = function () {
              $uibModalInstance.dismiss();
          }
      }



        $uibModal.open({
          scope: $scope,
          backdrop: 'static',
          controller: childController,
          templateUrl: '../taskDetails.html'
          });



}

        // $scope.sendFeedback = function() {
        //         $scope.feedback.date = new Date().toISOString();
        //         $scope.feedbacks.push($scope.feedback);
        //         getSubTasks.getFeedback().update($scope.feedbacks);
        //         $scope.feedbackForm.$setPristine();
        //         $scope.feedback = {firstName: "",lastName: "",email: "", date:""};
        // };
    }])
