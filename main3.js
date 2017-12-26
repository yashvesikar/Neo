var PAGES = [1];
var RECCOMENDATION = null;
var REASONS = [];

/**
 * Information Section
 */
function showHow(){
   $('#How').collapse('toggle');
   // $('#How').collapse('hide');
   $('#Pitfalls').collapse('hide');
   $('#Why').collapse('hide');
}

function showPitfalls(){
   $('#Pitfalls').collapse('toggle');
   // $('#Pitfalls').collapse('hide');
   $('#Why').collapse('hide');
   $('#How').collapse('hide');
}

function showWhy(){
   $('#Why').collapse('toggle');
   // $('#Why').collapse('hide');
   $('#Pitfalls').collapse('hide');
   $('#How').collapse('hide');
}
//******************************************************************************

function navigateForward(to) {
    PAGES.push(to);
    let form = "#form" + to;
    console.log(form);
    $(form).fadeIn();

    //Scrolling animation to next section
    $('html, body').animate({
        scrollTop: $(form).offset().top
    }, 500);
}

function getSection(sectionNumber) {
    switch (sectionNumber) {
        case 1:
            return new InitialSection();
            break;
        case 2:
            return new NeurologicSection();
            break;
        case 3:
            return new SarnatSection();
            break;
        case 4:
            return new QualifyingSection();
            break;
        case 5:
            return new BloodGasSection();
            break;
        case 6:
            return new HistorySection();
            break;
    }
}

//******************************************************************************

/**
 ** Section 1 - Initial Questions **
 **/
$("label[name='s1q1_label']").click(function() {
  console.log("Submit 1 enabled");
  $("#submit1").prop("disabled",false);
});

class InitialSection {
    constructor() {
        this.perinatalEvent = parseInt($("input:radio[name='s1q1']:checked").val());
        this.submitted = 0
    }

    validate(){
      // console.log(this.perinatalEvent);
      this.submitted+=1
      console.log("submitted",this.submitted);
      $("#submit1").prop("disabled",true);
      if(this.perinatalEvent === 1) {
        // PAGES.push(2)
        // MEETS_CRITERIA.push(1);
        return 2;
      }
      else {
        RECCOMENDATION = false;
        PAGES.push(8)
        // REASONS.push("Neonates condition is not suggestive of Encephalopathy.");
        return 8;
      }

    }

    evaluate(){}
    reset(){}

    // validate() {
    //     if(this.perinatalEvent) {
    //       MEETS_CRITERIA.push(1);
    //       return 2;
    //     }
    //     else {
    //       RECCOMENDATION = false;
    //       REASONS.push("Neonates condition is not suggestive of Encephalopathy.");
    //       return 8;
    //     }
    // }
}

/**
 * Section 2 - Nuerological Questions
 */
 $("label[name='s2q1_label']").click(function() {
   console.log("Here");
   $("#submit2").prop("disabled",false);
 });

 class NeurologicSection {
     constructor() {
         this.hasSeizures = $("input:radio[name='s2q1']:checked").val();
         // console.log("SEIZURES: ", this.hasSeizures);
         this.submitted = 0
     }

     validate() {
       this.submitted+=1;
       console.log("submitted form 2",this.submitted);
       $("#submit2").prop("disabled",true);
       if(this.hasSeizures == 1) {
         // RECCOMENDATION=true;
         // MEETS_CRITERIA.push(2);
         return 4;
       }
       else {
         return 3;
       }
     }
 }

 /**
  ** Section 3: SARNAT **
  **/
  // Enable submit button logic
$("select[name='question1'],\
   select[name='question2'],\
   select[name='question3'],\
   select[name='question4'],\
   select[name='question5'],\
   select[name='question6'],\
   select[name='question7'],\
   select[name='question8'],\
   select[name='question9']").change(function(){
      console.log(event.target);
      if($('#form3 option[disabled]:selected').length == 0 ){
         // ALL the select boxes have something selected rather than the default option
         $("#submit3").prop("disabled",false);
      }
   });


 class SarnatSection {
     constructor() {
       this.points = 0;
       this.submitted = 0;
     }

     validate() {
       this.submitted+=1;
       console.log("form 3 submit",this.submitted);
       $("#submit3").prop("disabled",true); // Disable submit button
       //Breaking into categories

       // Catagory 1 -- Conciousness
       if($("input:radio[name='question1']:checked").val() >=3) {
         this.points++;
       }
       // Catagory 2 -- Spontaneous Activity -- spontaneous activity is its own group
       if($("input:radio[name='question2']:checked").val() >=3) {
         this.points++;
       }

       //Category 3 -- NM Control -- Cat3 is NM control q(3,4)
       for (var i = 3; i <= 4; i++) {
         if($("input:radio[name='question"+i+"']:checked").val() >=3) {
           this.points++;
           break;
         }
       }

       //Category 4 -- Primitive -- Cat4 Primitive q(5,6)
       for (var i = 5; i <= 6; i++) {
         if($("input:radio[name='question"+i+"']:checked").val() >=3) {
           this.points++;
           break;
         }
       }

       //Category 5 -- Automatic -- Cat 5 Autonomic q(7,8,9)
       for (var i = 7; i <= 9; i++) {
         if($("input:radio[name='question"+i+"']:checked").val() >=3) {
           this.points++;
           break;
         }
       }

       //Points system
       console.log("Points: ",this.points);

       // TODO: Add mild encephalopathy check with 1=>points <=2 points
       if (this.points == 1 || this.points == 2){
         console.log("Mild Encephalopathy")
       } else if (this.points>=3) {
         RECCOMENDATION = true;
         // MEETS_CRITERIA.push(2); // Either nuero is yes, or SARNAT is, not both
       } else {
         RECCOMENDATION = false;
       }

       return 4;
     }
 }


/**
 * Section 4 - Qualifying Questions **
 */
// Submit button logic
$("#form4 input:radio").change(function(){
  let answered = 0;
  for(let i = 1; i!= 7; ++i){
    if($("input:radio[name='s4q"+i+"']:checked").val() != undefined){
      answered+=1;
      continue;
    } else{
      answered = 0;
    }
  }
  console.log(answered);
  if(answered == 6){
    $("#submit4").prop("disabled",false);
  }
});


 // TODO: add reason for whichever is false.
class QualifyingSection {
    constructor() {
        this.is36WksOrOlder = $("input:radio[name='s4q1']:checked").val();
        this.is6HrsOrYounger = $("input:radio[name='s4q2']:checked").val();
        this.is1800gOrMore = $("input:radio[name='s4q3']:checked").val();
        this.hasCongenitalAbnormalities = $("input:radio[name='s4q4']:checked").val();
        this.hasChromosomalAbnormalities = $("input:radio[name='s4q5']:checked").val();
        this.hasAlternateCauseForEnceph = $("input:radio[name='s4q6']:checked").val();
    }

    validate() {
      $("#submit4").prop("disabled",true);
      // If all qualifying questions are yes
      if(this.is36WksOrOlder == 1
        && this.is6HrsOrYounger==1
        && this.is1800gOrMore==1
        && this.hasCongenitalAbnormalities==1
        && this.hasChromosomalAbnormalities==1
        && this.hasAlternateCauseForEnceph==1){
          RECCOMENDATION = true;
          // MEETS_CRITERIA.push(3);
      } else {
          RECCOMENDATION = false;
        }
        return 5;
    }
}

/**
 * Section 5 - Blood Gas
 */
// Submit button logic
$("#form5").on('input change',function(){
  if($("input:radio[name='s5q1']:checked").val() == 1){
    if($("#baseDeficit") != "" && $("#pH").val() != ""){
      $("#submit5").prop("disabled",false);
    }
  } else if($("input:radio[name='s5q1']:checked").val() == 0){
    $("#submit5").prop("disabled",false);
  }
});

function showBloodGas() {
  console.log("SHOW");
  $('#bloodgas2').collapse('show');
}

function hideBloodGas() {
  console.log("HIDE");
  $('#bloodgas2').collapse('hide');
}

class BloodGasSection {
    constructor() {
        this.bloodGasPH = parseFloat($("#s6q1").val());
        this.baseDeficit= parseFloat($("#s6q2").val());
        console.log("Blood ", this.bloodGasPH, "Base ", this.baseDeficit);
    }

    validate() {
      // $("#submit5").prop("disabled",true);
      return 6;
        // if ((this.bloodGasPH <= 7) || (this.baseDeficit>=16)){
        //   MEETS_CRITERIA.push(4);
        //   Checks that Inital, seizures, and qualifying and blood gas all meet the criteria to cool
        //   if(MEETS_CRITERIA.length >= 4){
        //     RECCOMENDATION = true;
        //     return 8;
        //   } else {
        //     RECCOMENDATION = false;
        //     return 8;
        //   }
        // } else if (((this.bloodGasPH >7) && (this.bloodGasPH<=7.15))
        //           || ((this.baseDeficit>10)&&(this.baseDeficit<=15.9))){
        //     return 6;
        //     // Is there a need to add a previous criteria check here?
        //
        // } else if ((this.bloodGasPH > 7.15) && (this.baseDeficit<10)){
        //     RECCOMENDATION = false; // Rest of the form doesn't matter here, overrides any other RECCOMENDATION
        //     return 8;
        //   }
    }
}



/**
 * Section 6 - History
 */

// Submit button Logic
 $("#form6").on("click change", function(){
   if($("input:radio[name='s6q1']:checked").val() == 1 ){
     if($("#form6 option[disabled]:selected")){;}
     else{
       return;
     }
   }
   if($("input:radio[name='s6q4']:checked").val() != undefined && $("#apgar").val() != ""){
     $("#submit6").prop("disabled",false);
   }
 });

 function showAcuteHistory(event) {
   console.log(event);
   $('#acuteHistory').collapse('show');
 }

 function hideAcuteHistory() {
   console.log("HIDE");
   $('#acuteHistory').collapse('hide');
 }

 class HistorySection {
     constructor() {
       this.acuteEventHistory = $("input:radio[name='hist1']:checked").val(); // History of an acute event? (Yes or No)
       this.apgarScore = $("#s7q2").val();        // 10 minute Apgar score
       this.ventFromBirth = $("input:radio[name='hist2']:checked").val();     // Ventilation from birth continued for at least 10 min? (yes or no)
       console.log(this.acuteEventHistory, this.apgarScore, this.ventFromBirth);
     }
     //TODO: acute event == 0, apgar <=5, vent ==1 === False
     //TODO: store the acute event data, -> into summary
     validate() {
       $("#submit5").prop("disabled",true);
       // if(this.acuteEventHistory == 1){
       //   if(this.apgarScore<=5 || this.ventFromBirth ==1){
       //     MEETS_CRITERIA.push(5);
       //     //Checks that Inital, seizures, and qualifying and History all meet the criteria to cool
       //     if(MEETS_CRITERIA.length >= 4){
       //       RECCOMENDATION = true;
       //       return 8;
       //     } else {
       //       RECCOMENDATION = false;
       //       return 8;
       //     }
       //   } else {
       //     RECCOMENDATION = false; // Ignore the rest of the form, Do not cool
       //     return 8;
       //   }
       // } else if (this.acuteEventHistory == 0 && this.apgarScore>5 && this.ventFromBirth ==0) {
       //   RECCOMENDATION = false;
       // }
       return 7;
     }
 }



//******************************************************************************
$("form").submit(function(event){
  event.preventDefault();
  sectionNum = $(this).closest("form").attr("id").slice(-1);
  console.log(sectionNum);
  section = getSection(parseInt(sectionNum));

  nextPage = section.validate();
  if(nextPage == 7) {
      showResults();
  } else {
      navigateForward(nextPage);
  }
});
