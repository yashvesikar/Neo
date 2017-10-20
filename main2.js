var PAGES = [1,]

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

/**
 ** Section 1 Form: Qualifying Questions
 **/
$("#s1").submit(function( event ) {
  console.log("Form 1 submitted");
  //event.preventDefault();

  /*** For now let the user move through the questions without this check  ***/
  // var valid = false;
  let valid  = true;
  let nextSection = 2;
  let q1 = $("#s1q1").is(":checked");
  let q2 = $("#s1q2").is(":checked");
  let q3 = $("#s1q3").is(":checked");
  let q4 = $("#s1q4").is(":checked");
  let q5 = $("#s1q5").is(":checked");
  let q6 = $("#s1q6").is(":checked");
  let q7 = $("#s1q7").is(":checked");

  // All questions must be yes to pass
  if (q1 && q2 && q3 && q4 && q5 && q6 && q7) { console.log("true"); valid = true; }

  // Next section is invalid if form wasn't valid

  /*** For now let the user move through the questions without this check  ***/
  // if (valid == false) { nextSection = -1; }

  submitForm(valid, nextSection);

});

/**
 ** Section 2 Form: Blood Gas Questions
 **/
$("#s2").submit(function( event ) {
  console.log("Form 2 submitted");
  //event.preventDefault();

  var valid = false;
  var nextSection = 3;
  var availablePH = $("#s2q1").is(":checked"); // Available Cord or Postnatal Blood Gas pH obtained within 1hr of age? (Yes or no)
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
  submitForm(valid, nextSection);

});

/**
 ** Section 3 Form: History Questions
 **/
$("#s3").submit(function( event ) {
  //event.preventDefault();

  var valid = false;
  var nextSection = 4;
  var acuteEventHistory = $("#s3q1").val(); // History of an acute event? (Yes or No)
  var apgarScore = $("#s3q2").val();        // 10 minute Apgar score
  var ventFromBirth = $("#s3q3").val();     // Ventilation from birth continued for at least 10 min? (yes or no)

  // If acute event or if 6+ apgar score and no vent, continue to neural
  if (acuteEventHistory == true) { valid = true; }
  else if (apgarScore >= 6 && (ventFromBirth == false)) { valid = true; }

  // If apgar less than equal to 5, continue to neural
  if (apgarScore <= 5) { valid = true; }
  // If ventilated from birth, continue to neural
  if (ventFromBirth == true) { valid = true; }
  // Next section is invalid if form wasn't valid
  if (valid == false) { nextSection = -1; }

  submitForm(valid, nextSection);

});

var hadSeizure = $("#s4q1").is(":checked");
//Only show form 4 questions if had seizures.
$('#s4q1').on('change', function() {
  hadSeizure = $("#s4q1").is(":checked");
  if (!hadSeizure) {
    $('.seizureQuestions').fadeIn();
  } else {
    $('.seizureQuestions').fadeOut();
  }
})


$("#s4").submit(function( event ) {
  // alert( "Form 4 submitted." );
  event.preventDefault();
  if (hadSeizure) {
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
