
var app = angular.module('taskManagerApp', ['taskServices','ngResource','ui.grid','ui.grid.grouping', 'ui.bootstrap']);

/*Tasks controller which contains the functions and logic behind viewing the tasks*/
app.controller('taskManagerCtr', ['$scope','tasks','getSubTasks','updateTaskService','updateSubTaskService','getCategories','uiGridConstants','$uibModal', function($scope,tasks,getSubTasks,updateTaskService,updateSubTaskService,getCategories,uiGridConstants,$uibModal) {
'use strict';
$scope.isTaskUpdated = false;
$scope.isSubTaskUpdated = false;

 /*Getting the tasks from services  */
 var init = function() {
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
     $scope.gridOptions.data = $scope.tasks; // assging tasks to the grid table

 }, function(err) {
     console.error("Error occured: ", err);
 });
};
init();
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
            enableColumnMenu: false
           },
           {
           field: 'description' ,
           enableColumnMenu: false
          },
           {
            field: 'dueDate',
            enableColumnMenu: false,
            cellTemplate:
            '<div > ' +
            "{{row.entity.dueDate|date: 'MM/dd/yyyy'}}"+
            '</div>'
           },
           {
            field: 'priority' ,
            enableSorting:true,
            enableColumnMenu: false,
            sort: {
                  priority: 1,
                  direction: uiGridConstants.ASC
              }
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

  var childController = function ($scope, $uibModalInstance) {
      $scope.task = row.entity;//single row task
      $scope.subtaskname = row.entity.subTask;
      if($scope.task.dueDate){
        $scope.task.dueDate = new Date($scope.task.dueDate);
        $scope.task.dueDate.toString("MM DD YYYY");
      }
      for (var i = 0; i < $scope.categories.length; i++) {
        if($scope.task.categoryId && $scope.task.categoryId == $scope.categories[i].id ){
          $scope.selectedCategory = ($scope.categories[i].id).toString();
        }
      }
      $scope.priorities = [ {label : "high"}, {label : "medium"}, {label : "low"}];
      $scope.selectedPriority = $scope.task.priority;

    //update the task by calling the updateTaskService
    $scope.updateTask = function (oneTask) {
        oneTask.categoryId = parseInt($scope.selectedCategory);
        oneTask.priority = $scope.selectedPriority;
        updateTaskService.patchFeedback($scope.task.id).update(oneTask);
        $scope.isTaskUpdated = true;
        init();
    };
    //update the subtask by calling the updateSubTask
    $scope.updateSubTask = function (oneTask) {
        if(oneTask.subTask && oneTask.subTask.length > 0){
              oneTask.subTask.forEach(function(sub) {
                updateSubTaskService.patchFeedback(sub.id).update(sub);
              });
        }
        $scope.isSubTaskUpdated = true;
        init();
    };
    //closing the task details model
    $scope.cancel = function () {
      $scope.modal_instance.close();
      if( !($scope.isTaskUpdated || $scope.isTaskUpdated) )  init();
    }
  }; // end of childController
  if(row.treeLevel != 0){ // if not parent row then be able to click and open the modal
    $scope.modal_instance = $uibModal.open({
      scope: $scope,
      backdrop: 'static',
      keyboard: false,
      controller: childController,
      templateUrl: 'taskDetails.html',
      size: 'lg'
      });
    }
};// end of gridRowClick

}]) // end of taskManagerCtr
