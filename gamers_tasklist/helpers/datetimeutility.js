module.exports = {
    ParseDateFromDDMMYYYY: function (dateText){
        var arrayDate = dateText.split("/");
        var day = arrayDate[0];
        var month = arrayDate[1];
        var year = arrayDate[2];
        var convertedDate = new Date(month + "/" + day + "/" + year);
        return convertedDate;
    }
}