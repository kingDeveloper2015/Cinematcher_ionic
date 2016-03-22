// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngFitText', 'stripe'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
   Stripe.setPublishableKey('pk_test_Dsnn6CEil4vHcOTXHA2BEq0T');
  $stateProvider

   /* .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })*/
   .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
      .state('app.dashboard', {
          url: '/dashboard',
          views: {
              'menuContent': {
                  templateUrl: 'templates/dashboard.html',
                  controller: 'DashboardCtrl'
              }
          }
      })
      .state('app.postJob', {
          url: '/postJob',
          views: {
              'menuContent': {
                  templateUrl: 'templates/postjob.html',
                  controller: 'PostJobCtrl'
              }
          }

      })
      .state('app.jobsPosted', {
          url: '/jobsPosted',
          views: {
              'menuContent': {
                  templateUrl: 'templates/jobsPosted.html',
                  controller: 'jobsPostedCtrl'
              }
          }

      })
      .state('app.quickConnect', {
          url: '/quickConnect',
          views: {
              'menuContent': {
                  templateUrl: 'templates/quickconnect.html',
                  controller: 'quickConnectCtrl'
              }
          }

      }).state('app.extras', {
          url: '/extras',
          views: {
              'menuContent': {
                  templateUrl: 'templates/extras.html',
                  controller: 'ExtrasCtrl'
              }
          }

      })
      .state('app.postJobTabs', {
          url: '/postJobTabs',
          views: {
              'menuContent': {
                  templateUrl: 'templates/jobposttabs.html',
                  controller: 'postJobTabsCtrl'
              }
          }

      })
      .state('app.browseMatchesHire', {
          url: '/browseMatchesHire',
          views: {
              'menuContent': {
                  templateUrl: 'templates/browsematcheshired.html',
                  controller: 'browseMatchesHireCtrl'
              }
          }

      })
      .state('app.projects', {
          url: '/projects',
          views: {
              'menuContent': {
                  templateUrl: 'templates/projects.html',
                  controller: 'projectsCtrl'
              }
          }

      }).state('app.jobRoles', {
          url: '/jobRoles',
          views: {
              'menuContent': {
                  templateUrl: 'templates/roles.html',
                  controller: 'jobRolesCtrl'
              }
          }

      }).state('app.jobRolesMatches', {
          url: '/jobRoles/:role',
          views: {
              'menuContent': {
                  templateUrl: 'templates/matches.html',
                  controller: 'matchesCtrl'
              }
          }

      }).state('app.matchLists', {
          url: '/matchLists',
          views: {
              'menuContent': {
                  templateUrl: 'templates/matchesList.html',
                  controller: 'matchListsCtrl'
              }
          }

      }).state('app.matches', {
          url: '/matches',
          views: {
              'menuContent': {
                  templateUrl: 'templates/matches.html',
                  controller: 'matchesCtrl'
              }
          }

      }).state('app.matchesProject', {
          url: '/matchesProject/:project/:jobRole',
          views: {
              'menuContent': {
                  templateUrl: 'templates/matches.html',
                  //controller: 'matchesProjectCtrl'
                  controller: 'matchesCtrl'
              }
          }

      }).state('app.matchesQuickConnect', {
          url: '/matches/:lat/:lng/:distance/:jobRole',
          views: {
              'menuContent': {
                  templateUrl: 'templates/matches.html',
                  //controller: 'matchesProjectCtrl'
                  controller: 'matchesCtrl'
              }
          }

      })
      .state('app.profile', {
          url: '/profile',
          views: {
              'menuContent': {
                  templateUrl: 'templates/profile.html',
                  controller: 'profileCtrl'
              }
          }

      }).state('app.editProfile', {
          url: '/editProfile',
          views: {
              'menuContent': {
                  templateUrl: 'templates/editProfile.html',
                  controller: 'profileCtrl'
              }
          }

      }).state('app.browseJobs', {
          url: '/browseJobs',
          views: {
              'menuContent': {
                  templateUrl: 'templates/jobs.html',
                  controller: 'browseJobsCtrl'
              }
          }

      }).state('app.browseJobsByRole', {
          url: '/browseJobsByRole/:jobRole',
          views: {
              'menuContent': {
                  templateUrl: 'templates/jobs.html',
                  controller: 'browseJobsByRoleCtrl'
              }
          }

      }).state('app.cinematographer', {
          url: '/cinematographer/:projectId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/cinematographer.html',
                  controller: 'cinematographerCtrl'
              }
          }

      }).state('app.chatMessages', {
          url: '/chatMessages/:receiverId/:projectId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/chat_message.html',
                  controller: 'chatMessagesCtrl'
              }
          }

      }).state('app.getHiredJobRoles', {
          url: '/getHiredJobRoles',
          views: {
              'menuContent': {
                  templateUrl: 'templates/gitHiredJobRoles.html',
                  controller: 'getHiredJobRolesCtrl'
              }
          }

      }).state('app.hireConnections', {
          url: '/hireConnections',
          views: {
              'menuContent': {
                  templateUrl: 'templates/hireConnections.html',
                  controller: 'hireConnectionsCtrl'
              }
          }

      }).state('app.hireConnectionsProject', {
          url: '/hireConnections/project/:projectId',
          views: {
              'menuContent': {
                  templateUrl: 'templates/projectConnections.html',
                  controller: 'hireConnectionsProjectCtrl'
              }
          }

      })
      .state('app.getHireConnections', {
          url: '/getHireConnections',
          views: {
              'menuContent': {
                  templateUrl: 'templates/getHireConnection.html',
                  controller: 'getHireConnectionsCtrl'
              }
          }

      }).state('app.chatFilters', {
          url: '/chatFilters',
          views: {
              'menuContent': {
                  templateUrl: 'templates/Chat_filters.html',
                  controller: 'hireUserMessagesCtrl'
              }
          }

      }).state('app.settings', {
          url: '/settings',
          views: {
              'menuContent': {
                  templateUrl: 'templates/settings.html',
                  controller: 'settingsCtrl'
              }
          }

      }).state('app.forGotPassword', {
          url: '/forGotPassword',
          views: {
              'menuContent': {
                  templateUrl: 'templates/forgotPassword.html',
                  controller: 'forGotPasswordCtrl'
              }
          }

      }) .state('app.subscription', {
          url: '/subscription',
          views: {
              'menuContent': {
                  templateUrl: 'templates/subscription.html',
                  controller: 'SubscriptionCtrl'
              }
          }
      })
      .state('login', {
          url: '/login',
                  templateUrl: 'templates/login.html',
                  controller: 'LoginCtrl'


      }).state('register', {
          url: '/register',
                  templateUrl: 'templates/register.html',
                  controller: 'RegisterCtrl'

      })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })  
 ;

  // if none of the above states are matched, use this as the fallback

  // $urlRouterProvider.otherwise('/app/playlists');
  // $urlRouterProvider.otherwise('/app/dashboard');
   $urlRouterProvider.otherwise('/login');
        $ionicConfigProvider.tabs.position('top');

});
