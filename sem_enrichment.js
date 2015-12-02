
function parseQuery(qstr) {
    var query = {},
    	a = qstr.substr(1).split('&');
    for (var i = 0, j = a.length; i < j; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

function parseAdGroup (adGroup) {
	// fault tolerent data structure
	var values = [],
		keys = [
  			["business_unit", "variation_number", "campaign_type"],
		  	["support_word_type", "variation_index"],
		  	["departure_name", "departure_position_fk", "departure_country_name"],
		  	["arrival_name", "arrival_position_fk", "arrival_country_name"],
			["language", "domain"],
		  	["match_type"]
	],
	groups = adGroup.split('|'),
	data = {"sem_mid_full": adGroup};

	for (var i = 0, groupLength = groups.length ; i < groupLength ; i ++) {
	  // prevent creating an array if last char is just |
	  if (groups[i].length) {
	    var subGroup = groups[i].trim().split('_');
	    values.push(new Array(keys[i].length));
	    
	    for (var j = 0, subGroupLength = subGroup.length ; j < subGroupLength ; j++) {    
	      // condition is for trashing other key words because of static struct
	      j < keys[i].length && (data[keys[i][j]] = subGroup[j].trim());
	    }
	  }
	}
	return data
}


function process(event) {
    var query = event.getPage_urlquery();
    // test validity - only treat if all utm fields are present
    if (queryObject.adgroup && queryObject.utm_campaign && queryObject.utm_medium && queryObject.utm_source && queryObject.utm_term) {
		return [ { schema: "iglu:com.goeuro/sem_parameters_context/jsonschema/1-0-0",
               data:  parseAdGroup(queryObject.adgroup)} ];
    }
    else {
    	return [];
    }
}