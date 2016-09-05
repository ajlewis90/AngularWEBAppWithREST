/*
    Define an angular module for the Appointment booking app
    This is used globally across the entire web app
*/
var appointmentBookingApp = angular.module('appointmentBookingApp', []);

/*Define Routing for app
1. Uri /ViewAllAppointments -> template view_appointments.html and uses allAppointmentsController
2. Uri /ShowOrders -> template view_appointments.html and uses appointmentDetailsController
3. Uri /ViewUsers -> template view_users.html and uses allUsersController
4. Uri /EditAppointment -> template edit_appointment.html and uses editAppointmentController
5. Uri /AddAppointment -> template add_note.html and uses addNoteController
*/

appointmentBookingApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/ViewAllAppointments', {
	templateUrl: 'templates/view_appointments.html',
	controller: 'allAppointmentsController'
      }).
      when('/ShowOrder/:appointmentId', {
	templateUrl: 'templates/view_appointment_details.html',
	controller: 'appointmentDetailsController'
      }).
      when('/ViewUsers', {
	templateUrl: 'templates/view_users.html',
	controller: 'allUsersController'
      }).
      when('/EditAppointment/:appointmentId', {
	templateUrl: 'templates/edit_appointment.html',
	controller: 'editAppointmentController'
      }).
      when('/AddNote/:appointmentId', {
	templateUrl: 'templates/add_note.html',
	controller: 'addNoteController'
      }).
      when('/AddAppointment', {
    templateUrl: 'templates/add_appointments.html',
	controller: 'addAppointmentController'
      }).
      otherwise({
	redirectTo: '/ViewAllAppointments'
      });
}]);

//Retrieves all appointments from the web API
appointmentBookingApp.controller('allAppointmentsController', function($scope, $http, $window) {
    $http.get("http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com")
			.success(function (response) {
				$scope.allAppointments = response;
				
		});
	
    $scope.returnedAppointment = '';
    
    $scope.changeCompleted = function(appointmentId, appointment){
        $scope.blah = "foo";
        $http.get('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+ appointmentId)
			.success(function (response) {               
				$scope.returnedAppointment = response;
				console.log($scope.returnedAppointment);
		});
        appointment.addedNote = !appointment.addedNote;
    }
        
    $scope.addNote = function (note) {
    
    console.log($scope.returnedAppointment);    
    $scope.returnedAppointment.Notes.push(note);
    
    
    var data = {
        Id: $scope.returnedAppointment.Id,
        Description: $scope.returnedAppointment.Description,
        Start: $scope.returnedAppointment.Start,
        End: $scope.returnedAppointment.End,
		Party: $scope.returnedAppointment.Party,
		Notes: $scope.returnedAppointment.Notes,
		ProviderEMail: $scope.returnedAppointment.ProviderEmail
    };
	//console.log(data);
    //console.log(JSON.stringify(data));
    
    $http.post('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+$scope.returnedAppointment.Id,JSON.stringify(data)).then(function (response) {
    if (response.data){
        alert("Note added Successfully!");         
        $window.location.href = 'index.html';
        }
    }, function (response) {
        $scope.msg = "Service not Exists";

        });
       
    };
    
});	

//Retrieves all details of a specified appointment Id
appointmentBookingApp.controller('appointmentDetailsController', function($scope, $http, $routeParams) {

	$scope.appointmentId = $routeParams.appointmentId;
	
	$http.get('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+$routeParams.appointmentId)
			.success(function (response) {
                           
				$scope.returnedAppointment = response;                                 
				
		});

});

//Retrieves all users from the web API
appointmentBookingApp.controller('allUsersController', function($scope, $http) {
	
	$http.get('http://devtechtest.previewourapp.com/api/user?providerEmail=ajlewis90@live.com')
			.success(function (response) {
				$scope.searchUsers = response;
				
		});

});

//Edits the details of a selected appointment
appointmentBookingApp.controller('editAppointmentController', function($scope, $http, $routeParams) {
    
    $scope.appointmentId = $routeParams.appointmentId;
    
	$http.get('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+$routeParams.appointmentId)
			.success(function (response) {
				$scope.returnedAppointment = response;
                                
		});
        
    $scope.putdata = function (description,start,end,notes,party) {
	      
    var data = {
        Id: $scope.appointmentId,
        Description: description,
        Start: start,
        End: end,
		Party: party,
		Notes: notes,
		ProviderEMail: $scope.returnedAppointment.ProviderEmail
    };
	//console.log(data);
    console.log(JSON.stringify(data));

    $http.put('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+$routeParams.appointmentId,JSON.stringify(data)).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
    }, function (response) {
        $scope.msg = "Service not Exists";
        });
    };
});

//Add a new appointment -NEEDS FIXING
appointmentBookingApp.controller('addAppointmentController', function($scope, $http) {
    
    $scope.addAppointment = function (appointmentId,providerEmail,description,start,end,notes,party) {
	
    var notesArray = [];
    notesArray.push(notes);
    
    var partyArray = [];
    partyArray.push(party);

    var data = {
        Id: appointmentId,
        Description: description,
        Start: start,
        End: end,
		Party: partyArray,
		Notes: notesArray,
		ProviderEMail: providerEmail
    };
	console.log(data);
    console.log(JSON.stringify(data));

    $http.post('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com', 
        JSON.stringify(data)).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
    }, function (response) {
        $scope.msg = "Service not Exists";
        });
    };
});

//Add note
appointmentBookingApp.controller('addNoteController', function($scope, $http, $routeParams) {

	$scope.appointmentId = $routeParams.appointmentId;

	$http.get('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+$routeParams.appointmentId)
			.success(function (response) {
				$scope.returnedAppointment = response;
           
		});
    
    $scope.addNote = function (note) {
	
    $scope.returnedAppointment.Notes.push(note);
 
    var data = {
        Id: $scope.appointmentId,
        Description: $scope.returnedAppointment.Description,
        Start: $scope.returnedAppointment.Start,
        End: $scope.returnedAppointment.End,
		Party: $scope.returnedAppointment.Party,
		Notes: $scope.returnedAppointment.Notes,
		ProviderEMail: $scope.returnedAppointment.ProviderEmail
    };
	//console.log(data);
    //console.log(JSON.stringify(data));
    
    $http.post('http://devtechtest.previewourapp.com/api/Appointment?providerEmail=ajlewis90@live.com&Id='+$routeParams.appointmentId,JSON.stringify(data)).then(function (response) {
    if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
    
    }, function (response) {
        $scope.msg = "Service not Exists";

        });
    };
});