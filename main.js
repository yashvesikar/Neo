var PAGES = [1,]
var RECOMMENDATION = false;

/**
 ** If valid, moves to the appropriate section. Otherwise displays error.
**/

function submitForm(valid, nextSection) {
  if (valid) {
    // Move to next section

    if (nextSection == 6){

      $('html, body').animate({
          scrollTop: $("#result").offset().top
      }, 2000);

    } else {
      let form = "#form" + nextSection;
      PAGES.push(nextSection);
      console.log(PAGES);

      $(form).fadeIn();
      //Scrolling animation to next section
      $('html, body').animate({
          scrollTop: $(form).offset().top
      }, 2000);
    }

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

  let valid  = true;
  let nextSection = 2;
  let q1 = $("input:radio[name='qualifying1']:checked").val();

  // NEW FORM LAYOUT
  if( q1 == 1){ RECCOMENDATION = true; valid=true;}
  else{ RECCOMENDATION = false;}

  /*** For now let the user move through the questions without this check  ***/
  // if (valid == false) { nextSection = -1; }

  submitForm(valid, nextSection);

});


/**
 ** Section 2 Form: Neural Questions
 **/

$("#s2q1n").click(function() {
  $(".seizureQuestions").fadeOut();
});
$("#s2q1y").click(function() {
  $(".seizureQuestions").fadeIn();
});


$("#s2").submit(function( event ) {
  // alert( "Form 4 submitted." );
  event.preventDefault();
  let hadSeizure = $("input:radio[name='seizures1']:checked").val()
  // let hadSeizure = $("input:radio[name='qualifying1']:checked").val();

  if (hadSeizure == 1) {
    //alert("Cooling advised.");
    $('#result h3').attr("id","cool");
    $('#result h3').html('COOL');
    $('.result-body').html("");
    $('#result').fadeIn();
    return;
  }
  var valid = true;
  var nextSection = 3;
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
    //alert("Cooling advised.");
    $('#result h3').attr("id","cool");
    $('#result h3').html('COOL');
    $('.result-body').html("");
    // $('#result').fadeIn();
    RECCOMENDATION = true;
  } else{
    //alert("Cooling not advised")
    $('#result h3').attr("id","hot");
    $('#result h3').html('NOT COOL');
    // $('#result').fadeIn();
    RECCOMENDATION = false;
  }
  if (valid == false) { nextSection = -1; }

  submitForm(valid, nextSection);

});

/**
 ** Section 3 Form: Qualifying Questions/Criteria Questions
 **/
$("#s3").submit(function( event ) {
  console.log("Form 3 submitted");
  event.preventDefault();

  /*** For now let the user move through the questions without this check  ***/
  // var valid = false;
  let valid  = true;
  let nextSection = 4;
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
  if (q2 + q3 + q4 + q5 + q6 + q7 == 12) { RECOMMENDATION = true; valid = true; }
  else {RECOMMENDATION = false}

  submitForm(valid, nextSection);

});


/**
 ** Section 4 Form: Blood Gas Questions
 **/

let gasResponse = {
  "availablePH": undefined,
  "bloodGasPH": undefined,
  "baseDeficit": undefined
}

$("#s4").submit(function( event ) {
  console.log("Form 4 submitted");
  event.preventDefault();
/** TODO: REFACTOR CODE AND CLEAN IT UP
[ With "in range" being defined as pH </= 7 or base deficit >/= 16 ]: Cool (and don't go on to history)....
if in the "maybe" range of pH=7.01 to 7.15 or base deficit=10-15.9 or not available, then go to history.....
if pH is greater than 7.15 or base deficit is less than 10, then Do not cool.
*/

  var valid = false;
  var nextSection = 5;

  var availablePH = $("input:radio[name='bg1']:checked").val(); // Available Cord or Postnatal Blood Gas pH obtained within 1hr of age? (Yes or no)

  if (availablePH == undefined) { alert("Please enter a value for PH"); return;} // Prompts user to select Yes or No for available PH

  if (availablePH == 0 ) { // If No is selected
    if( gasResponse.availablePH != undefined){back();} // If it is not the first pass through the form, remove the last elemnt from Pages Array
    // nextSection = ; //Set next section to Neuro when answer is No
    valid = true
  } else { // If Yes is selected
      if( gasResponse.availablePH != undefined){back();} // If it is not the first pass through the form, remove the last elemnt from Pages Array
      var bloodGasPH = parseFloat($("#s4q2").val());  // Blood Gas PH
      var baseDeficit = parseInt($("#s4q3").val()); // Base Deficit

      if ((bloodGasPH <= 7) || (baseDeficit>=16)){RECCOMENDATION = true; valid = true; nextSection=6;}
      else if (((bloodGasPH >7) && (bloodGasPH<=7.15)) || ((baseDeficit>10)&&(baseDeficit<=15.9))){valid=true; nextSection=5;}
      else if ((bloodGasPH > 7.15) || (baseDeficit<10)){RECCOMENDATION= false; nextSection=5;}

  }
  // Update json object of the response history
  gasResponse.availablePH = availablePH;
  gasResponse.bloodGasPH = bloodGasPH;
  gasResponse.baseDeficit = baseDeficit;
  console.log("Blood gas", valid, nextSection);
  submitForm(valid, nextSection);

});
/*
 * Blood Gas refreshes form depending on availability of blood gas
 */
$("#s4q1y").click(function() {
  $(".bg-questions").fadeIn();
});

$("#s4q1n").click(function() {
  $(".bg-questions").fadeOut();
});


/**
 ** Section 5 Form: History Questions
 **/
 let histResponse = {
   "acuteEventHistory": "",
   "apgarScore": "",
   "ventFromBirth": "",
   "submitted": 0
 };

$("#s5").submit(function( event ) {
  event.preventDefault();

  var valid = false;
  var nextSection = 6;
  var acuteEventHistory = $("input:radio[name='hist1']:checked").val(); // History of an acute event? (Yes or No)
  var apgarScore = $("#s5q2").val();        // 10 minute Apgar score
  var ventFromBirth = $("input:radio[name='hist2']:checked").val();     // Ventilation from birth continued for at least 10 min? (yes or no)

  // If acute event or if 6+ apgar score and no vent, continue to neural
  console.log("S3!", acuteEventHistory, apgarScore, ventFromBirth)
  if (acuteEventHistory != undefined && apgarScore != undefined && ventFromBirth != undefined ){
      valid = true;
  } else {valid = false; nextSection = -1; alert("You have not filled out all of the history questions.")}
  if( histResponse.submitted>=1){back();}

  if((acuteEventHistory == 1) || (apgarScore <= 5) || (ventFromBirth == 1)){
    valid = true;
    nextSection = 6;
    RECCOMENDATION = true;
    $('#result h3').attr("id","cool");
    $('#result h3').html('COOL');
    $('.result-body').html("");
    $('#result').fadeIn();

  } else if ((acuteEventHistory==0)&&(apgarScore>5)&&(ventFromBirth==0)){
    valid = true;
    nextSection = 6;
    RECCOMENDATION = false;
    $('#result h3').attr("id","hot");
    $('#result h3').html('NOT COOL');
    $('#result').fadeIn();
  }

  histResponse.acuteEventHistory = acuteEventHistory;
  histResponse.apgarScore = apgarScore;
  histResponse.ventFromBirth = ventFromBirth;
  histResponse.submitted += 1;
  submitForm(valid, nextSection);

});

$("#s5q1y").click(function() {
  $(".acute-event").fadeIn();
});
$("#s5q1n").click(function() {
  $(".acute-event").fadeOut();
});
