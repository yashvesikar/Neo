var PAGES = [1,]
var RECOMMENDATION = false;

/**
 ** If valid, moves to the appropriate section. Otherwise displays error.
**/

function submitForm(valid, nextSection) {
  if (valid) {
    // Move to next section
    var form = "#form" + nextSection;
    PAGES.push(nextSection);
    console.log(PAGES);
    $(form).fadeIn();
    //Scrolling animation to next section
    $('html, body').animate({
        scrollTop: $(form).offset().top
    }, 2000);
  } else {
    // Display error
    alert("There was an error in your form");
  }
}

function back() {
    console.log("Back");
    console.log(PAGES);
    var last = PAGES.pop();
    console.log(PAGES);
    //console.log(PAGES);
    var form = "#form" + last;
    //console.log(form);
    var dest = "#form" + PAGES[PAGES.length - 1];
    //console.log(PAGES[PAGES.length - 1]);
    console.log(dest);
    $(form).fadeOut();
    $('html, body').animate({
        scrollTop: $(dest).offset().top
    }, 2000);

}


/**
 ** Section 1 Form: Qualifying Questions
 **/
$("#s1").submit(function( event ) {
  console.log("Form 1 submitted");
  event.preventDefault();

  /*** For now let the user move through the questions without this check  ***/
  // var valid = false;
  let valid  = true;
  let nextSection = 2;
  let q1 = $("input:radio[name='qualifying1']:checked").val();
  let q2 = $("input:radio[name='qualifying2']:checked").val();
  let q3 = $("input:radio[name='qualifying3']:checked").val();
  let q4 = $("input:radio[name='qualifying4']:checked").val();
  let q5 = $("input:radio[name='qualifying5']:checked").val();
  let q6 = $("input:radio[name='qualifying6']:checked").val();
  let q7 = $("input:radio[name='qualifying7']:checked").val();

  for (var i = 1; i <= 7; i++) {
    console.log("qualifying",i,$("input:radio[name='qualifying"+i+"']:checked").val());
  }



  // All questions must be yes to pass
  if (q1 + q2 + q3 + q4 + q5 + q6 + q7 == 21) { RECOMMENDATION = true; valid = true; }
  else {RECOMMENDATION = false}

  // Next section is invalid if form wasn't valid

  /*** For now let the user move through the questions without this check  ***/
  // if (valid == false) { nextSection = -1; }

  submitForm(valid, nextSection);

});

/**
 ** Section 2 Form: Blood Gas Questions
 **/

let gasResponse = {
  "availablePH": undefined,
  "bloodGasPH": undefined,
  "baseDeficit": undefined
}

$("#s2").submit(function( event ) {
  console.log("Form 2 submitted");
  event.preventDefault();

  var valid = false;
  var nextSection = 3;

  var availablePH = $("input:radio[name='bg1']:checked").val(); // Available Cord or Postnatal Blood Gas pH obtained within 1hr of age? (Yes or no)

  if (availablePH == undefined) { alert("Please enter a value for PH"); return;} // Prompts user to select Yes or No for available PH

  if (availablePH == 0 ) { // If No is selected
    if( gasResponse.availablePH != undefined){back();} // If it is not the first pass through the form, remove the last elemnt from Pages Array
    nextSection = 4; //Set next section to Neuro when answer is No
    valid = true
  } else { // If Yes is selected
      if( gasResponse.availablePH != undefined){back();} // If it is not the first pass through the form, remove the last elemnt from Pages Array
      var bloodGasPH = parseFloat($("#s2q2").val());  // Blood Gas PH
      var baseDeficit = parseInt($("#s2q3").val()); // Base Deficit
      // If under 7 or above 7.16 skip history and go to neural
      if ((bloodGasPH > 7) && (bloodGasPH < 7.16)) { valid = true; nextSection = 3; }
      else {valid = true; nextSection = 4;}
      // If under 10 or above 16 then skip history and go straight to neural
      if ((baseDeficit > 10 ) && (baseDeficit < 16 )) {valid = true; nextSection = 3;}
      else {valid = true; nextSection = 4;}
      // Next section is invalid if form wasn't valid
      if (valid == false) { nextSection = -1; }

  }

  // Update json object of the response history
  gasResponse.availablePH = availablePH;
  gasResponse.bloodGasPH = bloodGasPH;
  gasResponse.baseDeficit = baseDeficit;

  submitForm(valid, nextSection);

});
/*
 * Blood Gas refreshes form depending on availability of blood gas
 */
$("#s2q1y").click(function() {
  $(".bg-questions").fadeIn();
});

$("#s2q1n").click(function() {
  $(".bg-questions").fadeOut();
});


/**
 ** Section 3 Form: History Questions
 **/
 let histResponse = {
   "acuteEventHistory": "",
   "apgarScore": "",
   "ventFromBirth": "",
   "submitted": 0
 };

$("#s3").submit(function( event ) {
  event.preventDefault();

  var valid = false;
  var nextSection = 4;
  var acuteEventHistory = $("input:radio[name='hist1']:checked").val(); // History of an acute event? (Yes or No)
  var apgarScore = $("#s3q2").val();        // 10 minute Apgar score
  var ventFromBirth = $("input:radio[name='hist2']:checked").val();     // Ventilation from birth continued for at least 10 min? (yes or no)

  // If acute event or if 6+ apgar score and no vent, continue to neural
  console.log("S3!", acuteEventHistory, apgarScore, ventFromBirth)
  if (acuteEventHistory != undefined && apgarScore != undefined && ventFromBirth != undefined ){
      valid = true;
  } else {valid = false; nextSection = -1;}

  if (acuteEventHistory == 0) {
    if (apgarScore >=6 && ventFromBirth == false) {
      if (histResponse.submitted >=1){back();}
      valid = false; //************** This should be true **********************
      // nextSection = -1; //******** This should be the final reccomendation section ***********
      alert("Do Not Cool");
    }
  } else {
    //Continue to Neural
    valid = true;
  }

  histResponse.acuteEventHistory = acuteEventHistory;
  histResponse.apgarScore = apgarScore;
  histResponse.ventFromBirth = ventFromBirth;
  histResponse.submitted += 1;
  submitForm(valid, nextSection);

});

$("#s3q1y").click(function() {
  $(".acute-event").fadeIn();
});
$("#s3q1n").click(function() {
  $(".acute-event").fadeOut();
});

/**
 ** Section 4 Form: Neural Questions
 **/

$("#s4q1y").click(function() {
  $(".seizureQuestions").fadeOut();
});
$("#s4q1n").click(function() {
  $(".seizureQuestions").fadeIn();
});


$("#s4").submit(function( event ) {
  // alert( "Form 4 submitted." );
  event.preventDefault();
  let hadSeizure = $("input:radio[name='seizures1']:checked").val()
  if (hadSeizure == 1) {
    alert("Cooling advised.");
    return;
  }
  var valid = false;
  var nextSection = 4;
  var points = 0;
  //Breaking into categories
  //Categories 1 and 2
  for (var i = 1; i <= 2; i++) {
    if($("input:radio[name='question"+i+"']:checked").val() >=3) {
      points++;
    }
  }
  //Category 3
  for (var i = 3; i <= 5; i++) {
    if($("input:radio[name='question"+i+"']:checked").val() >=3) {
      points++;
      break;
    }
  }
  //Category 4
  for (var i = 6; i <= 8; i++) {
    if($("input:radio[name='question"+i+"']:checked").val() >=3) {
      points++;
      break;
    }
  }
  //Category 5
  for (var i = 9; i <= 10; i++) {
    if($("input:radio[name='question"+i+"']:checked").val() >=3) {
      points++;
      break;
    }
  }
  //Points system
  if (points>=3) {
    alert("Cooling advised.");
  } else{
    alert("Cooling not advised")
  }
  if (valid == false) { nextSection = -1; }

  // submitForm(valid, nextSection);

});


$(".back").click(function() {
    console.log("Back");
    console.log(PAGES);
    var last = PAGES.pop();
    console.log(PAGES);
    //console.log(PAGES);
    var form = "#form" + last;
    //console.log(form);
    var dest = "#form" + PAGES[PAGES.length - 1];
    //console.log(PAGES[PAGES.length - 1]);
    console.log(dest);
    $(form).fadeOut();
    $('html, body').animate({
        scrollTop: $(dest).offset().top
    }, 2000);

})
