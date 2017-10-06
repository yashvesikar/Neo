// Section 1 Form: Qualifying Questions
$("#s1").submit(function( event ) {
  console.log("Form 1 submitted");
  event.preventDefault();

  var valid = false;
  var nextSection = 2;
  var q1 = $("#s1q1").is(":checked");
  var q2 = $("#s1q2").is(":checked");
  var q3 = $("#s1q3").is(":checked");
  var q4 = $("#s1q4").is(":checked");
  var q5 = $("#s1q5").is(":checked");
  var q6 = $("#s1q6").is(":checked");
  var q7 = $("#s1q7").is(":checked");

  // All questions must be yes to pass
  if (q1 && q2 && q3 && q4 && q5 && q6 && q7) { console.log("trueee"); valid = true; }

  // Next section is invalid if form wasn't valid
  if (valid == false) { nextSection = -1; }

  if (valid) {
    // Move to next section
    var form = "#form" + nextSection;
    $(form).fadeIn();
  } else {
    // Display error
    alert("There was an error in your form");
  }

});

// Section 2 Form:  Blood Gas Questions
$("#s2").submit(function( event ) {
  console.log("Form 2 submitted");
  event.preventDefault();

  var valid = false;
  var nextSection = 3;
  var availablePH = $("#s2q1").is(":checked"); // Available Cord or Postnatal Blood Gas pH obtained within 1hr of age? (Yes or no)
  var bloodGasPH = parseInt($("#s2q2").val());  // Blood Gas PH
  var baseDeficit = parseInt($("#s2q3").val()); // Base Deficit

  console.log(availablePH, bloodGasPH, baseDeficit);

  // If under 7 or above 16 skip history and go to neural
  if ((bloodGasPH < 7) || (bloodGasPH > 16)) { valid = true; nextSection = 4; }
  // If over 16 skip history and go to neural
  if (bloodGasPH >= 16) { valid = true; nextSection = 4; }
  // If between 7 and 7.16 (non inclusive) continue to history
  if (7 > bloodGasPH < 7.16) { valid = true; }
  // If between 9.99 and 16 (non inclusive) continue to history
  if (9.99 > bloodGasPH < 16) { valid = true; }

  console.log(valid, nextSection);

  // Next section is invalid if form wasn't valid
  if (valid == false) { nextSection = -1; }

  if (valid) {
    // Move to next section
    var form = "#form" + nextSection;
    $(form).fadeIn();
  } else {
    // Display error
    alert("There was an error in your form");
  }

});

// Section 3 Form: History Questions
$("s3").submit(function( event ) {
  alert( "Form 3 submitted." );
  event.preventDefault();

  var valid = false;
  var nextSection = 4;
  var acuteEventHistory = ("#s3q1").val(); // History of an acute event? (Yes or No)
  var apgarScore = ("#s3q2").val();        // 10 minute Apgar score
  var ventFromBirth = ("#s3q3").val();     // Ventilation from birth continued for at least 10 min? (yes or no)

  // If acute event or if 6+ apgar score and no vent, continue to neural
  if (acuteEventHistory == true) { valid = true; }
  else if (apgarScore >= 6 && (ventFromBirth == false)) { valid = true; }

  // If apgar less than equal to 5, continue to neural
  if (apgarScore <= 5) { valid = true; }
  // If ventilated from birth, continue to neural
  if (ventFromBirth == true) { valid = true; }
  // Next section is invalid if form wasn't valid
  if (valid == false) { nextSection = -1; }

  if (valid) {
    // Move to next section
    var form = "#form" + nextSection;
    $(form).fadeIn();
  } else {
    // Display error
    alert("There was an error in your form");
  }

});
