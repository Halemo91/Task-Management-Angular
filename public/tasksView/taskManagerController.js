
var app = angular.module('taskManagerApp', ['taskServices','ngResource','ui.grid', 'ui.grid.edit','ui.grid.grouping', 'ui.bootstrap']);

/*Tasks controller which contains the functions and logic behind viewing the tasks*/
app.controller('taskManagerCtr', ['$scope','tasks','getSubTasks','updateTask','uiGridConstants','$q', '$injector','$uibModal', function($scope,tasks,getSubTasks,updateTask,uiGridConstants,$q, $injector,$uibModal) {
    'use strict';

  tasks.query(function(data) {
     $scope.tasks = data;
     $scope.tasksOriginalCopy = angular.copy(data);

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
            {
            field: 'name' ,
            enableColumnMenu: false,

            cellTemplate:
            '<div > ' +
            "<div ng-click='grid.appScope.gridRowClick(row)' > {{row.entity.name}} </div>"+
            '</div>'
           },
           {
            field: 'dueDate',
            name: 'dueDate',
            cellTemplate:
            '<div > ' +
            "<div ng-click='grid.appScope.gridRowClick(row)' > {{row.entity.dueDate|date: 'MM/dd/yyyy'}} </div>"+
            '</div>'
           },
           {
            field: 'priority' ,
          //  grouping: {groupPriority: 0},

            sort: {
                  priority: 0,
                  direction: uiGridConstants.ASC
              },
              cellTemplate:
              '<div > ' +
              "<div ng-click='grid.appScope.gridRowClick(row)' > {{row.entity.priority}} </div>"+
              '</div>'
           },
           {
            field: 'category',

           }
        ]
      };

$scope.gridRowClick = function(row) {
console.log(row)
var childController = function ($scope, $uibModalInstance) {
  $scope.task = row.entity;
  $scope.subtaskname = row.entity.subTask;
  $scope.options = [{ name: "a", id: 1 }, { name: "b", id: 2 }];
  $scope.selectedOption = $scope.options[1];
          $scope.ok = function (t) {
              $uibModalInstance.close();
              updateTask.patchFeedback($scope.task.id).update(t);
           //
          //  updateTask.getFeedback(row.entity.id).query(function(response) {
          //    console.log(response)
          //       //  response.forEach(function(res) {
          //       //          if(res.taskId == obj.id){
          //       //            obj.subTask.push(res);
          //        //
          //       //          }
          //       //  });
          //     });

          }
          $scope.cancel = function () {
            $scope.gridOptions.data =  $scope.tasksOriginalCopy;
            $uibModalInstance.close();
          }
      }
    $uibModal.open({
      scope: $scope,
      backdrop: 'static',
      controller: childController,
      templateUrl: 'taskDetails.html',
    size: 'lg'
      });

}

}])
