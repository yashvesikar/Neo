class form1 {
  constructor(){}

  submitForm() {
      //This returns an array of objects of the checked checkboxes
      let values = $("#s1").serializeArray();
      //Super basic check to see if all 7 boxes were checked
      if (values.length != 7){
        //For now we are supposed to let them keep going, but recc do not cool
        console.log("Should recommend to not cool");
      } else {
        console.log("Continue to the Blood Gas questions");
        $("#form2").fadeIn();
      }
      event.preventDefault();
  }
}

class form2 {

  validate(values) {
    if (values["s2q1"] ===  true){
      if (parseInt(values["s2q2"]) < 7 && parseInt(values["s2q2"])>7.16) {
        console.log(values["s2q2"], "is not inbetween 7 and 7.16" );
        return false;
      }
      else if (parseInt(values["s2q3"]) < 9.99 && parseInt(values["s2q3"])>16){
        console.log(values["s2q3"], "is not inbetween 9.99 and 16" );
        return false;
      } else {
        console.log("all values in range");
        return true;
      }
    }
    console.log("The switch was off")
    return false;

  }


  submitForm() {
    let inputs = $("#s2 :input");
    let values = {};

    inputs.each(function() {
      if(this.type == "checkbox"){
        values[this.id] = this.checked;
      } else {
        values[this.id] = this.value;
      }

    })
    // console.log("DEBUG THESE ARE THE INPUTS: ",inputs);
    console.log("DEBUG THESE ARE THE VALUES: ",values);
    let nextForm = this.validate(values); // If trye continue to history, else skip to neural
    if (nextForm === true) {
      console.log("Continue to the History questions");
      $("#form3").fadeIn();
    } else {
      console.log("Continue to the Neural questions");
    }
    // s2q1 must  be on
    // s2q2 must be between 7-7.16 not including 7 or 7.16
    // s2q3 must be between 9.99 and 16 not including 9.99 or 16
    // If any of these cases fail then skip history and go to neural questions

    event.preventDefault();
  }


}

var qualifyingQuestions = new form1();
var bloodGasQuestions = new form2();
