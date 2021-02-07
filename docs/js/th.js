CUR_DAY = 0;

function calcAB(n) {
  return Math.floor(n/10) + 1;
}

function autocalculateAB() {
  v = $("#th-stat").val();
  if (v === "") {
    return;
  }
  stat = parseInt(v);
  ab = calcAB(stat);
  $("#th-ab").val(ab);
}

function getAllInputs(prefix) {
  inputs = {}
  $("."+prefix+"-input input:text").each(function() {
    v = $(this).val();
    if (v === "") {
      return;
    } 
    inputs[this.id] = parseInt(v);
  });
  return inputs;
}

function stringifySum(base, dice) {
  if (dice < 0) {
    dice = - dice;
    return base + " - " + dice;
  }
  return base + " + " + dice;
}

function addResultsToLog(days, roll, result) {
  $('#th-log tr:last').after('<tr><td>' + days + '</td>'+
                                 '<td>' + roll + '</td>'+
                                 '<td>' + result + '</td></tr>');
}

function doOneDay() {
  inputs = getAllInputs("th");
  if (Object.entries(inputs).length !== 9) {
    alert("Not all fields are filled in, or there is a datatype error. Fix and try again. Sorry for using alerts, but I didn't have a lot of patience to find a better way to do data validation.");
    return;
  }
  // now all inputs are ints and we have the correct fields hopefully.
  stat = inputs["th-stat"];
  stat += inputs["th-mod"];
  prep = Math.min(inputs["th-ab"], inputs["th-numprep"]); // No benefit going above AB.
  stat += 2*prep;

  CUR_DAY += 1;
  if (inputs["th-numprep"] === 0) {
    days = "Day " + CUR_DAY;
  } else {
    days = "Days " + CUR_DAY + "-" + (CUR_DAY + inputs["th-numprep"]);
  }
  CUR_DAY += inputs["th-numprep"];

  // TODO: I would like this to allocate tags over the whole project, but I don't really know how to do that yet since we don't have an idea of how long the project is (estimate?) and also we aren't adjusting completions yet.
  if (inputs["th-numtags"] > 0) {
    stat += inputs["th-numtags"] * inputs["th-ab"];
    // Reduce the number of tags available by one.
    // $("#th-numtags").val(inputs["th-numtags"]-1);
  }

  tn_dice = dice();
  tn = inputs["th-success"] + tn_dice;
  tn_roll = stringifySum(inputs["th-success"], tn_dice); 

  ch_dice = dice();
  fp = inputs["th-numfp"]
  while (ch_dice <= inputs["th-threshold"] && fp > 0) {
    fp -= 1;
    ch_dice = dice();
  }
  $("#th-numfp").val(fp);
  
  total = stat + ch_dice;
  ch_roll = stringifySum(stat, ch_dice);
  roll = ch_roll + " vs " + tn_roll;

  if (total - tn >= 0) {
    result = "Success!<br>" + (total - tn);
  } else {
    fm_dice = dice();
    if (fm_dice >= 12) {
      tag = "Nothing bad!<br>";
    } else if (fm_dice >= 6) {
      tag = "Loss of completion!<br>";
    } else if (fm_dice >= -3) {
      tag = "Hidden flaw!<br>";
    } else if (fm_dice >= -9) {
      tag = "External fracture!<br>";
    } else {
      tag = "Internal fracture!<br>";
    } 
    result = tag + (total - tn);
  }

  addResultsToLog(days, roll, result);
}

function getCompletion() {
  v = $("#th-completion").val();
  if (v === "") {
    return undefined;
  }
  return parseInt(v);
}

function doFullProject() {
  c = getCompletion();
  if (c === undefined || c === 0) {
    alert("Sorry for using alerts, but you can't do a full project if the completion is 0.")
    return;
  }
  while (c > 0) {
    doOneDay();
    c = getCompletion();
  }
}


$(document).ready(() => {
  // Assign listeners
  autoABlistener = $("#th-stat").change(function() {
    autocalculateAB();
  });


  $("#th-autoab").change(function() {
    if (this.checked) {
      autocalculateAB();
      $("#th-stat").change(function() {
        autocalculateAB();
      });
      $("#th-ab").prop("disabled", true);
    } else {
      autoABlistener.off()
      $("#th-ab").prop("disabled", false);
    }
  });
});
