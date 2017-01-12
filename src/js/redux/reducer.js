'use strict';

export default function flowerreducer(state, action) {   
     
    var initialState = {       
        allStates:[]           
    };

    if (angular.isUndefined(state)) {
        return angular.copy(initialState);
    }

    switch (action.type) {
        case 'ADD_ITEM':
            state.allStates.push(action.payload)
            break;        
        default :
              return state;
    }

    return state;


}


export  function  addItem(item) {
        return {
            type: 'ADD_ITEM',
            payload: item
        };
}
