import angular from 'angular';
//import { combineReducers } from 'redux';
import createLogger from 'redux-logger';
//import { thunk } from 'redux';
import ngRedux from 'ng-redux';
import flowerreducer from '../redux/reducer';
import { actionFactory } from '../redux/reducer_actions'

'use strict';

const logger = createLogger({
  level: 'info',
   collapsed: true  
});


function overrideStatePersistor() {
    return store => next => action => {      
        // State before the dispatch
        console.log(store.getState(), '---Before Action Dispatch');
        // Override here calling the next dispatch method 
        next(action);
        // State after the dispatch
        console.log(store.getState(),'---After Action Dispatch');
    }
}



  let app = angular.module("app", [ngRedux]);
  app.service('redux_override_state_persistor', overrideStatePersistor);

  app.config(['$ngReduxProvider', function(redux) {redux.createStoreWith(flowerreducer , ['redux_override_state_persistor'] ,[],JSON.parse(localStorage.getItem("appstate")));

  }]);
  app.value('urlFlowers', 'https://dmm888enhanced.apphb.com/api/apicode/getflowers');
  app.factory("getFlowers", function($http, urlFlowers) { 
    return {
      allFlowers: function() {
        return $http.get(urlFlowers, {
          cache: false
        });
      },
    };

  });

  app.controller('parentController', ['$interval', '$timeout','$ngRedux', function ($interval,$timeout,ngRedux) {    
    this.message="Parent controller injection 2 ways";
 }

   ]);

  var componentController = function($scope,$http, getFlowers,ngRedux) {

    ngRedux.dispatch(actionFactory().addItem('111111111111111'));
    ngRedux.dispatch(actionFactory().addItem('How are you'));
    ngRedux.dispatch(actionFactory().addItem('New part'));
    ngRedux.dispatch(actionFactory().addItem('Another system'));
    console.log(ngRedux.getState(),'----IN COMPONENT CONTROLLER');

    this.state = {};
    this.flowers = [];
    this.pageSize=2;
    this.pageSizes=[2,4,6,7,9,13,17];
    this.flowersInPage=[];
    this.flower = {};
    this.ajax_error = false;
    this.state.pageNumber=1;
    this.numberOfPages=0;
    var counter = 0;   

    this.select =function(index) {
    this.flowersInPage=this.getDataPage();
    angular.forEach(this.flowersInPage, function (flower,currentIndex) {
     if(currentIndex === index) {
     flower.selected = true;
     this.flower=flower;
     counter=index;
    }
     else flower.selected=false;
    }.bind(this));}.bind(this);

    this.$onInit = function() {    
    
       getFlowers.allFlowers().then(function(response) {
          this.flowers = response.data;
            angular.forEach(this.flowers, function (flower,currentIndex) {
            flower.ImagePath=flower.ImagePath.replace("../../", "https://dmm888enhanced.apphb.com/");
            });
          this.numberOfPages = this.flowers.length % this.pageSize === 0 ?  parseInt(this.flowers.length /  this.pageSize) : parseInt(this.flowers.length /  this.pageSize) + 1;
          this.flowersInPage=this.getDataPage();
          this.flower = this.flowersInPage[0];
          this.flowersInPage[0].selected=true;
          counter=0;


        }.bind(this), function(error) {
          this.ajax_error = true;

        }.bind(this) // to avoid using var self = this
      );
    }.bind(this);

    this.next = function() {
      if (counter < this.getDataPage().length - 1) {
        counter += 1;
        this.select(counter);
      }
    }.bind(this);

    this.previous = function() {
      if (counter > 0) {
        counter -= 1;
        this.select(counter);
      }
    }.bind(this);

      this.getDataPage = function() {
      return this.flowers.slice((this.state.pageNumber-1) * this.pageSize , this.pageSize * this.state.pageNumber);
    }.bind(this);

    this.calculatePageNumber = function() {
     this.numberOfPages = this.flowers.length % this.pageSize === 0 ?  parseInt(this.flowers.length /  this.pageSize) : parseInt(this.flowers.length /  this.pageSize) + 1;

    };

   this.nextPage = function() {
    counter=0;
    var remainder =this.flowers.length % this.pageSize;
    var lastPage = parseInt(this.flowers.length / this.pageSize);
    if(remainder > 0 ){ lastPage ++;}
    if(this.state.pageNumber === lastPage )return;
    this.state.pageNumber+=1;
    this.flowersInPage=this.getDataPage();
    this.flower = this.flowersInPage[0];
    this.select(0);

  }.bind(this);

     this.prevPage = function() {
      counter=0;
      if(this.state.pageNumber==1) return;
      this.state.pageNumber-=1;
      this.flowersInPage=this.getDataPage();
       this.flower = this.flowersInPage[0];
      this.flowersInPage[0].selected=true;
       this.select(0);
    }.bind(this);

  };

  app.component("customComponent", {
    templateUrl: "./js/components/statecomponent.html",

    bindings: {
      reason: '@',
      message: '<',
    },

    controllerAs: "vm",
    // annotation for right minification
    controller: ['$scope','$http', 'getFlowers','$ngRedux', componentController]

  });

  export default app;
