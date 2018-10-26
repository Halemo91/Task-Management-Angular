
var app = angular.module('taskManagerApp', ['taskServices','ngResource','ui.grid', 'ui.grid.edit','ui.grid.grouping', 'ui.bootstrap']);

/*Tasks controller which contains the functions and logic behind viewing the tasks*/
app.controller('taskManagerCtr', ['$scope','tasks','getSubTasks','updateTaskService','updateSubTaskService','getCategories','uiGridConstants','$q', '$injector','$uibModal', function($scope,tasks,getSubTasks,updateTaskService,updateSubTaskService,getCategories,uiGridConstants,$q, $injector,$uibModal) {
'use strict';
$scope.isTaskUpdated = false;
$scope.isSubTaskUpdated = false;

 /*Getting the tasks from services */
  tasks.query(function(data) {
     $scope.tasks = data;
     $scope.tasks.forEach(function(obj) {
       obj.subTask = [];
       obj.category = "";
          getSubTasks.getFeedback(obj.id).query(function(response) {
            response.forEach(function(res) {
                    if(res.taskId == obj.id){
                      obj.subTask.push(res);

                    }
            });
         });
         getCategories.getFeedback().query(function(response) {
           response.forEach(function(res) {
                   if(obj.categoryId && obj.categoryId == res.id){
                     obj.category = res.name;
                   }
                   if(!obj.categoryId){
                     obj.category ="No category";
                   }
           });
           $scope.categories = response;
        });
      });
      console.log($scope.tasks)
     $scope.gridOptions.data = $scope.tasks; // assging tasks to the grid table

 }, function(err) {
     console.error("Error occured: ", err);
 });

/*gridOptions for defining the table content and columns*/
 $scope.gridOptions = {
       enableSorting: true,
       enableFiltering: true,
       infiniteScrollDown: false,
       enableGridMenu: true,
       hideItemCount: false,
       enableExpandableRowHeader: false,
       rowTemplate: '<div  ng-click="grid.appScope.gridRowClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div>',

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
            enableColumnMenu: false,
            cellTemplate:
            '<div > ' +
            "<div ng-click='grid.appScope.gridRowClick(row)' > {{row.entity.dueDate|date: 'MM/dd/yyyy'}} </div>"+
            '</div>'
           },
           {
            field: 'priority' ,
            enableSorting:true,
            enableColumnMenu: false,
            sort: {
                  priority: 1,
                  direction: uiGridConstants.ASC
              },
              cellTemplate:
              '<div > ' +
              "<div ng-click='grid.appScope.gridRowClick(row)' > {{row.entity.priority}} </div>"+
              '</div>'
           },
           {
            field: 'category',
            name: 'Category',
            enableColumnMenu: false,
            grouping: {groupPriority: 0},
            sort: {
                  priority: 0,
                  direction: uiGridConstants.ASC
              }

           }
        ],
      onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      $scope.gridApi.grid.registerDataChangeCallback(function() {
          if($scope.gridApi.grid.treeBase.tree instanceof Array){
              $scope.gridApi.treeBase.expandAllRows();
          }
      });
    }
}; // end of gridOptions

/*this function is called after clicking on the task row to open task and subtask details and updating modal*/
$scope.gridRowClick = function(row) {
console.log(row);
console.log($scope.categories)


var childController = function ($scope, $uibModalInstance) {
  $scope.task = row.entity;
  $scope.taskOriginalCopy = angular.copy(row.entity);

  $scope.subtaskname = row.entity.subTask;
  $scope.options = $scope.categories;
  //TODO change this and date format

  $scope.selectedOption = $scope.options[1];
          $scope.updateTask = function (oneTask) {
              updateTaskService.patchFeedback($scope.task.id).update(oneTask);
              $scope.isTaskUpdated = true;
          }

          $scope.updateSubTask = function (oneTask) {

              if(oneTask.subTask && oneTask.subTask.length > 0){
                    oneTask.subTask.forEach(function(sub) {
                      console.log(sub)
                      updateSubTaskService.patchFeedback(sub.id).update(sub);
                    });
              }
              $scope.isSubTaskUpdated = true;

          }


          $scope.cancel = function () {
    //TODO change this
    // if(!$scope.isTaskUpdated){
    //   row.entity=  $scope.taskOriginalCopy;
    // }
            $uibModalInstance.dismiss();
          }
  }; // end of childController
  if(row.treeLevel != 0){ // disable clicking on parent row
    $uibModal.open({
      scope: $scope,
      backdrop: 'static',
      controller: childController,
      templateUrl: 'taskDetails.html',
      size: 'lg'
      });
    }
};// end of gridRowClick

}])
