$(function () {

	$.ajax({
        type: "GET",
        url: "departures.csv",
        dataType: "text",
    }).then(renderTrainDepartureTable);

	function renderTrainDepartureTable(data) {
		// Uses Handlebars to create the template to render the train departure data from the csv.
		var template = document.getElementById('template').innerHTML,
		  compiled_template = Handlebars.compile(template),
		  rendered,

		data = generateTrainDepartureData(data)
		rendered = compiled_template(data);

		document.getElementById('main-content').innerHTML = rendered;
	}

	function generateTrainDepartureData(data){
		//Function to convert the data to an object format to be used in the template
		var allRows = data.split(/\r?\n|\r/),
		  headerRows = allRows[0].split(','),
		  dataRows = [];

		allRows.shift();
		$.each(allRows, function( index, value ) {
			if (value) {
				var rowArray = value.replace(/"/g,"").split(',');
				mapDataObject(rowArray);
			}
		});

		function mapDataObject(rowArray){
			obj = {};

			for ( i = 0; i < headerRows.length ;i++){
				var dateRows = ["TimeStamp", "ScheduledTime"];
				if (dateRows.indexOf(headerRows[i]) > -1 ) {
					rowArray[i] = convertDateToLocal(rowArray[i]);
				}
				obj[headerRows[i]] = rowArray[i];
			};

			dataRows.push(obj);
		}
		
		return {
			headerRows,
			dataRows
		};
	}

	function convertDateToLocal(inDate) {
	    var date = new Date(parseInt(inDate)*1000),
		  hour = date.getHours(),
	  	  min = date.getMinutes()
	  	  amPm = (hour > 12) ? 'PM' : 'AM';

	  	hour = (hour > 12) ? hour -12: hour;

	    return hour + ':' + min + amPm;
	}

});