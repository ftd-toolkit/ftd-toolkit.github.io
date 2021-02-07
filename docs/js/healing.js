CUR_DAY = 0

function addResultsToLog(days, roll, result) {
  $('#hd-log tr:last').after('<tr><td>' + days + '</td>'+
                                 '<td>' + roll + '</td>'+
                                 '<td>' + result + '</td></tr>');
}

function healFixedDays() {
  inputs = getAllInputs("hd");
  if (Object.entries(inputs).length !== 7) {
    alert("Not all fields are filled in, or there is a datatype error. Fix and try again. Sorry for using alerts, but I didn't have a lot of patience to find a better way to do data validation.");
    return;
  }
  // now all inputs are ints and we have the correct fields hopefully

  if (inputs["hd-days"] < 1) {
    return;
  }

  CUR_DAY += 1;
  if (inputs["hd-days"] === 1) {
    days = "Day " + CUR_DAY;
  } else {
    days = "Days " + CUR_DAY + "-" + (CUR_DAY + inputs["hd-days"] - 1);
  }
  CUR_DAY += inputs["hd-days"] - 1;

  roll = "Currently unused..."
  tn = inputs["hd-injury"];
  severity = inputs["hd-severity"];
  total_healed = 0;
  total_med = 0;
  for (i = 0; i < inputs["hd-days"]; i++) {
    // Do base-level healing.
    healed = ($("#hd-rest").is(":checked") ? 10 : 0);
    check = inputs["hd-stat"] + dice();
    check -= tn;
    if (check >= 0) {
      healed += Math.floor(check / severity) + 1;
    } else {
      healed -= Math.floor(-check / severity) + 1;
    }
    if (inputs["hd-medknow"] > 0 && inputs["hd-mednin"] > 0) {
      // Do full healing with mednin    
      medknow = inputs["hd-medknow"] + dice();
      mednin = inputs["hd-mednin"] + dice();
      if (medknow < tn) {
        mednin -= (tn - medknow);
      }
      mednin -= tn;
      // Check if we're below 10 or below 20 thresholds to worsen condition...
      if (mednin <= -20) {
        healed -= 20;
      } else if (mednin <= -10) {
        healed -= 10;
      }
      total_med += Math.floor(mednin * 2/severity);
    } else if (inputs["hd-mednin"] > 0) {
      // Do partial healing with medknow
      medknow = inputs["hd-medknow"] + dice();
      medknow -= tn;
      // Check if we're below thresholds...
      if (medknow <= -20) {
        healed -= 20;
      } else if (medknow <= -10) {
        healed -= 20;
      }
      total_med += Math.floor(medknow/severity);
    }
    total_healed += healed;
  }
  if (total_med === 0) {
    result = "Healed " + total_healed + " trauma.";
  } else {
    result = "Healed " + total_healed + " trauma, and was healed for " + total_med + ".";
  }
  addResultsToLog(days, roll, result);
  trauma = inputs["hd-trauma"] - total_healed + total_med;
  trauma = Math.max(trauma, 0);
  $("#hd-trauma").val(trauma);
}

function healFull() {
  days_needed = 0
}




$(document).ready(function() {
  $("#hd-one").click(healFixedDays);
  $("#hd-full").click(healFull);
});
