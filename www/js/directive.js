var ionicSelect = angular.module('ionicSelect',[]);

ionicSelect.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
});
ionicSelect.directive('ionSelect',function(){
    'use strict';
    return{
        restrict: 'EAC',
        scope: {
            label:'@',
            placeholder:'@',
            class:'@',
            labelField:'@',
            provider:'=',
            ngModel: '=?',
            ngValue: '=?',
            dial: '&',

        },
        require: '?ngModel',
        transclude : false,
        replace: true,
        template:
            /*'<div class="">'
            +'<label class="">'
            +'<span class="">{{label}}</span>'
            +'<div class="">'
            +'<label class="">'
            +'<i class="icon ion-ios7-search placeholder-icon"></i>'
            +'<input id="filtro" type="search" class="testingInput"  ng-model="ngModel" ng-value="ngValue" ng-keydown="onKeyDown()"/>'
            +'</label>'
            +'<button class="button button-small button-clear" ng-click="open()">'
            +'<i class="icon ion-chevron-down"></i>'
            +'</button>'
            +'</div>'
            +'</label>'
            +'<div class="optionList padding-left padding-right" ng-show="showHide">'
            +'<ion-scroll>'
            +'<ul class="list">'
            +'<li class="item" ng-click="selecionar(item)" ng-repeat="item in provider | filter:ngModel">{{item[labelField]}}</li>'
            +'</ul>'
            +'</ion-scroll>'
            +'</div>'
            +'</div>'*/
        ' <div> <label class="item item-input item-floating-label">'
    +'<span class="input-label">{{label}}</span>'
    +'<input placeholder="{{ placeholder }}" type="search" class="{{ class }}"  ng-model="ngModel" ng-value="ngValue" ng-keydown="onKeyDown()" >'
     /*+'   <div class="arrow" id ="button_arrow" style="float:right">'
      +'      <button class="button button-icon icon ion-chevron-bottom" ng-click="open()"></button>'
    +'</div>'*/
    +'</label>'
            +'<div class="optionList padding-left padding-right" ng-show="showHide">'
            +'<ion-scroll>'
            +'<ul class="list">'
            +'<li class="item" ng-click="dial(item)" ng-repeat="item in provider | filter:ngModel">{{item[labelField]}}</li>'
            +'</ul>'
            +'</ion-scroll>'
            +'</div> </div>'
        ,
        link: function (scope, element, attrs,ngModel) {
            console.log(element);
            scope.ngValue = scope.ngValue !== undefined ? scope.ngValue :'item';

            scope.dial = function(item){
                console.log('items : ',item);
                ngModel.$setViewValue(item.cat);
                scope.showHide = false;
            };

            element.bind('click',function(){
                //element.find('.testingInput')//.focus();
               // scope.showHide = false;
                scope.showHide = true;

            });

            scope.open = function(){
                scope.ngModel = "";
               // ngModel.$setViewValue('');
                return scope.showHide=!scope.showHide;

                //return scope.showHide = true;
            };

            scope.onKeyDown = function(){
                scope.showHide = true;
                if(!scope.ngModel){
                    scope.showHide = false;
                }
            }

            scope.$watch('ngModel',function(newValue){
                console.log('class: ',scope.class);
                if(newValue)
                    element.find(scope.class).val(newValue[scope.labelField]);
                   // element.find('.testingInput').val = '1125'//(newValue.cat);
            });
        }
    };
});


/*

var teste = angular.module('ionicTeste',['ionic','ionicSelect']);

teste.controller('testeController',function($scope){

    var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
    $scope.veiculos = data;
    $scope.testa = function(){
        alert($scope.veiculo.nmPlaca);
    }
});*/
