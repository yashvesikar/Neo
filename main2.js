var PAGES = [1,]

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
    $("#result").fadeIn();
}

/**
 ** Section 1 **
 **/
class InitialSection {
    constructor() {
        this.perinatalEvent = parseInt($("input:radio[name='s1q1']:checked").val());
    }

    validate() {
        if(this.perinatalEvent) { return 2; }
        else { return 8; }
    }
}

/**
 ** Section 2: Seizures **
 **/
class NeurologicSection {
    constructor() {
        this.hasSeizures = $("input:radio[name='s1q2']:checked").val();
    }

    validate() {
        if(this.hasSeizures) { return 4; }
        else { return 3; }
    }
}

/**
 ** Section 3: SARNAT **
 **/
class SarnatSection {
    constructor() {
    }

    validate() {
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
        return 5;
    }
}

/**
 ** Section 5: Blood Gas: Part I **
 **/
class BloodGasSection {
    constructor() {
        this.isAvailableBloodGasPH = $("input:radio[name='s5q1']:checked").val();
    }

    validate() {
        if (this.isAvailableBloodGasPH) { return 6;}
        else { return 7; }
    }
}

/**
 ** Section 6: Blood Gas: Part II **
 **/
class BloodGasSection2 {
    constructor() {
        this.bloodGasPH = parseFloat($("#s5q2").val());
        this.baseDeficit= parseFloat($("#s5q3").val());
    }

    validate() {
        if ((bloodGasPH <= 7) || (baseDeficit>=16)){ return 8;}
        else if (((bloodGasPH >7) && (bloodGasPH<=7.15)) || ((baseDeficit>10)&&(baseDeficit<=15.9))){ return 7; }
        else if ((bloodGasPH > 7.15) || (baseDeficit<10)){ return 8; }
    }
}

/**
 ** Section 7: History Questions **
 **/
class HistorySection {
    constructor() {
    }

    validate() {
        return 8;
    }
}

/** Section 8 : Results **/


$("form").submit(function( event ) {
    event.preventDefault();
    sectionNum = $(this).closest("form").attr("id").slice(-1);
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
