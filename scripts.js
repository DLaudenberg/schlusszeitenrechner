var TimeUtil = (function () {

	_roundToQuarter = function( number ) {
		var x = number / 15;
		x = Math.round( x );
		x = x * 15;
		return x;
	},

	_getTwoDigits = function( number ) {

		var str = "00" + number;

		return str.substr( str.length - 2 );
	},

	getTimeString = function( h, m ) {

		return _getTwoDigits( h ) + ":" + _getTwoDigits( m );
	},

	getTimeStringOrEmptyTime = function( h, m ) {

		var time_string;
		if( h == 0 && m == 0 ) {
			time_string = "__:__";
		}
		else {
			time_string = _getTwoDigits( h ) + ":" + _getTwoDigits( m );
		}

		return time_string;
	},

	convertMinutes = function( minutes ) {

		// if( minutes%25 == 0 )
		// 	return minutes / 100 * 60;
		// else if( minutes%15 == 0 )
		// 	return minutes;
		// else
		// 	return _roundToQuarter( minutes );
		return _roundToQuarter( minutes );
	}

	return {
		getTimeString            : getTimeString,
		getTimeStringOrEmptyTime : getTimeStringOrEmptyTime,
		convertMinutes           : convertMinutes
	};
})();

function calculateFinaltimes () {

	var starttime_value = starttime_container.value;
	var overtime_value  = overtime_container.value;
	var breaktime_value = breaktime_container.value;
	var is_undertime    = is_undertime_container.checked;

	var has_starttime   = false;
	var has_breaktime   = false;

	// xxx
	var starttime_h = 0,
	    starttime_m = 0;

	var overtime_h  = 0,
	    overtime_m  = 0;

	var breaktime_h = 0,
	    breaktime_m = 0;

	var halftime_h,
	    halftime_m;

	var endtime_h,
	    endtime_m;

	// xxx
	var starttime,
	    overtime,
	    breaktime,
	    halftime,
	    endtime;

	// starttime
	if( starttime_value.match( regex_time ) !== null ) {

		has_starttime = true;

		var starttime_array = starttime_value.split( ":" );
		starttime_h = parseInt( starttime_array[ 0 ] );
		starttime_m = TimeUtil.convertMinutes( parseInt( starttime_array[ 1 ] ) );
	}
	starttime = TimeUtil.getTimeString( starttime_h, starttime_m );

	// overtime
	if( overtime_value.match( regex_time ) !== null ) {

		var overtime_array = overtime_value.split( ":" );
		overtime_h = parseInt( overtime_array[ 0 ] );
		overtime_m = TimeUtil.convertMinutes( parseInt( overtime_array[ 1 ] ) );
	}
	overtime = ( is_undertime ? "-" : "" ) + TimeUtil.getTimeString( overtime_h, overtime_m );

	// breaktime
	if( breaktime_value.match( regex_time ) !== null ) {

		has_breaktime = true;

		var breaktime_array = breaktime_value.split( ":" );
		breaktime_h = parseInt( breaktime_array[ 0 ] );
		breaktime_m = TimeUtil.convertMinutes( parseInt( breaktime_array[ 1 ] ) );
	}
	breaktime = TimeUtil.getTimeStringOrEmptyTime( breaktime_h, breaktime_m );

	// halftime
	if( !has_starttime ) {
		halftime_h = 0;
		halftime_m = 0;
	}
	else {

		if( is_undertime ) {
			halftime_h = starttime_h + 8 + overtime_h;
			halftime_m = starttime_m + overtime_m;
		}
		else {
			halftime_h = starttime_h + 8 - overtime_h;
			halftime_m = starttime_m - overtime_m;
		}
	}
	while( halftime_m >= 60 ) {

		halftime_m -= 60;
		halftime_h += 1;
	}
	while( halftime_m < 0 ) {

		halftime_m += 60;
		halftime_h -= 1;
	}
	halftime = TimeUtil.getTimeStringOrEmptyTime( halftime_h, halftime_m );

	// endtime
	endtime_h = ( !has_starttime || !has_breaktime ) ? 0 : ( halftime_h + breaktime_h );
	endtime_m = ( !has_starttime || !has_breaktime ) ? 0 : ( halftime_m + breaktime_m );
	while( endtime_m >= 60 ) {

		endtime_m -= 60;
		endtime_h += 1;
	}
	while( endtime_m < 0 ) {

		endtime_m += 60;
		endtime_h -= 1;
	}
	endtime = TimeUtil.getTimeStringOrEmptyTime( endtime_h, endtime_m );

	// return
	return {
		"starttime" : starttime,
		"overtime" : overtime,
		"halftime" : halftime,
		"endtime" : endtime
	}
}

function output_finaltimes ( finaltimes ) {

	output_start_container.innerHTML = finaltimes.starttime;
	output_overtime_container.innerHTML = finaltimes.overtime;
	output_halftime_container.innerHTML = finaltimes.halftime;
	output_end_container.innerHTML = finaltimes.endtime;
}

var starttime_container    = document.getElementById( "starttime" );
var overtime_container     = document.getElementById( "overtime" );
var breaktime_container    = document.getElementById( "breaktime" );
var is_undertime_container = document.getElementById( "is_undertime" );

var output_start_container    = document.getElementById( "output_starttime" );
var output_overtime_container = document.getElementById( "output_overtime" );
var output_halftime_container = document.getElementById( "output_halftime" );
var output_end_container      = document.getElementById( "output_endtime" );

var endtime_form = document.forms[ "schlusszeitrechner" ];

var regex_time = new RegExp( /^[0-9]{1,2}:[0-9]{2}$/i );

// 
// init
// 
endtime_form.addEventListener("submit", function (e) {

	e.preventDefault();
	output_finaltimes( calculateFinaltimes() );
	return false;
}, false );

endtime_form.addEventListener("change", function (e) {

	e.preventDefault();
	output_finaltimes( calculateFinaltimes() );
	return false;
}, false );

output_finaltimes( calculateFinaltimes() );