angular.module('starter.controllers', ['ionic','ionicSelect','ngCordova','ionic.contrib.ui.tinderCards','ngFitText','ion-google-place'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state,$http,$ionicPopup,$rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
        try {
            $scope.profilerName = $rootScope.currentUser.firstName + $rootScope.currentUser.lastName;
        }catch (e){

        }

        $scope.groups = [];
       /* for (var i=0; i<10; i++) {
            $scope.groups[i] = {
                name: i,
                items: [],
                show: false
            };
            for (var j=0; j<3; j++) {
                $scope.groups[i].items.push(i + '-' + j);
            }
        }*/
        var items =['item1','item1'];
        $scope.groups[0] = {
            name: 'Hire',
            items: [{title:'Post Jobs(s)', href:'/app/postJobTabs'},{title:'Browse Matches', href:'/app/browseMatchesHire'},{title:'Connections', href:'/app/hireConnections'}],
            show: false
        };
      //  $scope.groups[0].items.push('bilal');
        $scope.groups[1] = {
            name: 'Get Hired',
            items: [{title:'Available Now', is_togle: true, toggle_value: true}, {title:'Quick Connect'},{title:'Browse Matches', href:'/app/getHiredJobRoles'},{title:'Connections', href:'/app/getHireConnections'}],
            show: false
        };
        //$scope.groups[0].items.push('bilal');

        /*
         * if given group is the selected group, deselect it
         * else, select the given group
         */
        $scope.toggleGroup = function(group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function(group) {
            return group.show;
        };
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

$scope.logout = function(){
    var server = 'http://104.131.113.163:5000';
    var token = window.localStorage.getItem('token');
    var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure?',
        cssClass: 'custom-popup'
    });
    confirmPopup.then(function(res) {
        if(res) {
            console.log('Sure!');
            $http.get(server+'/users/logout/'+token)
                .success(function(data,status){
                    window.localStorage.removeItem('token');
                    // $state.go('login');
                    $state.go('login');
                })
                .error(function(){
                   // window.localStorage.removeItem('token');
                    /*$ionicPopup.alert({
                        title: 'Logout',
                        template: 'Error',
                        cssClass: 'custom-popup'
                    });*/
                    $state.go('login');
                })

        } else {
            console.log('Not sure!');
        }
    });


}
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('DashboardCtrl', function($scope, $stateParams, $http,$timeout, $ionicSideMenuDelegate, $rootScope,$ionicPopup) {
        console.log('DashboardCtrl',window.localStorage.getItem("username"));

        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        var server = 'http://104.131.113.163:5000';
        $scope.selection = 'hire';
        $scope.hirebtn = 'button-royal';
        $scope.gethirebtn = '';
        $scope.message = 0;
        $scope.swapHireTab = function(value){

            $scope.selection = value;
            if(value == 'hire'){
                $rootScope.from = 'hire';
                $rootScope.for = 'getHired';
                $scope.hirebtn = 'button-royal';
                $scope.gethirebtn = '';
            } else if(value == 'getHired'){
                $rootScope.from = 'getHired';
                $rootScope.for = 'hire';
                $scope.hirebtn = '';
                $scope.gethirebtn = 'button-royal';
            }
            console.log(value, $scope.selection);
            /* counters for hire tab */
            $http.get(server+'/jobPosts/query/count/',{headers: {'Authorization': window.localStorage.getItem('token')} })
                .success(function(data,status){
                    console.log(data);
                    $scope.jobsPosted = data.counts;
                })
            .error(function(data){})
        }

       // var socket = JSON.parse(window.localStorage.getItem("socket"));
        try {
            $rootScope.dashSocket = $rootScope.logSocket;
            console.log('parsed socket: ', $rootScope.logSocket);
            console.log('parsed socket: ', $rootScope.name);
            var socketId = window.localStorage.getItem('socketId');
            $rootScope.dashSocket.emit('login', {senderId: socketId});
            $rootScope.dashSocket.on('notification', function (msg) {
                console.log('notification received: ', msg);
                $scope.message = $scope.message + 1;
            });
        }catch(e){
            console.log('Exception: ',e);
        }
        $scope.$on('$ionicView.enter',function() {
            $scope.fullDashboard = true
            $scope.user = $rootScope.currentUser;
            $rootScope.from = 'hire';
            $rootScope.for = 'getHired';
            console.log('Current User: ',$rootScope.currentUser);
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobPosts/query/count/',{headers: {'Authorization': token } })
                .success(function(data,status){
                    console.log(data);
                    $scope.jobsPosted = data.counts;
                   // ($scope.jobsPosted  > 0 )? $scope.fullDashboard = true : $scope.fullDashboard = false;

                })
                .error(function(data){})

            $http.get(server+'/users/query/browseMatches/count/',{
                headers: {'Authorization': token} })
                .success(function(data,status){
                    console.log(data);
                    $scope.browseMatches = data.counts;

                })
                .error(function(data){})
        }, 500);

        try {
            $rootScope.dashSocket.on('notificationReceived', function (data) {
                $ionicPopup.alert({
                    title: 'Notification',
                    template: data.message,
                    cssClass: 'custom-popup'
                });
            });
        }catch (e){

        }
      //  $http.get(server+'/users/query/browseMatches/count/',{headers :window.localStorage.getItem('headers')
})
.controller('LoginCtrl', function($scope, $stateParams,$ionicPopup, $state,$http,$ionicSideMenuDelegate, $rootScope, $cordovaSpinnerDialog, $cordovaImagePicker) {
        console.log('HI login');
        var server = 'http://104.131.113.163:5000';
        $scope.$on('$ionicView.enter', function(){
           // $cordovaSpinnerDialog.show("title","message", true);
          //  window.plugins.spinnerDialog.show("title","message", true);
            $ionicSideMenuDelegate.canDragContent(false);
        });
        $scope.$on('$ionicView.leave', function(){
            $ionicSideMenuDelegate.canDragContent(true);
        });
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }



        $scope.login = function(login) {

         var socket = io.connect(server);
            $http.get(server+'/users/login/'+login.email+'/'+login.password,{headers:{socketId:socket.io.engine.id}})
                .success(function(data,status) {
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Login failed',
                            template: 'Please check your credentials',
                            cssClass: 'custom-popup'
                        });
                    }else{
                        // $localstorage.set('token',data.data.token);
                        console.log('login data:',data);
                        $rootScope.currentUser= data.data;
                        $rootScope.logSocket = socket;
                        var data = {name:data.data.firstName +' '+data.data.lastName , token : data.token};
                        socket.emit('new user',data);

                        //window.localStorage.setItem("socket", JSON.stringify(JSON.parse(socket)) );
                        window.localStorage.setItem("token", data.token);
                        console.log('after save token:',window.localStorage.getItem('token'));
                        $state.go('app.dashboard');
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Login failed',
                        template: 'No Server',
                        cssClass: 'custom-popup'
                    });
                });

        }
})

.controller('RegisterCtrl', function($scope, $stateParams, $http, $state,$ionicHistory,$ionicPopup,$rootScope) {
        console.log('HI RegisterCtrl');
        var server = 'http://104.131.113.163:5000';

        $scope.register = function(user){
            console.log('user: ',user);
            if(user.password != user.confirmPassword){
                $ionicPopup.alert({
                    title: 'Register failed',
                    template: 'Password Does Not Matched',
                    cssClass: 'custom-popup'
                });
                return;
            }

            $http.post(server+'/users/',{data:user})
                .success(function(data,status,ddd){
                   console.log(JSON.stringify(data));
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Registration Failed',
                            template: 'Already Registred',
                            cssClass: 'custom-popup'
                        });
                    }else {
                        window.localStorage.setItem("token", data.token);
                        $rootScope.currentUser = data.data;
                        $state.go('app.dashboard');
                    }
                })
                .error(function(){
                    $ionicPopup.alert({
                        title: 'Register failed',
                        template: 'Internal Error',
                        cssClass: 'custom-popup'
                    });
                })

        }

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
})
.controller('PostJobCtrl', function($scope, $stateParams,$ionicHistory , $http, $ionicPopup, $state, $ionicSideMenuDelegate, $cordovaImagePicker, $cordovaFileTransfer, $ionicModal ) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.selectedCategories = [];
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.enter', function() {
            console.log('post job ctrl');
            $scope.selectedCategories = [];
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobCategories',{headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobCategories',data);
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Categories Found',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $scope.categories = data.data;
                        $scope.jobRoles = data.data[0].role;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Categories Found',
                        cssClass: 'custom-popup'
                    });
                });
        });
        $scope.changeCategory = function(selectedItem){

            $scope.jobRoles = $scope.categories.filter(function(item,index){
                if(item.category == selectedItem){
                    return item;
                }
            })[0].role;
        }
        //changeCategoryModel
        $scope.changeCategoryModel = function(selectedItem){

            $scope.jobRolesModel = $scope.categories.filter(function(item,index){
                if(item.category == selectedItem){
                    return item;
                }
            })[0].role;
        }
        $scope.removeCategory = function(index){
             $scope.selectedCategories.splice(index,1);
        }
        $scope.contact = {
            name: 'Mittens Cat',
            info: 'Tap anywhere on the card to open the modal'
        }

        $ionicModal.fromTemplateUrl('contact-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal
        })

        $scope.openModal = function() {
            $scope.modal.show()
        }

        $scope.addCategory = function(obj) {
            console.log('closeModel::', obj);
            var cat = {category : obj.category, jobRole: obj.jobRole};
            $scope.selectedCategories.push(cat);
            $scope.modal.hide();
        };
        $scope.closeModal = function() {

            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.uploadImage = function(){
            var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 80
            };

            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                   // for (var i = 0; i < results.length; i++) {

                        console.log('Image URI: ' + results[0]);
                   /* $ionicPopup.alert({
                        title: 'Image Getting Error',
                        template: results[0]
                    });*/
                    var options = new FileUploadOptions();
                    options.fileKey="file";
                    options.fileName="myphoto.jpg";
                    options.mimeType="image/jpeg";
                    $cordovaFileTransfer.upload(server+'/users/upload/', results[0], options)
                        .then(function(result) {
                            // Success
                            $ionicPopup.alert({
                                title: 'success',
                                template: results,
                                cssClass: 'custom-popup'
                            });
                        }, function(err) {
                            // Error
                            $ionicPopup.alert({
                                title: 'error',
                                template: err,
                                cssClass: 'custom-popup'
                            });
                        }, function (progress) {
                            // constant progress updates
                        });

                    //}
                }, function(error) {
                    $ionicPopup.alert({
                        title: 'Image Getting Error',
                        template: error,
                        cssClass: 'custom-popup'
                    });
                });

        }
      //  $scope.proj = {category : ' '};
        //var data = [{id:1,cat:'Accounting'},{id:2,cat:'Engineering'},{id:3,cat:'Executive'},{id:4,cat:'HealthCare'},{id:5,cat:'Information Technology'},{id:6,cat:'Other'}];
      //  $scope.categories = data;
      //  $scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}];

        $scope.postJob = function(jobPost) {

            if(jobPost.union){
                jobPost.union = 'union'
            }else if(jobPost.nonUnion){
                jobPost.union = 'nonUnion'
            }
            else if(jobPost.both){
                jobPost.union = 'both'
            }

            if(!jobPost.location){
                $ionicPopup.alert({
                    title: 'Error',
                    template:  'No Location Specified',
                    cssClass: 'custom-popup'
                });

                return;
            }
            jobPost.lat = jobPost.location.geometry.location.lat();
            jobPost.lng = jobPost.location.geometry.location.lng();
            jobPost.location = jobPost.location.formatted_address;

            var token = window.localStorage.getItem('token');
            $http.post(server+'/jobPosts/',{data:jobPost},{headers: {'Authorization': token } })
                .success(function(data,status) {
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'Wrong data',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $state.go('app.dashboard');
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'JobPost Error',
                        cssClass: 'custom-popup'
                    });
                });
        }

        $scope.addCategories = function(){

            $ionicPopup.prompt({
                title: 'Project Title',
                content: 'Enter your project title',
                inputType: 'text',
                inputPlaceholder: 'Your first project title'
            }
            ).then(function(projectTitle,dddd) {
               // createProject(projectTitle);
                console.log(projectTitle, dddd);
               // break;
            });
            // An elaborate, custom popup
        /*    var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            console.log('save', $scope.wifi);
                            if (!$scope.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.wifi;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                console.log('Tapped', res);
            });*/
        }

        $scope.setWithIn = function(obj, val){


            if(val == 'nonUnion'){
                console.log('union value 122:: ',val);
                obj.union = false;
                obj.both = false;
                obj.union = 'unUnion';
            }
             if(val == 'both'){
                console.log('union value 123:: ',val);
                obj.nonUnion = false;
                obj.union = false;
                obj.union = 'both';
            }
            if(val == 'union'){
                console.log('union value:: ',val);
                obj.union = 'union';
                obj.nonUnion = false;
                obj.both = false;
                //obj.union = true;

            }
        }
}).controller('jobsPostedCtrl', function($scope, $stateParams,$ionicHistory , $http, $ionicPopup, $state, $ionicSideMenuDelegate) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            if (data.enableBack) {
                $scope.$root.showMenuIcon = true;
            } else {
                $scope.$root.showMenuIcon = false;
            }
        });
        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            $http.get(server + '/jobPosts/', {headers: {'Authorization': token }})
                .success(function (data, status) {
                    if (data.status != 200 || data.data.length == 0) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Job Posted',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    } else {
                        $scope.jobsPosted = data.data;
                    }
                    console.log('jobsPosted/', data);

                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Error',
                        cssClass: 'custom-popup'
                    })
                    $ionicHistory.goBack();
                });
        });
       // $scope.proj = {category : ' '};
       // var data = [{id:1,cat:'Accounting'},{id:2,cat:'Engineering'},{id:3,cat:'Executive'},{id:4,cat:'HealthCare'},{id:5,cat:'Information Technology'},{id:6,cat:'Other'}];
       // $scope.categories = data;
       // $scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}];

})
.controller('postJobTabsCtrl', function($scope, $stateParams, $ionicHistory,$ionicSideMenuDelegate) {

        $scope.myGoBack = function() {

            $ionicHistory.goBack();
        };

        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }


        $scope.$on('$ionicView.beforeEnter', function (e, data) {
            if (data.enableBack) {
                $scope.$root.showMenuIcon = true;
            } else {
                $scope.$root.showMenuIcon = false;
            }
        });


})
.controller('browseMatchesHireCtrl', function($scope, $stateParams,$ionicHistory, $ionicSideMenuDelegate, $rootScope) {
        console.log('browseMatchesHireCtrl');

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $rootScope.dashSocket = $rootScope.dashSocket;
        console.log('socket: ',$rootScope.dashSocket);

})
.controller('projectsCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate, $rootScope) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
      //  $rootScope.dashSocket = $rootScope.dashSocket;
       // console.log('socket: ',$rootScope.dashSocket);
        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            $http.get(server + '/jobPosts/', {headers: {'Authorization': token }})
                .success(function (data, status) {
                    if (data.status != 200 || data.data.length == 0) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message) ? data.message : 'Wrong data',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();

                    } else {
                        $scope.projects = data.data;
                    }
                    console.log('jobPosts/', data);

                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Internal Error',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
        });

})
.controller('quickConnectCtrl', function($scope, $stateParams, $ionicHistory, $ionicPopup, $state,$http, $ionicSideMenuDelegate) {
        var server = 'http://104.131.113.163:5000';
        $scope.selectedCategories = [];
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.enter', function() {
            console.log('post job ctrl');
            $scope.selectedCategories = [];
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobCategories',{headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobCategories',data);
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Categories Found',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $scope.categories = data.data;
                        $scope.jobRoles = data.data[0].role;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Categories Found',
                        cssClass: 'custom-popup'
                    });
                });
        });
        $scope.changeCategory = function(selectedItem){

            $scope.jobRoles = $scope.categories.filter(function(item,index){
                if(item.category == selectedItem){
                    return item;
                }
            })[0].role;
        }
       /* $scope.proj = {category : ' '};
        var data = [{id:1,cat:'Accounting'},{id:2,cat:'Engineering'},{id:3,cat:'Executive'},{id:4,cat:'HealthCare'},{id:5,cat:'Information Technology'},{id:6,cat:'Other'}];
        $scope.categories = data;
        $scope.jobRoles = $scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}];
*/
        $scope.onKeyDown = function(){
            $scope.showHideCategory = true;
        }
        $scope.catClick = function (item){
            $scope.proj.category = item.cat;
            $scope.showHideCategory = false;

        }

        /* job role combo  */

       /* $scope.proj = {jobRole : ' '};
        $scope.jobRoles = $scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}];
*/
        $scope.onKeyDown = function(){
            $scope.showHideJobRole = true;
        }
        $scope.jobRoleClick = function (item){
            $scope.proj.jobRole = item.jobRole;
            $scope.showHideJobRole = false;

        }

        $scope.postJob = function(jobPost) {

            if(jobPost.union){
                jobPost.union = 'union'
            }else if(jobPost.nonUnion){
                jobPost.union = 'nonUnion'
            }
            else if(jobPost.both){
                jobPost.union = 'both'
            }
            if(!jobPost.location){
                $ionicPopup.alert({
                    title: 'Error',
                    template:  'No Location Specified',
                    cssClass: 'custom-popup'
                });

                return;
            }
            console.log('location ::',jobPost.location);

            var lat = jobPost.location.geometry.location.lat();
            var lng = jobPost.location.geometry.location.lng();
            jobPost.location = jobPost.location.formatted_address;
            jobPost.lat = lat;
            jobPost.lng = lng;
            jobPost.loc = [];
            jobPost.loc.push(lat);
            jobPost.loc.push(lng);

            var token = window.localStorage.getItem('token');
            console.log('Posting Data: ',jobPost);
            $http.post(server+'/jobPosts/',{data:jobPost},{headers: {'Authorization': token } })
                .success(function(data,status) {
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'Wrong data',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        if(jobPost.quickConnect){
                            $state.go('app.matchesQuickConnect',{lat : jobPost.lat, lng:jobPost.lng,distance : jobPost.withIn, jobRole: jobPost.jobRole });
                        }else
                        $state.go('app.dashboard');
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'JobPost Error',
                        cssClass: 'custom-popup'
                    });
                });
        }

        $scope.setWithIn = function(obj, val){
            if(val == 'union'){
                obj.nonUnion = false;
                obj.both = false;
                obj.union = 'union';
            }
            if(val == 'nonUnion'){
                obj.union = false;
                obj.both = false;
                obj.union = 'unUnion';
            }
            if(val == 'both'){
                obj.nonUnion = false;
                obj.union = false;
                obj.union = 'both';
            }
        }


})

    .controller('ExtrasCtrl', function($scope, $stateParams, $ionicHistory, $ionicPopup, $state,$http, $ionicSideMenuDelegate) {
        var server = 'http://104.131.113.163:5000';
        $scope.selectedCategories = [];
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.enter', function() {
            console.log('post job ctrl');
            $scope.selectedCategories = [];
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobCategories',{headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobCategories',data);
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Categories Found',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $scope.categories = data.data;
                        $scope.jobRoles = data.data[0].role;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Categories Found',
                        cssClass: 'custom-popup'
                    });
                });
        });
        $scope.changeCategory = function(selectedItem){

            $scope.jobRoles = $scope.categories.filter(function(item,index){
                if(item.category == selectedItem){
                    return item;
                }
            })[0].role;
        }

       /* $scope.proj = {category : ' '};
        var data = [{id:1,cat:'Accounting'},{id:2,cat:'Engineering'},{id:3,cat:'Executive'},{id:4,cat:'HealthCare'},{id:5,cat:'Information Technology'},{id:6,cat:'Other'}];
        $scope.categories = data;
        $scope.jobRoles = $scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}];
*/
        $scope.onKeyDown = function(){
            $scope.showHideCategory = true;
        }
        $scope.catClick = function (item){
            $scope.proj.category = item.cat;
            $scope.showHideCategory = false;

        }

        /* job role combo  */

        $scope.proj = {jobRole : ' '};
       // $scope.jobRoles = $scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}];

        $scope.onKeyDown = function(){
            $scope.showHideJobRole = true;
        }
        $scope.jobRoleClick = function (item){
            $scope.proj.jobRole = item.jobRole;
            $scope.showHideJobRole = false;

        }

        $scope.postJob = function(jobPost) {

            if(jobPost.union){
                jobPost.union = 'union'
            }else if(jobPost.nonUnion){
                jobPost.union = 'nonUnion'
            }
            else if(jobPost.both){
                jobPost.union = 'both'
            }
            var token = window.localStorage.getItem('token');
            $http.post(server+'/jobPosts/',{data:jobPost}, {headers: {'Authorization': token } })
                .success(function(data,status) {
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'Wrong data',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $state.go('app.dashboard');
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'JobPost Error',
                        cssClass: 'custom-popup'
                    });
                });
        }

        $scope.setWithIn = function(obj, val){
            if(val == 'union'){
                obj.nonUnion = false;
                obj.both = false;
                $scope.proj.union = 'union';
            }
            if(val == 'nonUnion'){
                obj.union = false;
                obj.both = false;
                $scope.proj.union = 'nonUnion';
            }
            if(val == 'both'){
                obj.nonUnion = false;
                obj.union = false;
                $scope.proj.union = 'both';
            }
        }

        $scope.setGender = function(obj, val){
            if(val == 'male'){
                obj.female = false;
                $scope.proj.gender = 'male';
            }
            if(val == 'female'){
                obj.male = false;
                $scope.proj.gender = 'female';
            }

        }


    })

.controller('jobRolesCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate) {

        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.$on('$ionicView.enter',function() {
            console.log('/jobRoles/');
            var token = window.localStorage.getItem('token');
            $http.get(server + '/jobPosts/', {headers: {'Authorization': token }})
                .success(function (data, status) {
                    if (data.status != 200 || data.data.length == 0) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message) ? data.message : 'No Record',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    } else {
                        $scope.projects = data.data;
                    }
                    console.log('jobPosts/', data);

                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Error',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
        });
        /*$http.get(server+'/jobRoles/',{headers: {'Authorization': token } } )
            .success(function(data,status) {
                if(data.status != 200){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: (data.message)? data.message : 'Wrong data'
                    });

                }else{
                    $scope.jobRoles = data.data; //$scope.jobRoles = [{jobRole:"Network Engineer"},{jobRole:"Web Developer"},{jobRole:"Bussiness Analyst"},{jobRole:"Accountant"},{jobRole:"Salse Person"}]; //data.data;
                }
                console.log(data);

            }).error(function(data) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'JobPost Error'
                });
            });*/

}).controller('matchListsCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate) {

        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.matchesList = [{id:"1",name:"bilal",role:"Nodejs",img:"../img/dashboard-userimg.png"},{id:"2",name:"bilal",role:"Nodejs",img:"../img/dashboard-userimg.png"}]
        /*$http.get(server+'/jobPosts/')
            .success(function(data,status) {
                if(data.status != 200){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: (data.message)? data.message : 'Wrong data'
                    });

                }else{
                    $scope.jobRoles = data.data;
                }
                console.log(data);

            }).error(function(data) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'JobPost Error'
                });
            });*/

}).controller('matchesCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup,$ionicSideMenuDelegate, $rootScope) {
        console.log('matchesCtrl');
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        var uri = '';
        var allProfiles = [];
        $scope.$on('$ionicView.enter', function() {
            $scope.projectName = 'Browse';
            $scope.jobRoles = [];

            $scope.isNext = true;
            $scope.isPrev = false;
            if ($stateParams.project) {
                uri = '/users/profiles/matches/';  //$stateParams.project;
            } else if ($stateParams.role) {
                uri = '/users/profiles/roleMatches/' + $stateParams.role;
            }if($stateParams.lat){
                uri = '/users/profiles/quickConnect/'+$stateParams.lat + '/' +$stateParams.lng +'/' +$stateParams.distance+'/'+$stateParams.jobRole ;
            }
            else {
                uri = '/users/profiles/matches/';
            }

            var token = window.localStorage.getItem('token');
            $http.get(server + uri, {headers: {'Authorization': token } })
                .success(function (data, status) {
                    if (data.status != 200 || data.data.length == 0) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Matches Found',
                            cssClass: 'custom-popup'
                        });
                      //  $ionicHistory.goBack();
                    } else {
                        console.log('profile data: ', data);
                        if (data && data.data.length == 0) {
                            $ionicPopup.alert({
                                title: 'Info',
                                template: 'No Matches Found',
                                cssClass: 'custom-popup'
                            });
                            $scope.isNext = false;
                          //  $ionicHistory.goBack();

                        }
                        allProfiles = data;
                      //  $scope.cards = data.data;
                        for(var i = 0; i < allProfiles.data.length; i++) $scope.addCard(i);

                        $scope.index = 0;
                        $scope.match = data.data[0];
                        $scope.jobRoles = data.data[0].jobRoles;
                        (allProfiles.data.length > 1) ? $scope.isNext = true : $scope.isNext = false;
                    }
                    // console.log(data);

                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Server Internal Error',
                        cssClass: 'custom-popup'
                    });
                   // $ionicHistory.goBack();
                });
        });
        /* Next profile button */
        $scope.nextProfile = function(index){
            console.log('next Profile index: ', index);
            if(index == allProfiles.data.length - 1){ $scope.isNext = false; return;}
            var next = index + 1;
            $scope.index = next;
            $scope.match = allProfiles.data[next];
            $scope.jobRoles = allProfiles.data[next].jobRoles;
            (allProfiles.data.length - 1 != next)? $scope.isNext = true : $scope.isNext = false;
            $scope.isPrev = true;
        }
        /* Previous profile button */
        $scope.prevProfile = function(index){
            console.log('next Profile index: ', index);
            if(index == 0){ $scope.isPrev = false; return;}
            var next = index - 1;
            $scope.index = next;
            $scope.match = allProfiles.data[next];
            $scope.jobRoles = allProfiles.data[next].jobRoles;
            (next == 0)? $scope.isPrev = false : $scope.isPrev = true;
            $scope.isNext = true;

        }
        var cardTypes = [
            { image: 'img/pic2.png', title: 'So much grass #hippster'},
            { image: 'img/pic3.png', title: 'Way too much Sand, right?'},
            { image: 'img/pic4.png', title: 'Beautiful sky from wherever'},
        ];

        $scope.cards = [];

        $scope.addCard = function(i) {
           /* var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));*/

            var newCard = allProfiles.data[i];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }

        //for(var i = 0; i < allProfiles.data.length; i++) $scope.addCard(i);

        $scope.cardSwipedLeft = function(index) {
            console.log('Left swipe');
        }

        $scope.cardSwipedRight = function(index) {
            index > allProfiles.data.length ? index = 0:0;
            console.log('Right swipe::'+index +'',allProfiles.data[index]);
            console.log('for',$rootScope.for );
            try {
                var token = window.localStorage.getItem('token');
                var data = {token: token, receiverId: allProfiles.data[index]._id,jobId: $stateParams.project, message: $scope.message,for:$rootScope.for , from : $rootScope.from};
                $rootScope.dashSocket.emit('notification', data);

                $rootScope.dashSocket.on('notificationReceived', function (data) {

                });
            }catch (e){
                console.log('Exception:',e);
            }
        }

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            console.log('Card removed');
        }
        /* sendConnectNotification() */
        $scope.sendConnectNotification = function(receiver){
           // var socket = io.connect(server); cinematographerCtrl
        console.log('for',$rootScope.for );
            try {
                var token = window.localStorage.getItem('token');
                var data = {token: token, receiverId: receiver,jobId: $stateParams.project, message: $scope.message,for:$rootScope.for , from : $rootScope.from};
                $rootScope.dashSocket.emit('notification', data);
                $ionicPopup.alert({
                    title: 'Notification',
                    template: 'Notification Send',
                    cssClass: 'custom-popup'
                });
                $rootScope.dashSocket.on('notificationReceived', function (data) {

                });
            }catch (e){

            }
        } // sendConnectNotification


    }).controller('matchesProjectCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate) {
        console.log('matchesProjectCtrl');
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        var uri = '';
        $scope.projectName = $stateParams.project
        if($stateParams.project){
            uri = $stateParams.jobRole;
        }
        $scope.$on('$ionicView.enter', function() {
            //$scope.matchesList = [{id:"1",name:"bilal",role:"Nodejs",img:"../img/dashboard-userimg.png"},{id:"2",name:"bilal",role:"Nodejs",img:"../img/dashboard-userimg.png"}]
            $http.get(server + '/users/profiles/roleMatches/' + uri)
                .success(function (data, status) {
                    if (data.status != 200 || data.data.length == 0) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message) ? data.message : 'Wrong data',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    } else {
                        $scope.match = data.data[0];
                        $scope.jobRoles = data.data[0].jobRoles;
                        $scope.matchIndex = 0;
                        $scope.matchLength = data.data.length;
                        console.log($scope.jobRoles);
                    }
                    console.log(data);

                }).error(function (data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Internal Error',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });

        });
    }).controller('profileCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading) {

       // var server = 'http://104.131.113.163:5000';
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.enter', function() {
            // code to run each time view is entered
            console.log('This is $on');
            var token = window.localStorage.getItem('token');
            $http.get(server+'/users/profile/', {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/users/profile/',data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Profile Not Found',
                            template: (data.message)? data.message : 'Nothing',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }else{
                        $scope.person = data.data;
                        $scope.jobRoles = data.data.jobRoles;
                        $scope.person.jobRole = data.data.jobRoles[0];
                        $scope.person.birthDate = new Date(data.data.birthDate);
                        (data.data.category )? $scope.isExistProfile = true : $scope.isExistProfile = false;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Profile Not Found',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
            $http.get(server+'/jobCategories',{headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobCategories',data);
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Categories Found',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $scope.categories = data.data;
                        $scope.jobRoles = data.data[0].role;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Categories Found',
                        cssClass: 'custom-popup'
                    });
                });
        });
       /* $ionicLoading.show({
            template: 'Loading...'
        });*/
      /*  var data = [{id:1,cat:'Accounting'},{id:2,cat:'Engineering'},{id:3,cat:'Executive'},{id:4,cat:'HealthCare'},{id:5,cat:'Information Technology'},{id:6,cat:'Other'}];
        $scope.categories = data;
        roles =  [{role:"Network Engineer"},{role:"Web Developer"},{role:"Bussiness Analyst"},{role:"Accountant"},{role:"Salse Person"}];
        $scope.jobRolesArr = roles;*/
        $scope.setGender = function(obj, val){
            if(val == 'male'){
                obj.female = false;
                $scope.person.gender = 'male';
            }
            if(val == 'female'){
                obj.male = false;
                $scope.person.gender = 'female';
            }

        }
var jobRolesSelected = [];
        $scope.selectedCategories = [];
        $scope.saveChanges = function(user){

            jobRolesSelected.push(user.jobRole);
            user.jobRoles = jobRolesSelected;
            console.log('edit my profile', user);
            console.log('location ::',user.location);

            var lat = user.location.geometry.location.lat();
            var lng = user.location.geometry.location.lng();
            user.location = user.location.formatted_address;
            user.lat = lat;
            user.lng = lng;
            user.loc = [];
            user.loc.push(lat);
            user.loc.push(lng);

            var token = window.localStorage.getItem('token');
            $http.put(server+'/users/'+token,{data:user}, {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/users/',data);
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'Profile Not Updated',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        $ionicPopup.alert({
                            title: 'Profile',
                            template: 'Successfully Updated',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Profile Not Updated',
                        cssClass: 'custom-popup'
                    });
                });


        }

        $scope.changeCategory = function(selectedItem){

            $scope.jobRoles = $scope.categories.filter(function(item,index){
                if(item.category == selectedItem){
                    return item;
                }
            })[0].role;
        }

        $scope.cancelSave = function(){
            $ionicHistory.goBack();
        }

})
.controller('browseJobsCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }//
        // availableJobs
        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobPosts/availableJobs', {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobPosts/availableJobs',data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Job Available',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }else{
                        $scope.availableJobs = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Job Available',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
        });// end of $ionicView,enter

}).controller('browseJobsByRoleCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }//
        // availableJobs by role
        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobPosts/availableJobs/'+$stateParams.jobRole, {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobPosts/availableJobs',data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Job Available',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }else{
                        $scope.availableJobs = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Job Available',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
        });// end of $ionicView,enter

})
.controller('cinematographerCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
var allProfiles = [];
        $scope.$on('$ionicView.enter', function() {
            allProfiles = [];
            var token = window.localStorage.getItem('token');
            $http.get(server+'/jobPosts/'+$stateParams.projectId, {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/jobPosts/'+$stateParams.projectId ,data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Job Available',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }else{
                        //$ionicHistory.goBack();
                        allProfiles = data;
                        for(var i = 0; i < allProfiles.data.length; i++) $scope.addCard(i);
                       // $scope.hire = data.data[0].hire;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Job Available',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
        });// end of $ionicView,enter

       /* var cardTypes = [
            { image: 'img/pic2.png', title: 'So much grass #hippster'},
            { image: 'img/pic3.png', title: 'Way too much Sand, right?'},
            { image: 'img/pic4.png', title: 'Beautiful sky from wherever'},
        ];*/

        $scope.cards = [];

        $scope.addCard = function(i) {
            /* var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
             newCard.id = Math.random();
             $scope.cards.push(angular.extend({}, newCard));*/

            var newCard = allProfiles.data[i];
            newCard.id = Math.random();
            $scope.cards.push(angular.extend({}, newCard));
        }

        //for(var i = 0; i < allProfiles.data.length; i++) $scope.addCard(i);

        $scope.cardSwipedLeft = function(index) {
            console.log('Left swipe');
        }

        $scope.cardSwipedRight = function(index) {
            index > allProfiles.data.length ? index = 0:0;
            console.log('Right swipe');
            console.log('for',$rootScope.for );
            try {
                var token = window.localStorage.getItem('token');
                var data = {token: token, receiverId: allProfiles.data[index].hire._id,
                    jobId: $stateParams.projectId, message: $scope.message,for:$rootScope.for , from : $rootScope.from};

                $rootScope.dashSocket.emit('notification', data);

                $rootScope.dashSocket.on('notificationReceived', function (data) {

                });
            }catch (e){
                console.log('Exception:', e);
            }
        }

        $scope.cardDestroyed = function(index) {
            $scope.cards.splice(index, 1);
            console.log('Card removed');
        }

        /* sendConnectNotification() */
        $scope.sendConnectNotification = function(receiver){
            // var socket = io.connect(server); cinematographerCtrl

            try {
                var token = window.localStorage.getItem('token');
                var data = {token: token, receiverId: receiver,
                    jobId: $stateParams.projectId, message: $scope.message,for:$rootScope.for , from : $rootScope.from};

                //var data = {token: token, receiverId: receiver,projectId: $stateParams.projectId, message: $scope.message,type:'getHired' };
                $rootScope.dashSocket.emit('notification', data);
                $ionicPopup.alert({
                    title: 'Notification',
                    template: 'Notification Send',
                    cssClass: 'custom-popup'
                });
                $rootScope.dashSocket.on('notificationReceived', function (data) {
                    $ionicPopup.alert({
                        title: 'Notification',
                        template: data.message,
                        cssClass: 'custom-popup'
                    });
                });
            }catch (e){
console.log('Exception:', e);
            }
        } // sendConnectNotification

})
.controller('chatMessagesCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.allMessages = [];

        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            console.log('chatMessagesCtrl');
            $scope.user = $rootScope.currentUser;
            //console.log('socket: ',$rootScope.dashSocket);
            $http.get(server+'/users/'+$stateParams.receiverId, {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/users/', data);
                    if(data.status != 200){
                       $ionicPopup.alert({
                         title: 'Error',
                         template: (data.message)? data.message : 'No Messages',
                           cssClass: 'custom-popup'
                         });

                    }else{
                        //$ionicHistory.goBack();
                        $scope.receiver = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Receiver',
                        cssClass: 'custom-popup'
                    });
                });

            $http.get(server+'/messages/', {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/messages', data);
                    if(data.status != 200){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Messages',
                            cssClass: 'custom-popup'
                        });

                    }else{
                        //$ionicHistory.goBack();
                        $scope.allMessages = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Messages',
                        cssClass: 'custom-popup'
                    });
                });



        });// end of $ionicView,enter

      //  $scope.obj = {message:'hello '};
        $scope.sendMessage = function(receiverId){
            console.log($scope.message);
            var token = window.localStorage.getItem('token');
            var data = {token:token,receiverId:receiverId,jobId:$stateParams.projectId, message: $scope.message,for:$rootScope.for , from : $rootScope.from };
            $rootScope.dashSocket.emit('sendMessage',data);
            //$scope.messangerIs = "sender";
            $scope.allMessages.push({message:data.message, senderId : $rootScope.currentUser._id});
            $scope.message = '';
        }
        try {
            $rootScope.dashSocket.on('receiveMessage', function (data) {
                console.log('receiveMessage', data.message);
                //$scope.obj = data;
                $scope.$apply(function(){
                    //$scope.obj = {message:'hmmmmmmmmmmmmmmmmmmm '};
                    //$scope.messangerIs = "receiver";
                    $scope.allMessages.push( {message:data.message, receiverId : $rootScope.currentUser._id} );
                });
                //$scope.obj = {message:'hmmmmmmmmmmmmmmmmmmm '};
                //  ($scope.messagesArr.length > 0)?$scope.messagesArr.push(data): $scope.messagesArr[0] = data;
            });
        }catch(e){
            console.log('chatMessageCtrl:',e);
        }

})
.controller('getHiredJobRolesCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            console.log('getHiredJobRolesCtrl');
            //console.log('socket: ',$rootScope.dashSocket);
           $http.get(server+'/users/jobRoles/', {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/getHiredJobRolesCtrl', data);
                    if(data.status != 200 || data.data.length == 0 || data.data[0].jobRoles.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No JobRoles Available',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }else{
                        //$ionicHistory.goBack();
                        console.log('/user/jobROles: ', data.data[0].jobRoles);
                        $scope.Roles = data.data[0].jobRoles;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No JobRoles Available',
                        cssClass: 'custom-popup'
                    });
                   $ionicHistory.goBack();
                });
        });// end of $ionicView,enter

        $scope.obj = {message:'hello '}
        $scope.sendMessage = function(){
            console.log($scope.message);
            var data = {senderId:$scope.senderId,receiverId:$stateParams.receiverId, message: $scope.message };
            $rootScope.dashSocket.emit('sendMessage',data);
            $scope.message = '';
        }
        try {
          /*  $rootScope.dashSocket.on('receiveMessage', function (data) {
                console.log('receiveMessage', data.message);
                $scope.obj.message = data.message;
                //  ($scope.messagesArr.length > 0)?$scope.messagesArr.push(data): $scope.messagesArr[0] = data;
            });*/
        }catch(e){
            console.log('chatMessageCtrl:',e);
        }

})
 .controller('hireConnectionsCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.swapConnectionTabs = function(value){
            var token = window.localStorage.getItem('token');
            if(value == 'connections'){
                $scope.connectionClass = 'button-royal';
                $scope.activeJobsClass = '';
                $scope.rRatingClass = '';
                $scope.selectConnectionTabs = value;
            }
            else if(value == 'activeJobs'){
                $scope.connectionClass = '';
                $scope.activeJobsClass = 'button-royal';
                $scope.rRatingClass = '';
                $scope.selectConnectionTabs = value;

                $http.get(server+'/jobPosts/hireActiveJobs/', {headers: {'Authorization': token } } )
                    .success(function(data,status) {
                        console.log('/hireConnectionsCtrl', data);
                        if(data.status != 200 || data.data.length == 0){
                            $ionicPopup.alert({
                                title: 'Error',
                                template: (data.message)? data.message : 'No Active Job Available',
                                cssClass: 'custom-popup'
                            });
                            // $ionicHistory.goBack();

                        }else{
                            //$ionicHistory.goBack();
                            /* if(data.data[0].jobId == undefined){
                             $ionicPopup.alert({
                             title: 'Error',
                             template: (data.message)? data.message : 'No Connection Available'
                             });
                             $ionicHistory.goBack();
                             }else*/
                            $scope.activeJobs = data.data;
                        }

                    }).error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Active Job Available',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    });
            }
            else if(value == 'ratings'){
                $scope.selectConnectionTabs = value;
                $scope.connectionClass = '';
                $scope.activeJobsClass = '';
                $scope.rRatingClass = 'button-royal';
            }
        }
        $scope.$on('$ionicView.enter', function() {
           // $ionicConfigProvider.tabs.position('top');
            $scope.connectionClass = 'button-royal';
            var token = window.localStorage.getItem('token');
            console.log('hireConnectionsCtrl');
            $scope.connectionClass = 'button-royal';
            //console.log('socket: ',$rootScope.dashSocket);
           $http.get(server+'/connections/hireConnections/', {headers: {'Authorization': token } } )
                .success(function(data,status) {
                    console.log('/hireConnectionsCtrl', data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Connection Available',
                            cssClass: 'custom-popup'
                        });
                       // $ionicHistory.goBack();

                    }else{
                        //$ionicHistory.goBack();
                       /* if(data.data[0].jobId == undefined){
                            $ionicPopup.alert({
                                title: 'Error',
                                template: (data.message)? data.message : 'No Connection Available'
                            });
                            $ionicHistory.goBack();
                        }else*/
                        $scope.projects = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Connection Available',
                        cssClass: 'custom-popup'
                    });
                   $ionicHistory.goBack();
                });
        });// end of $ionicView,enter

        $scope.sendMessage = function( projectId , receiverId){
           $state.go('app.chatMessages',{receiverId : receiverId, projectId:projectId});

        }

})
 .controller('getHireConnectionsCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.swapConnectionTabs = function(value){
            var token = window.localStorage.getItem('token');
            if(value == 'connections'){
                $scope.connectionClass = 'button-royal';
                $scope.activeJobsClass = '';
                $scope.rRatingClass = '';
                $scope.selectConnectionTabs = value;
            }
            else if(value == 'activeJobs'){
                $scope.connectionClass = '';
                $scope.activeJobsClass = 'button-royal';
                $scope.rRatingClass = '';
                $scope.selectConnectionTabs = value;

                $http.get(server+'/jobPosts/getHiredActiveJobs/', {headers: {'Authorization': token } } )
                    .success(function(data,status) {
                        console.log('/getHiredActiveJobs', data);
                        if(data.status != 200 || data.data.length == 0){
                            $ionicPopup.alert({
                                title: 'Error',
                                template: (data.message)? data.message : 'No Active Job Available',
                                cssClass: 'custom-popup'
                            });
                            // $ionicHistory.goBack();

                        }else{
                            //$ionicHistory.goBack();
                            /* if(data.data[0].jobId == undefined){
                             $ionicPopup.alert({
                             title: 'Error',
                             template: (data.message)? data.message : 'No Connection Available'
                             });
                             $ionicHistory.goBack();
                             }else*/
                            $scope.activeJobs = data.data;
                        }

                    }).error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Active Job Available',
                            cssClass: 'custom-popup'
                        });
                       // $ionicHistory.goBack();
                    });
            }
            else if(value == 'ratings'){
                $scope.selectConnectionTabs = value;
                $scope.connectionClass = '';
                $scope.activeJobsClass = '';
                $scope.rRatingClass = 'button-royal';
            }
        }
        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
           // if($scope.activeJobsClass == '' && $scope.rRatingClass == '' ){
                $scope.connectionClass = 'button-royal';
           // }

            console.log('getHireConnectionsCtrl');
           $http.get(server+'/connections/getHireConnections', {headers: {'Authorization': token } } )
                .success(function(data,status) {
                    console.log('/getHireConnectionsCtrl', data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Connection Available',
                            cssClass: 'custom-popup'
                        });
                       // $ionicHistory.goBack();
                    }else{
                        //$ionicHistory.goBack();
                     //   $scope.projDisp = data.data[0].jobId;
                        $scope.projects = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Connection Available',
                        cssClass: 'custom-popup'
                    });
                   $ionicHistory.goBack();
                });
        });// end of $ionicView,enter


        $scope.sendMessage = function( projectId , receiverId){

            $state.go('app.chatMessages',{receiverId : receiverId, projectId:projectId});

        }


        $scope.AcceptOffer = function(projectId,connectionId, proj){
            var token = window.localStorage.getItem('token');
            var data = {projectId : projectId, connectionId : connectionId};
            $http.post(server+'/connections/getHiredAcceptOffer',data, {headers: {'Authorization': token } } )
                .success(function(data,status) {
                    console.log('/getHireConnectionsCtrl', data);
                    if(data.status != 200 ){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Contract Can not start',
                            cssClass: 'custom-popup'
                        });
                       // $ionicHistory.goBack();
                    }else{
                        //$ionicHistory.goBack();
                        //   $scope.projDisp = data.data[0].jobId;
                       // $scope.projects = data.data;
                        proj.isPending = false;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Contract Can not start',
                        cssClass: 'custom-popup'
                    });

                });
        }

}) .controller('hireConnectionsProjectCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }

        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            console.log('hireConnectionsProjectCtrl');
           $http.get(server+'/connections/hireConnections/byProjects/'+$stateParams.projectId, {headers: {'Authorization': token } } )
                .success(function(data,status) {
                    console.log('/hireConnectionsProjectCtrl', data);
                    if(data.status != 200 || data.data.length == 0){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: (data.message)? data.message : 'No Connection Available',
                            cssClass: 'custom-popup'
                        });
                        $ionicHistory.goBack();
                    }else{
                        //$ionicHistory.goBack();
                        $scope.projDisp = data.data[0].jobId;
                        $scope.projects = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Connection Available',
                        cssClass: 'custom-popup'
                    });
                   $ionicHistory.goBack();
                });
        });// end of $ionicView,enter


        $scope.sendMessage = function( projectId , receiverId){

            $state.go('app.chatMessages',{receiverId : receiverId, projectId:projectId});

        }
        try {
           /* $rootScope.dashSocket.on('receiveMessage', function (data) {
                console.log('receiveMessage', data.message);
               // $scope.obj.message = data.message;
                //  ($scope.messagesArr.length > 0)?$scope.messagesArr.push(data): $scope.messagesArr[0] = data;
            });*/
        }catch(e){
            console.log('hireConnectionsCtrl:',e);
        }

        $scope.hireUser = function(projectId,connectionId,getHiredId,proj){
            var token = window.localStorage.getItem('token');
            var data = {projectId : projectId, connectionId : connectionId, getHiredId : getHiredId };
            $http.post(server+'/connections/hireUser', data, {headers: {'Authorization': token } } )
                .success(function(data,status) {
                    console.log('/hireConnectionsProjectCtrl', data);
                    if(data.status != 200 ){
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Cant Hire User',
                            cssClass: 'custom-popup'
                        });
                       // $ionicHistory.goBack();
                    }else{
                        proj.isPending = false;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Cant Hire User',
                        cssClass: 'custom-popup'
                    });
                    $ionicHistory.goBack();
                });
        }

})

    .controller('hireUserMessagesCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.swapMessages = function(value){
            var token = window.localStorage.getItem('token');
            if(value == 'hire'){
                $scope.selectionType = value;

                $scope.messageClassHire = 'button-royal';
                $scope.messageClassGetHired = '';
                $http.get(server+'/messages/hireConnections/', {headers: {'Authorization': token } })
                    .success(function(data,status) {
                        console.log('/messages', data);
                        if(data.status != 200){
                            /*$ionicPopup.alert({
                             title: 'Error',
                             template: (data.message)? data.message : 'No Messages'
                             });*/

                        }else{
                            //$ionicHistory.goBack();
                            $scope.messangers = data.data;
                        }

                    }).error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Messages',
                            cssClass: 'custom-popup'
                        });
                    });
            }else if(value == 'getHired'){
                $scope.selectionType = value;
                $scope.messageClassHire = '';
                $scope.messageClassGetHired = 'button-royal';
                $http.get(server+'/messages/getHiredConnections/', {headers: {'Authorization': token } })
                    .success(function(data,status) {
                        console.log('/messages', data);
                        if(data.status != 200){
                            /*$ionicPopup.alert({
                             title: 'Error',
                             template: (data.message)? data.message : 'No Messages'
                             });*/

                        }else{
                            //$ionicHistory.goBack();
                            $scope.messangers = data.data;
                        }

                    }).error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No Messages',
                            cssClass: 'custom-popup'
                        });
                    });
            }
        }
        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            $scope.selectionType = 'hire';
            console.log('hireUserMessagesCtrl');
            $scope.messageClassHire = 'button-royal';
            $scope.messageClassGetHired = '';
            $http.get(server+'/messages/hireConnections/', {headers: {'Authorization': token } })
                .success(function(data,status) {
                    console.log('/messages', data);
                    if(data.status != 200){
                        /*$ionicPopup.alert({
                         title: 'Error',
                         template: (data.message)? data.message : 'No Messages'
                         });*/

                    }else{
                        //$ionicHistory.goBack();
                        $scope.messangers = data.data;
                    }

                }).error(function(data) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No Messages',
                        cssClass: 'custom-popup'
                    });
                });
        });// end of $ionicView,enter


        $scope.sendMessage = function( projectId , receiverId){

            $state.go('app.chatMessages',{receiverId : receiverId, projectId:projectId});

        }
        try {
            /* $rootScope.dashSocket.on('receiveMessage', function (data) {
             console.log('receiveMessage', data.message);
             // $scope.obj.message = data.message;
             //  ($scope.messagesArr.length > 0)?$scope.messagesArr.push(data): $scope.messagesArr[0] = data;
             });*/
        }catch(e){
            console.log('hireConnectionsCtrl:',e);
        }


    }).controller('settingsCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
        var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.settings_save = function(obj){
            var token = window.localStorage.getItem('token');
            console.log('/users/changePassword', JSON.stringify(obj));
            if(!obj){
                $ionicPopup.alert({
                    title: 'Info',
                    template: 'Nothing To Change',
                    cssClass: 'custom-popup'
                });
                return;
            }
           if(obj.NewPassword == undefined || obj.NewPassword != obj.ConfirmPassword){
               $ionicPopup.alert({
                   title: 'Error',
                   template: 'Password Not Matched',
                   cssClass: 'custom-popup'
               });
               return;
           }
                $http.post(server+'/users/changePassword/'+token, {data: obj })
                    .success(function(data,status) {
                        console.log('/users/changePassword', data);
                        if(data.status != 200){
                            $ionicPopup.alert({
                             title: 'Error',
                             template:  'Setting Not saved',
                                cssClass: 'custom-popup'
                             });

                        }

                    }).error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Setting Not saved',
                            cssClass: 'custom-popup'
                        });
                    });
            } // settings_save ()

        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            console.log('settingsCtrl');


        });// end of $ionicView,enter



    }).controller('forGotPasswordCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
        var server = 'http://104.131.113.163:5000';
       /* $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }*/
        $scope.changePassword = function(obj){
            var token = window.localStorage.getItem('token');
            console.log('/users/forGotPassword', JSON.stringify(obj));

           if(obj.NewPassword == undefined || obj.NewPassword != obj.ConfirmPassword){
               $ionicPopup.alert({
                   title: 'Error',
                   template: 'Password Not Matched',
                   cssClass: 'custom-popup'
               });
               return;
           }
                $http.post(server+'/users/forGotPassword/'+token, {data: obj })
                    .success(function(data,status) {
                        console.log('/users/changePassword', data);
                        if(data.status != 200){
                            $ionicPopup.alert({
                             title: 'Error',
                             template:  'Invalid Email',
                                cssClass: 'custom-popup'
                             });

                        }else{
                            $ionicPopup.alert({
                                title: 'Info',
                                template:  'Password Changed',
                                cssClass: 'custom-popup'
                            });
                            $ionicHistory.goBack();
                        }

                    }).error(function(data) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'Invalid Email',
                            cssClass: 'custom-popup'
                        });
                    });
            } // settings_save ()

        $scope.$on('$ionicView.enter', function() {
            var token = window.localStorage.getItem('token');
            console.log('settingsCtrl');


        });// end of $ionicView,enter



    })
.controller('SubscriptionCtrl', function($scope, $stateParams, $ionicHistory, $http, $ionicPopup, $ionicSideMenuDelegate,$ionicLoading,$rootScope, $state) {
    var server = 'http://104.131.113.163:5000';
        $scope.myGoBack = function() {

            $scope.packageShow = true;
            $scope.amount = 0;
            $ionicHistory.goBack();
        };
        $scope.selectedCategories = [];
        $scope.toggleSideMenu = function(){
            $ionicSideMenuDelegate.toggleLeft();
        }
        $scope.$on('$ionicView.enter', function() {
            $scope.packageShow = true;
            $scope.amount = 0;
            console.log('subscription');
        });
    $scope.saveCustomer = function(status, response) {
        console.log('subscription',status)
        console.log('response',response)
        if(status == 200){
            var token = window.localStorage.getItem('token');
            response.amount = $scope.amount
            $http.post(server+'/stripe',{ data:response } ,{headers: {'Authorization': token }})
            .success(function(data,status) {
                if(!data.success){
                    $ionicPopup.alert({
                        title: 'Error',
                        template: data.message,
                        cssClass: 'custom-popup'
                    });
                }else{
                    var msgg = 'You have Successfully subscription '+$scope.amount +' package';
                    var alertPopup = $ionicPopup.alert({
                        title: 'Congratulations',
                        template:msgg,
                        cssClass: 'custom-popup'
                    });

                    alertPopup.then(function(res) {
                        console.log('after popup');
                        $state.go('app.dashboard');
                    });
                }
            }).error(function(data) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Error making subscription',
                    cssClass: 'custom-popup'
                });
            });
        }else{
            $ionicPopup.alert({
                title: 'Error!',
                template:response.error.message,
                cssClass: 'custom-popup'
            });
        }
    }


    $scope.subscribe =function(param){

        $scope.amount = param;
        $scope.packageShow = false;
        console.log('param')
    }
})
