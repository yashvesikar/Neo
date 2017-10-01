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

var qualifyingQuestions = new form1()
