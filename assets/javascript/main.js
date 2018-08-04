/**
 *
 * Author: Yash Vesikar
 * Neonatal Encephalopathy Cooling Guidelines Calculator
 * Childrens Hospital of Wisconsin
 *
 */

var PAGES = [];
var RECCOMENDATION = null;
var REASONS = [];
var RESULT = {};
/**
 * Information Section
 */
function show(event){
    let targets = ["Ref", "Ack", "Perils", "Why", "What"]
    targets.forEach(t => {

        if (t + "Button" === event.target.id){
            $("#"+t).collapse('toggle');
        } else {
            $("#"+t).collapse('hide');
            $("#"+t+'Button').removeClass("active");
            $("#"+t+'Button').removeClass("focus");
        }
    })

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
      if (this.perinatalEvent === undefined){
        return null;
      }
      $("#submit1").prop("disabled",true);
      if(this.perinatalEvent === 1) {
        this.meetsCriteria = true;
        return 2;
      }
      else {
        RECCOMENDATION = false;
        this.reasons.push("Neonate's condition is not suggestive of encephalopathy.");
        return 7;
      }

    }
}

/**
 * Section 2 - Nuerological Questions
 */
 $("label[name='s2q1_label']").click(function() {
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
       this.reasons = [];
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
       return {"s3q1":this.encephalopathy,
               "s3q2": this.points
              };
     }

     validate() {
       this.reasons = [];
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
         this.reasons.push("The neonate does not meet criteria for moderate/severe encephalopathy");
       } else if (this.points>=3) {
         RECCOMENDATION = true;
         this.meetsCriteria = true;// Either nuero is yes, or SARNAT is, not both
         this.encephalopathy = "moderate/severe";
       } else {
         this.encephalopathy = "normal"
         this.reasons.push("The neonate does not meet criteria for moderate/severe encephalopathy");
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
        "s4q1":parseInt($("input:radio[name='s4q1']:checked").val()),
        "s4q2":parseInt($("input:radio[name='s4q2']:checked").val()),
        "s4q3":parseInt($("input:radio[name='s4q3']:checked").val()),
        "s4q4":parseInt($("input:radio[name='s4q4']:checked").val()),
        "s4q5":parseInt($("input:radio[name='s4q5']:checked").val()),
        "s4q6":parseInt($("input:radio[name='s4q6']:checked").val())
      };
    }

    validate() {
      this.reasons = [];
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
      else if ( num == 2){return "The infant is greater than 6 hours old."}
      else if ( num == 3){return "The infants birth weight is less than 1800g."}
      else if ( num == 4){return "The infant suffers from congenital abnormalities."}
      else if ( num == 5){return "The infant suffers from chromosomal abnormalities."}
      else if ( num == 6){return "There is an alternate cause for encephalopathy."}
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
  $('#bloodgas2').collapse('show');
}

function hideBloodGas() {
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
        "s5q1": parseInt(this.isAvailableBloodGasPH),
        "s5q2":parseFloat($("#baseDeficit").val()),
        "s5q3":parseFloat($("#pH").val()),
      }
    }

    validate() {
      this.reasons = [];
      this.isAvailableBloodGasPH = $("input:radio[name='s5q1']:checked").val();
      $("#submit5").prop("disabled",true);
        
        if(this.isAvailableBloodGasPH == 1){  // This checks if the blood gas or base defecit is available ( yes/no button )
          // If available then I collect the values here: 
          this.bloodGasPH = parseFloat($("#pH").val());  
          this.baseDeficit= parseFloat($("#baseDeficit").val());

          // The reason it is skipping the history section is here: 
          // (bloodgas <= 7 or basedef >= 16)
          if ((this.bloodGasPH <= 7) || (this.baseDeficit>=16)){
            this.meetsCriteria = true;
            if(this.meetsCriteria && this.previousCriteria){
              RECCOMENDATION = true;
            } else {
              RECCOMENDATION = false;
            }
            return 7;
          } 

          // Check number 2: (bloodGas > 7 and bloodGas < 7.15) or (basedef > 10 and basedef <= 15.9)
          else if (((this.bloodGasPH >7) && (this.bloodGasPH<=7.15)) || ((this.baseDeficit>=10)&&(this.baseDeficit<=15.9))){
              return 6;
          } 

          // Check number 3: (bloodgas> 7.15 and basedef < 10)
          else if ((this.bloodGasPH > 7.15) && (this.baseDeficit < 10)){
              this.reasons.push("The cord or postnatal blood gas pH is greater than 7.15 and the base deficit is less than -10 mEq/L.");
              RECCOMENDATION = false; // Rest of the form doesn't matter here, overrides any other RECCOMENDATION
              return 7;
            }
        } 
        // If the blood gas or base def is not available continue to the history section. 
        else {
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
   $('#acuteHistory').collapse('show');
 }

 function hideAcuteHistory() {
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
         "s6q1":parseInt(this.acuteEventHistory),
         "s6q2":this.acuteEvent,
         "s6q3":this.apgarScore,
         "s6q4":parseInt(this.ventFromBirth)
       }
     }

     //TODO: store the acute event data, -> into summary
     validate() {
       this.reasons = [];
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
           this.reasons.push("The 10 minute Apgar score is greater than 5 and the infant was not mechanically ventilated from birth for at least 10 minutes.")

           RECCOMENDATION = false; // Ignore the rest of the form, Do not cool
         }
       } else {
         this.reasons.push("There is no history of an acute event.")
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
    // Qualifying question 1 
    if(values.s1q1 == true){
      // Siezures questions
      if( values.s2q1 ){ summary = "Patient presents with seizures."} 
      else {  // Sarnat 
        // Normal Sarnat
        if( values.s3q2 == 0 ){summary = "Patient's neurological exam is normal according to Sarnat staging."}
        // Mild sarnat
        else if (values.s3q2 < 3 ){summary = "Patient meets criteria for mild encephalopathy according to Sarnat staging."}
        // Severe sarnat
        else{summary = "Patient meets criteria for moderate/severe encephalopathy according to Sarnat staging."}
      }
      //Qualifying questions 2 
      summary += ` The infant's gestational age is ${values.s4q1 ? "" : "not" } greater than 36 weeks, the infant is ${values.s4q2 ? "less than" : "greater than" } 6 hours old, the infant's birth weight is ${values.s4q3 ? "" : "not" } greater than 1800g, the infant has ${values.s4q4 ? "no" : "" } congenital abnormalities, has ${values.s4q5 ? "no" : "" } chromosomal anomalies, and there is ${values.s4q6 ? "no" : "" } alternate cause for encephalopathy.`
      // Blood Gas questions
      if(values.s5q1 && values.s5q3 && values.s5q2){
        summary +=  ` The cord or postnatal blood gas pH within 1hr of birth is ${values.s5q3} and the base deficit is -${values.s5q2} mEq/L.`        
      } else {
        summary += " Biochemical data is unavailable."
      }
      // History section
      if(values.s6q1){ summary += ` There is history of an acute event - ${values.s6q2}.`}
      else if (values.s6q1 == false && values.s6q1 != undefined){summary += " There is no history of an acute event."}
      if(values.s6q3){ summary += ` The 10 minute Apgar score is ${values.s6q3}, and the patient ${values.s6q4 ? "was" : "was not mechanically"} ventilated from birth for at least 10 minutes.`}

    } else {
      summary = "Neonate’s condition is not suggestive of encephalopathy.";
    }

    // return values;
    return summary;
  }


  show(){

    this.reasons = [];
    $("#reasons, #recommendation").empty(); // Empties the reasons and recommendation

    $("#result").fadeIn(); // Fades in Result section
    $('html, body').animate({
        scrollTop: $("#result").offset().top
    }, 500);

    if(this.recommendation == true){
      $("#recommendation").css("color","blue");
      $("#recommendation").html("DOES");
      $("#recommendation2").html(".")
    } else {
      $("#recommendation").css("color","red");
      $("#recommendation").html("DOES NOT");
      $("#recommendation2").html(" for the following reasons.")

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
NProgress.configure({ showSpinner: false });
// Submit Logic
$("form").submit(function(event){
  event.preventDefault();
  sectionNum = parseInt($(this).closest("form").attr("id").slice(-1));
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

      NProgress.set(1/7);

        PAGES.push(section1);
      break;
    case 2:
      try {
        nextPage = section2.validate();
        PAGES = PAGES.slice(0);
        $("#form3, #form4, #form5, #form6, #result").css("display", "none");
      } catch(err) {
        section2 = new NeurologicSection();
        nextPage = section2.validate();
      }
        PAGES.push(section2);
        NProgress.set(2/7);
      break;
    case 3:
     try{
       nextPage = section3.validate();
       PAGES = PAGES.slice(0,1);
       $("#form4, #form5, #form6, #result").css("display", "none");
     } catch(err) {
       section3 = new SarnatSection();
       nextPage = section3.validate();
     }
     NProgress.set(3/7);
     PAGES.push(section3);

     break;
    case 4:
      try{
        nextPage = section4.validate();
        /* If there is a problem with the qualifying questions check here first */
        if(PAGES.length === 3){
          PAGES = PAGES.slice(0,1);
        } else {
          PAGES = PAGES.slice(0,2);
        }
       $("#form5, #form6, #result").css("display", "none");
     } catch(err) {
       section4 = new QualifyingSection();
       nextPage = section4.validate();
     }
     PAGES.push(section4);
     NProgress.set(4/7);
     break;
    case 5:
      try{
        nextPage = section5.validate();
        PAGES = PAGES.slice(0,3);
       $("#form6, #result").css("display", "none");
     } catch(err) {
       if(section1.meetsCriteria && (section2.meetsCriteria || section3.meetsCriteria) && section4.meetsCriteria){
         section5 = new BloodGasSection(true);
       } else {
         section5 = new BloodGasSection(false);
       }

       nextPage = section5.validate();
     }
     PAGES.push(section5);
     NProgress.set(5/7);
     break;
    case 6:
      try{
        nextPage = section6.validate();
        PAGES = PAGES.slice(0,4);
     } catch(err) {

       if(section1.meetsCriteria && (section2.meetsCriteria || section3.meetsCriteria) && section4.meetsCriteria){
         section6 = new HistorySection(true);
       } else {
         section6 = new HistorySection(false);
       }
       nextPage = section6.validate();
     }
     PAGES.push(section6);
     NProgress.set(6/7);
     break;
    default:
      break;
  }
  if(nextPage == 7) {
    section7 = new ResultSection(PAGES,RECCOMENDATION);
    section7.show();
    NProgress.done();
  } else {
      let form = "#form" + nextPage;
      $(form).fadeIn();

      //Scrolling animation to next section
      $('html, body').animate({
          scrollTop: $(form).offset().top
      }, 500);
  }
});
