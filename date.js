exports.getDate = function (){

    const options = {weekday: "long", day: "numeric", month: "long", year: "numeric"};
    
    var day = new Date();
    var currentDay = day.toLocaleDateString("en-US", options);

    return currentDay;
}

exports.getDay = function(){
    const options = {weekday: "long"};

    const day = new Date();
    const DayOfTheWeek = day.toLocaleDateString("en-US", options);
    
    return DayOfTheWeek;
}