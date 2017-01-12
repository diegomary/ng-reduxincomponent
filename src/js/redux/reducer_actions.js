'use strict';

function actionFactory() { 
    return {
      addItem: function(item) {
        return {
            type: 'ADD_ITEM',
            payload: item
        };
      },

      removeItem: function(item) {
        return {
            type: 'REMOVE_ITEM',
            payload: item
        };
      },

    };
}

export { actionFactory };