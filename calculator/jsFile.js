$(document).on('pageinit', '#index', function(){     
    var periodCycleDays = 28;
    var bleedingDays = 3;
    var fertilePhaseStart = periodCycleDays - 20;
    var fertilePhaseEnd = periodCycleDays - 11;
    var ovulation = (fertilePhaseStart-1) + (fertilePhaseEnd - fertilePhaseStart)/2;

    var periodStartDate = new Date();

    function createEventsForDate(date){
      var timeBetween = Math.abs(date.getTime() - periodStartDate.getTime());
      var daysBetween = Math.ceil(timeBetween / (1000 * 3600 * 24)); 
      var cyclesBetween = Math.floor((daysBetween / periodCycleDays));
      var events = [];
      // Create next two events to handle multiple sets within one month
      for(var i=0;i<2;i++){
        var cycleDaysBetween = periodCycleDays * (cyclesBetween + i);
        var p = addDays(periodStartDate, cycleDaysBetween);
        var bleedingEnd = addDays(p, bleedingDays);
        var fertilePhaseStartDate = addDays(p, fertilePhaseStart);
        var fertilePhaseEndDate = addDays(p, fertilePhaseEnd);
        var ovulationDayStart = addDays(p, ovulation)
        var ovulationDayEnd = new Date(new Date(ovulationDayStart).setHours(23,59,59,999));
        events.push({
          "summary": "Period",
          "begin": p,
          "end": bleedingEnd 
        });
        events.push({
          "summary": "Fertile",
          "begin": fertilePhaseStartDate,
          "end": fertilePhaseEndDate 
        });
        events.push({
          "summary": "Ovulation",
          "begin": ovulationDayStart,
          "end": ovulationDayEnd
        });
      }
      return events;
    }
    
    var InitialEvents = createEventsForDate(periodStartDate);

    $("#calendar").jqmCalendar({
        events: InitialEvents,
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        startOfWeek: 0
    }).bind('change', function(ev){
        var calendarDate = $(this).data("jqm-calendar").settings.date;
        var firstDayOfMonthForCalendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
        $(this).data("jqm-calendar").settings.events = createEventsForDate(firstDayOfMonthForCalendarDate);
    });
});
               
function addDays(date, days){
  var d = new Date(date.valueOf());
  d.setDate(d.getDate() + days)
  d.setHours(0,0,0,0);  // set to start of day
  return d;
}


