// JavaScript Document
var app = angular.module('personalBlog',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider
			.when("/", 
			{ 
				 	controller: "displayController", 
					templateUrl: 'com/views/displayDetails.html' 
			 })
			 .otherwise({ redirectTo:"/"});
});



app.controller("displayController", function($scope, $modal, $filter, userDetailServices, deleteServices, editServices){
	$scope.headerName = "Employee Details";
	$scope.userDetails = "";
	$scope.itemsPerPage = 5;
	
	userDetailServices.getUser($scope);
	
	$scope.$on('loadDetails',function(event, data){
		$scope.userDetails = data[0].data;
		$scope.totalItems =  $scope.userDetails.length;
		$scope.userDetailsPage = $scope.userDetails.slice(0, $scope.itemsPerPage);
		$scope.currentPage = 1;
	});
	
	$scope.$on('reloadDetails', function(event){
		userDetailServices.getUser($scope);
		$scope.currentPage = 1;
	});
	
	$scope.pageChanged = function(currentPage){
		var start = (currentPage-1) * $scope.itemsPerPage;
		var end = start + $scope.itemsPerPage;
		$scope.userDetailsPage = $scope.userDetails.slice(start,end);
	};
	
	$scope.editUserItem = function(id){
	var selectedDetails = $filter('getById')($scope.userDetails, id);
	var editInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: popupControllerIns,
	  resolve: {
        headerName: function () {
          	return "Edit User Details";
			},
		selectedDetails:function(){
			return selectedDetails;
			}		 
		  }
	});

    editInstance.result.then(function (userItems) {
		  editServices.editUser(userItems, $scope);
		});
	};
	
	
	$scope.deleteUserItem = function(id){
		if (confirm('Are you sure you want to delete?')) {
    		deleteServices.deleteUser({'id':id},$scope);
		} 
	};
	
});


app.controller("popupController",function ($scope, $modal, userAddServices) {

  $scope.openWindow = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: popupControllerIns,
	  resolve: {
        headerName: function () {
          return "Add User Details";
			},
		  selectedDetails: function(){
		  	return "";
		  }
		  }
	});

    modalInstance.result.then(function (userItems) {
		  userAddServices.addUser(userItems, $scope);
		});
   };
  
});



var popupControllerIns = function ($scope, $modalInstance, headerName, selectedDetails) {
  $scope.headerName = headerName;
  $scope.user = {};
  $scope.data = {};
  $scope.data.isMismatch = false;
  $scope.data.confirmPassword ="";
  $scope.user.user_password = "";
  $scope.user.user_type = 1;
  var insertDate = new Date();
  
  if(selectedDetails != ""){
	  $scope.user.user_name = selectedDetails.user_name;
	  $scope.user.user_password = selectedDetails.user_password;
	  $scope.data.confirmPassword = selectedDetails.user_password;
	  $scope.user.user_type = selectedDetails.user_type;
	  $scope.user.id = selectedDetails.id;
	  $scope.user.modified_date = insertDate.toJSON();
  }else{   
	   $scope.user.insert_date = insertDate.toJSON();
  }
  
 
  $scope.evaluate = function(){
  	var status = this.validation();
	$scope.data.isMismatch = status
	console.log(status);
  }

  $scope.saveChanges = function () {
	 if($scope.user.user_password == "" || $scope.data.confirmPassword == "" ||		
	     $scope.user.user_name == ""){
		 $scope.data.errorMsg ="Fields cannot be empty"
		 $scope.data.isMismatch = true;
	 	return false;
	 }else{
		
		$modalInstance.close($scope.user);
	 }
  };

  $scope.validation = function(){
	  if($scope.data.confirmPassword == "" || $scope.user.user_password == ""){
	  		return false;
	  }else if($scope.user.user_password != $scope.data.confirmPassword){
		  $scope.data.errorMsg ="Password is not matching"
	 	  return true;
	 }
	 return false;
  }
	
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};


app.factory('userSharedInformation',function($rootscope){
	var sharedInformation = [];
	return sharedInformation;
});


app.factory("userDetailServices", function($http){
	return{
		getUser:function(scope){
			var getUserDetails= $http.get("php/api/getUsers.php?method=getAllUsers&jsoncallback=");
			getUserDetails.then(function(data){
				scope.$emit('loadDetails', [data]);
				console.log(data.data);
			});
		}
	}
});



app.factory("userAddServices", function($http){
	return{
		addUser:function(users, scope){
			var addDetails= $http.post("php/api/getUsers.php?method=InsertValues&jsoncallback=", users);
			addDetails.then(function(data){				
				if(data.data == "1"){
					scope.$emit('reloadDetails'); 
				}
			});
			}
		}
});

app.factory("deleteServices", function($http){
	return{
		deleteUser:function(idValue, scope){
			var deleteUser= $http.post("php/api/getUsers.php?method=deleteUsers&jsoncallback=", idValue);
			deleteUser.then(function(data){				
				if(data.data == "1"){
					scope.$emit('reloadDetails'); 
				}
			});
			}
		}
});

app.factory("editServices", function($http){
	return{
		editUser:function(users, scope){
			var editUser= $http.post("php/api/getUsers.php?method=editUsers&jsoncallback=", users);
			editUser.then(function(data){				
				if(data.data == "1"){
					scope.$emit('reloadDetails'); 
				}
			});
			}
		}
});


app.filter('getById', function() {
  return function(userDetails, id) {
	     var returnDetails = [];
			for(var i=0; i<userDetails.length; i++) {
				if (userDetails[i].id == +id) {
					return userDetails[i];
				}
		}
        //console.log(polarity);
    };
    return returnDetails;
});