var PAGES = [1,]
var RECCOMENDATION = null;
var UPDATED = 0; // When was the Reccomendation last updated
//TODO: Make it so that going "Back" will remove stuff from MEETS_CRITERIA
var MEETS_CRITERIA = [];

var REASONS = [];

function navigateForward(to) {
    PAGES.push(to);
    let form = "#form" + to;
    $(form).fadeIn();

    //Scrolling animation to next section
    $('html, body').animate({
        scrollTop: $(form).offset().top
    }, 500);
}

function navigateBack() {
    let last = PAGES.pop();
    let form = "#form" + last;
    $(form).fadeOut();
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
            return new BloodGasSection2();
            break;
        case 7:
            return new HistorySection();
            break;
    }
}

function showResults() {

  for(let reason of REASONS){
    console.log(reason);
    $("#reasons").append('<li class="collection-item">'+reason+'</li>');
  }
    console.log(RECCOMENDATION);
    if(RECCOMENDATION == true){
      $("#result span").attr("id","cool");
      $("#result span").html('Initiate Therapeutic Hypothermia');
      // $("#result p span").html('Based on our criteria, our recommendation is: Initiate therapeutic hypothermia for the following reasons:');
    }
    $("#result").fadeIn();
}

function showSummary() {

  // Need to add logic to create a summary paragraph later
    $("#summary").fadeToggle(150);
    $("#showSummary").css("color", "purple");
}
/**
 ** Section 1 **
 **/
class InitialSection {
    constructor() {
        this.perinatalEvent = parseInt($("input:radio[name='s1q1']:checked").val());
        console.log("PERINATAL",this.perinatalEvent);
    }

    validate() {
        if(this.perinatalEvent) {
          MEETS_CRITERIA.push(1);
          return 2;
        }
        else {
          UPDATED =1;
          RECCOMENDATION = false;
          REASONS.push("Neonates condition is not suggestive of Encephalopathy.");
          return 8;
        }
    }
}

/**
 ** Section 2: Seizures **
 **/
class NeurologicSection {
    constructor() {
        this.hasSeizures = $("input:radio[name='s2q1']:checked").val();
        console.log("SEIZURES: ", this.hasSeizures);
    }

    validate() {

      if(this.hasSeizures == 1) {
        RECCOMENDATION=true;
        MEETS_CRITERIA.push(2);
        // Meets criteria
        // UPDATED = 2;
        return 4;
      }
      else { return 3; }
    }
}

/**
 ** Section 3: SARNAT **
 **/
class SarnatSection {
    constructor() {
      this.points = 0;
    }

    validate() {
      //Breaking into categories
      //Categories 1 and 2
      for (var i = 1; i <= 2; i++) {
        if($("input:radio[name='question"+i+"']:checked").val() >=3) {
          this.points++;
        }
      }
      //Category 3
      for (var i = 3; i <= 5; i++) {
        if($("input:radio[name='question"+i+"']:checked").val() >=3) {
          this.points++;
          break;
        }
      }
      //Category 4
      for (var i = 6; i <= 8; i++) {
        if($("input:radio[name='question"+i+"']:checked").val() >=3) {
          this.points++;
          break;
        }
      }
      //Category 5
      for (var i = 9; i <= 10; i++) {
        if($("input:radio[name='question"+i+"']:checked").val() >=3) {
          this.points++;
          break;
        }
      }
      console.log(this.points);
      //Points system
      if (this.points>=3) {
        RECCOMENDATION = true;
        MEETS_CRITERIA.push(2); // Either nuero is yes, or SARNAT is, not both
      } else{
        RECCOMENDATION = false;
        UPDATED = 3;
      }

      return 4;
    }
}

/**
 ** Section 4: Qualifying Questions **
 **/
class QualifyingSection {
    constructor() {
        this.is36WksOrOlder = $("input:radio[name='s4q1']:checked").val();
        this.is6HrsOrYounger = $("input:radio[name='s4q2']:checked").val();
        this.is1800gOrMore = $("input:radio[name='s4q3']:checked").val();
        this.hasCongenitalAbnormalities = $("input:radio[name='s4q4']:checked").val();
        this.hasChromosomalAbnormalities = $("input:radio[name='s4q5']:checked").val();
        this.hasAlternateCauseForEnceph = $("input:radio[name='s4q5']:checked").val();
    }

    validate() {
      if(this.is36WksOrOlder == 1 && this.is6HrsOrYounger==1 && this.is1800gOrMore==1
        && this.hasCongenitalAbnormalities==1 && this.hasChromosomalAbnormalities==1
        && this.hasAlternateCauseForEnceph==1){
          RECCOMENDATION = true;
          MEETS_CRITERIA.push(3);
          return 5;
      }
      else {
          RECCOMENDATION = false;
          UPDATED = 4;
        }
        return 5;
    }
}

/**
 ** Section 5: Blood Gas: Part I **
 **/
class BloodGasSection {
    constructor() {
        this.isAvailableBloodGasPH = $("input:radio[name='s5q1']:checked").val();
        console.log(this.isAvailableBloodGasPH);
    }

    validate() {
        if (this.isAvailableBloodGasPH == 1) { return 6;}
        else { return 7; }
    }
}

/**
 ** Section 6: Blood Gas: Part II **
 **/
class BloodGasSection2 {
    constructor() {
        this.bloodGasPH = parseFloat($("#s6q1").val());
        this.baseDeficit= parseFloat($("#s6q2").val());
        console.log("Blood ", this.bloodGasPH, "Base ", this.baseDeficit);
    }

    validate() {
        if ((this.bloodGasPH <= 7) || (this.baseDeficit>=16)){
          MEETS_CRITERIA.push(4);
          //Checks that Inital, seizures, and qualifying and blood gas all meet the criteria to cool
          if(MEETS_CRITERIA.length >= 4){
            RECCOMENDATION = true;
            return 8;
          } else {
            RECCOMENDATION = false;
            return 8;
          }
        }
        else if (((this.bloodGasPH >7) && (this.bloodGasPH<=7.15))
                  || ((this.baseDeficit>10)&&(this.baseDeficit<=15.9))){
          return 7;
        }
        else if ((this.bloodGasPH > 7.15) && (this.baseDeficit<10)){
          RECCOMENDATION = false; // Rest of the form doesn't matter here, overrides any other RECCOMENDATION
          return 8;
        }
    }
}

/**
 ** Section 7: History Questions **
 **/
class HistorySection {
    constructor() {
      this.acuteEventHistory = $("input:radio[name='hist1']:checked").val(); // History of an acute event? (Yes or No)
      this.apgarScore = $("#s7q2").val();        // 10 minute Apgar score
      this.ventFromBirth = $("input:radio[name='hist2']:checked").val();     // Ventilation from birth continued for at least 10 min? (yes or no)
      console.log(this.acuteEventHistory, this.apgarScore, this.ventFromBirth);
    }

    validate() {
      if(this.acuteEventHistory == 1){
        if(this.apgarScore<=5 || this.ventFromBirth ==1){
          MEETS_CRITERIA.push(5);
          //Checks that Inital, seizures, and qualifying and History all meet the criteria to cool
          if(MEETS_CRITERIA.length >= 4){
            RECCOMENDATION = true;
            return 8;

          }
        } else {
          RECCOMENDATION = false; // Ignore the rest of the form, Do not cool
          return 8;
        }
      } else if (this.acuteEventHistory == 0 && this.apgarScore>5 && this.ventFromBirth ==0) {
        RECCOMENDATION = false
      }
      return 8;
    }
}

$("#s7q1y").click(function() {
  $(".acute-event").fadeIn();
});
$("#s7q1n").click(function() {
  $(".acute-event").fadeOut();
});

/** Section 8 : Results **/


$("form").submit(function( event ) {
    event.preventDefault();
    sectionNum = $(this).closest("form").attr("id").slice(-1);
    console.log("r",RECCOMENDATION);
    console.log("m",MEETS_CRITERIA);

    section = getSection(parseInt(sectionNum));
    nextPage = section.validate();
    if(nextPage == 8) {
        showResults();
    } else {
        navigateForward(nextPage);
    }
});

$(".back").click(function( event ) {
    event.preventDefault();
    console.log("BACK");
    navigateBack();
});

$("#showSummary").click(function() {
  console.log("Summary link")
  showSummary();
})

$("#restart").click(function() {
  window.location.reload();
  console.log("form restart");
})
