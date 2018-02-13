var PAGES = [];
var RECCOMENDATION = null;
var REASONS = [];
var RESULT = {};
/**
 * Information Section
 */
function showWhat(){
   $('#What').collapse('toggle');
   // $('#How').collapse('hide');
   $('#Perils').collapse('hide');
   $('#PerilsButton').removeClass("active");
   $('#Why').collapse('hide');
   $('#WhyButton').removeClass("active");
   $('#Refrences').collapse('hide');
   $('#RefButton').removeClass("active");

}

function showPerils(){
   $('#Perils').collapse('toggle');
   // $('#Pitfalls').collapse('hide');
   $('#Why').collapse('hide');
   $('#WhyButton').removeClass("active");
   $('#What').collapse('hide');
   $('#WhatButton').removeClass("active");
   $('#Refrences').collapse('hide');
   $('#RefButton').removeClass("active");
}

function showWhy(){
   $('#Why').collapse('toggle');
   // $('#Why').collapse('hide');
   $('#Perils').collapse('hide');
   $('#PerilsButton').removeClass("active");
   $('#What').collapse('hide');
   $('#WhatButton').removeClass("active");
   $('#Refrences').collapse('hide');
   $('#RefButton').removeClass("active");
}

function showRefrences(){
   $('#Refrences').collapse('toggle');
   // $('#Why').collapse('hide');
   $('#Perils').collapse('hide');
   $('#PerilsButton').removeClass("active");
   $('#What').collapse('hide');
   $('#WhatButton').removeClass("active");
   $('#Why').collapse('hide');         
   $('#WhyButton').removeClass("active");
}
//******************************************************************************

/**
 ** Section 1 - Initial Questions **
 **/
$("label[name='s1q1_label']").click(function() {
  $("#submit1").prop("disabled",false);
});

class InitialSection {
    constructor() {
        this.perinatalEvent;
        this.meetsCriteria = false;
        this.reasons = [];
    }

    values(){
      if (this.perinatalEvent ==1){return {"s1q1":true}}
      else{return {"s1q1":false}}

    }

    validate(){
      this.reasons = [];
      this.perinatalEvent = parseInt($("input:radio[name='s1q1']:checked").val());
      $("#submit1").prop("disabled",true);
      if(this.perinatalEvent === 1) {
        this.meetsCriteria = true;
        return 2;
      }
      else {
        RECCOMENDATION = false;
        this.reasons.push("Neonates condition is not suggestive of Encephalopathy.");
        return 7;
      }

    }
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
         this.hasSeizures;
         this.meetsCriteria = false;
         this.reasons = [];

     }

     values(){
       if (this.hasSeizures ==1){return {"s2q1":true}}
       else{return {"s2q1":false}}
     }

     validate() {
       this.hasSeizures = $("input:radio[name='s2q1']:checked").val();
       $("#submit2").prop("disabled",true);
       if(this.hasSeizures == 1) {
         this.meetsCriteria = true;
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
$("#form3 select").on('input change',function(){
      // console.log($("select[name='question1']").val());
      if($('#form3 option[disabled]:selected').length == 0 ){
         // ALL the select boxes have something selected rather than the default option
         $("#submit3").prop("disabled",false);
      }
   });

 class SarnatSection {
     constructor() {
       this.points = 0;
       this.meetsCriteria = false;
       this.reasons = [];
       this.encephalopathy;
     }

     values() {
       return {"s3q1":this.encephalopathy};
     }

     validate() {
       this.point = 0;
       $("#submit3").prop("disabled",true); // Disable submit button
       //Breaking into categories

       // Catagory 1 -- Conciousness
       if($("select[name='question1']").val() >=3) {
         this.points++;
       }
       // Catagory 2 -- Spontaneous Activity -- spontaneous activity is its own group
       if($("select[name='question2']").val() >=3) {
         this.points++;
       }

       //Category 3 -- NM Control -- Cat3 is NM control q(3,4)
       for (var i = 3; i <= 4; i++) {
         if($("select[name='question"+i+"']").val() >=3) {
           this.points++;
           break;
         }
       }

       //Category 4 -- Primitive -- Cat4 Primitive q(5,6)
       for (var i = 5; i <= 6; i++) {
         if($("select[name='question"+i+"']").val() >=3) {
           this.points++;
           break;
         }
       }

       //Category 5 -- Automatic -- Cat 5 Autonomic q(7,8,9)
       for (var i = 7; i <= 9; i++) {
         if($("select[name='question"+i+"']").val() >=3) {
           this.points++;
           break;
         }
       }

       //Points system
       // TODO: Add mild encephalopathy check with 1=>points <=2 points
       if (this.points == 1 || this.points == 2){
         this.encephalopathy = "mild";
       } else if (this.points>=3) {
         RECCOMENDATION = true;
         this.meetsCriteria = true;// Either nuero is yes, or SARNAT is, not both
         this.encephalopathy = "moderate/severe";
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
  if(answered == 6){
    $("#submit4").prop("disabled",false);
  }
});

class QualifyingSection {
    constructor() {
        this.reasons = [];
        this.meetsCriteria = false;
    }

    values() {
      return {
        "s4q1":$("input:radio[name='s4q1']:checked").prop("checked"),
        "s4q2":$("input:radio[name='s4q2']:checked").prop("checked"),
        "s4q3":$("input:radio[name='s4q3']:checked").prop("checked"),
        "s4q4":$("input:radio[name='s4q4']:checked").prop("checked"),
        "s4q5":$("input:radio[name='s4q5']:checked").prop("checked"),
        "s4q6":$("input:radio[name='s4q6']:checked").prop("checked")
      };
    }

    validate() {
      $("#submit4").prop("disabled",true);
      let checked = 0;
      for(let i = 1; i!=7; ++i){
        if($("input:radio[name='s4q"+i+"']:checked").val() == 1){
          checked++;
          continue;
        } else {
          // this.reasons.push($("#s4q"+i+" p").html());
          this.reasons.push(this._reasons(i));
        }
      }
      // If all qualifying questions are yes
      if(checked == 6){
          RECCOMENDATION = true;
          this.meetsCriteria = true;
      } else {
          RECCOMENDATION = false;
        }
        return 5;
    }

    _reasons(num){
      if(num == 1){return "The infant's gestational age is less than 36 weeks."}
      else if ( num == 2){return "The infant is less than 6 hours old."}
      else if ( num == 3){return "The infants birth weight is less than 1800g."}
      else if ( num == 4){return "The infant suffers from congenital abnormalities"}
      else if ( num == 5){return "The infant suffers from chromosomal abnormalities"}
      else if ( num == 6){return "The infant suffers from alternate causes for encephalopathy"}
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
    constructor(previousCriteria) {
      this.isAvailableBloodGasPH;
      this.bloodGasPH;
      this.baseDeficit;
      this.reasons = [];
      this.meetsCriteria = false;
      this.previousCriteria = previousCriteria;
    }

    values(){
      return {
        "s5q1":$("input:radio[name='s5q1']:checked").prop("checked"),
        "s5q2":parseFloat($("#baseDeficit").val()),
        "s5q3":parseFloat($("#pH").val()),
      }
    }

    validate() {
      this.isAvailableBloodGasPH = $("input:radio[name='s5q1']:checked").val();
      $("#submit5").prop("disabled",true);
        if(this.isAvailableBloodGasPH == 1){
          this.bloodGasPH = parseFloat($("#pH").val());
          this.baseDeficit= parseFloat($("#baseDeficit").val());
          if ((this.bloodGasPH <= 7) || (this.baseDeficit>=16)){
            this.meetsCriteria = true;
            console.log("BLOOD GAS PAGES: ",PAGES);
            if(this.meetsCriteria && this.previousCriteria){
              RECCOMENDATION = true;
              console.log("Both criteria qualify: ", this.meetsCriteria,"prev: ", this.previousCriteria);
            } else {
              RECCOMENDATION = false;
              console.log("Does not qualify: ", this.meetsCriteria,"prev: ", this.previousCriteria);
            }
            return 7;
          } else if (((this.bloodGasPH >7) && (this.bloodGasPH<=7.15))
                    || ((this.baseDeficit>10)&&(this.baseDeficit<=15.9))){
              return 6;
              // Is there a need to add a previous criteria check here?
          } else if ((this.bloodGasPH > 7.15) && (this.baseDeficit<10)){
              RECCOMENDATION = false; // Rest of the form doesn't matter here, overrides any other RECCOMENDATION
              return 7;
            }
        } else {
          return 6;
        }

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
     constructor(previousCriteria) {
       this.acuteEventHistory;
       this.acuteEvent;
       this.apgarScore;        // 10 minute Apgar score
       this.ventFromBirth;     // Ventilation from birth continued for at least 10 min? (yes or no)
       this.reasons = [];
       this.meetsCriteria = false;
       this.previousCriteria = previousCriteria;
     }

     values() {
       return {
         "s6q1":this.acuteEventHistory,
         "s6q2":this.acuteEvent,
         "s6q3":this.apgarScore,
         "s6q4":this.ventFromBirth
       }
     }

     //TODO: store the acute event data, -> into summary
     validate() {
       this.acuteEventHistory = $("input:radio[name='s6q1']:checked").val(); // History of an acute event? (Yes or No)
       this.apgarScore = parseInt($("#apgar").val());        // 10 minute Apgar score
       this.ventFromBirth = $("input:radio[name='s6q4']:checked").val();     // Ventilation from birth continued for at least 10 min? (yes or no)
       $("#submit5").prop("disabled",true);
       if(this.acuteEventHistory == 1){
         this.acuteEvent = $("#acute option:selected").text();
         if(this.apgarScore<=5 || this.ventFromBirth ==1){
           // MEETS_CRITERIA.push(5);
           this.meetsCriteria = true;
           //Checks that Inital, seizures, and qualifying and History all meet the criteria to cool
           if(this.meetsCriteria && this.previousCriteria){
             RECCOMENDATION = true;
           } else {
             RECCOMENDATION = false;
           }
         } else {
           RECCOMENDATION = false; // Ignore the rest of the form, Do not cool
         }
       } else {
         RECCOMENDATION = false;
       }
       return 7;
     }
 }
/**
 * Section 7 - Result Section **
 */

 $("#restart").click(function() {
   window.location.reload();
 });

class ResultSection{
  constructor(pages,recommendation){
    this.pages = pages;
    this.recommendation = recommendation;
    this.reasons = [];
  }
  createSummary(){

    let values = {}
    for(let sec of this.pages){
      $.extend(values,sec.values());
    }

    let summary;
    if(values.s1q1 == true){
      summary = `${values.s3q1 ? "Patient presented with seizures." : "Patient not presented with seizures."}
       The patient's gestational age is ${values.s4q1 ? "greater than" : "less than" } 36 weeks, is ${values.s4q2 ? "greater than" : "less than" } 6 hours old, the infants birth weight is ${values.s4q3 ? "greater than" : "less than" } 1800g, the infant has ${values.s4q4 ? "no" : "a" } congenital abnormalities, has ${values.s4q5 ? "no" : "a" } chromosomal anomalies, and there is ${values.s4q6 ? "no" : "some" } alternate cause for encephalopathy.
       ${values.s5q1 ? `The cord blood gas pH within 1hr of age is ${values.s5q3} and the base deficit is ${values.s5q2}.` : "" }
       ${values.s6q1 ? `There is a history of an acute event - ${values.s6q2}` : "Biochemical data unavailable and no history of an acute event." }, the 10 minute Apgar score is ${values.s6q3}, and the patient ${values.s6q4 ? "was" : "was not"} ventilated from birth for at least 10 minutes.`
    } else {
      summary = "Neonate’s condition is not suggestive of encephalopathy.";
    }

    // return values;
    return summary;
  }


  show(){

    this.reasons = [];
    // console.log("VALUES: ",this.createSummary());
    $("#reasons, #recommendation").empty(); // Empties the reasons and recommendation

    $("#result").fadeIn(); // Fades in Result section
    $('html, body').animate({
        scrollTop: $("#result").offset().top
    }, 500);


    if(this.recommendation == true){
      $("#recommendation").css("color","blue");
      $("#recommendation").html("does");
    } else {
      $("#recommendation").css("color","red");
      $("#recommendation").html("does not");

      for( let sec of this.pages){
        for(let reason of sec.reasons){
          this.reasons.push(reason)
        }
      }
      for( let reason of this.reasons){
        $("#reasons").append("<li>"+reason+"</li>");
      }

    }
    let summary = this.createSummary()
    $("#summary").html(summary);
     // "This patient meets (or does not meet) the criteria based on the literature to initiate therapeutic hypothermia. Presence of moderate/severe encephalopathy based on Sarnat. The patient's gestational age is > or < 36 weeks, is > or < 6 hours old, > or < 1800g, has no congenital abnormalities, has no chromosomal anomalies, and there is no alternate cause for encephalopathy. The cord blood gas pH within 1hr of age is 7.1 and the base deficit is -12. There is no history of an acute event - cord prolapse, the 10 minute Apgar score is 4, and the patient was not ventilated from birth for at least 10 minutes."


  }
}

//******************************************************************************
var section1;
var section2;
var section3;
var section4;
var section5;
var section6;
// Submit Logic
$("form").submit(function(event){
  event.preventDefault();
  sectionNum = parseInt($(this).closest("form").attr("id").slice(-1));
  console.log("Section: ",sectionNum);
  var nextPage;

  switch (sectionNum) {
    case 1:
      try {
        nextPage = section1.validate();
        PAGES = [];
        $("#form2, #form3, #form4, #form5, #form6, #result").css("display", "none");
      } catch(err) {

        section1 = new InitialSection();
        nextPage = section1.validate();
      }
      PAGES.push(section1);
      break;
    case 2:
      try {
        nextPage = section2.validate();
        PAGES = PAGES.slice(0,1);
        $("#form3, #form4, #form5, #form6").css("display", "none");
      } catch(err) {
        section2 = new NeurologicSection();
        nextPage = section2.validate();
      }
      PAGES.push(section2);
      break;
    case 3:
     try{
       nextPage = section3.validate();
       PAGES = PAGES.slice(0,2);
       $("#form4, #form5, #form6").css("display", "none");
     } catch(err) {
       section3 = new SarnatSection();
       nextPage = section3.validate();
     }
     PAGES.push(section3);
     break;
    case 4:
      try{
        nextPage = section4.validate();
        if(PAGES.length === 3){
          PAGES = PAGES.slice(0,2);
        } else {
          PAGES = PAGES.slice(0,3);
        }
       $("#form5, #form6").css("display", "none");
     } catch(err) {
       section4 = new QualifyingSection();
       nextPage = section4.validate();
     }
     PAGES.push(section4);
     break;
    case 5:
      try{
        nextPage = section5.validate();
        PAGES = PAGES.slice(0,4);
       $("#form6").css("display", "none");
     } catch(err) {
       if(section1.meetsCriteria && (section2.meetsCriteria || section3.meetsCriteria) && section4.meetsCriteria){
         section5 = new BloodGasSection(true);
       } else {
         section5 = new BloodGasSection(false);
       }

       nextPage = section5.validate();
     }
     PAGES.push(section5);
     break;
    case 6:
      try{
        nextPage = section6.validate();
        PAGES = PAGES.slice(0,5);
     } catch(err) {

       if(section1.meetsCriteria && (section2.meetsCriteria || section3.meetsCriteria) && section4.meetsCriteria){
         section6 = new HistorySection(true);
       } else {
         section6 = new HistorySection(false);
       }
       nextPage = section6.validate();
     }
     PAGES.push(section6);
     break;
    default:
      console.log("Switch Default");
      break;
  }
  console.log("NEXT PAGE: ",nextPage);
  console.log("PAGES: ", PAGES);
  if(nextPage == 7) {
    section7 = new ResultSection(PAGES,RECCOMENDATION);
    section7.show();
  } else {
      let form = "#form" + nextPage;
      $(form).fadeIn();

      //Scrolling animation to next section
      $('html, body').animate({
          scrollTop: $(form).offset().top
      }, 500);
  }
});
