import Handsontable from 'handsontable';


(Handsontable => {
  
    function emailValidator(value, callback){
      if (/.+@.+/.test(value)) {  // TODO: a@a.1 not working while a@a.12 works, sails-anchor's email validation is complex
          callback(true);
        }
        else {
          callback(false);
        }
    }
  
    // Register an alias
    Handsontable.validators.registerValidator('emailcheck', emailValidator);
  
  })(Handsontable);