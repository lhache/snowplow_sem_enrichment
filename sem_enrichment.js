var keys = [
    ["business_unit", "variation_number", "campaign_type"],
    ["keyword_codes"],
    ["departure_name", "departure_position_fk", "departure_country_name"],
    ["arrival_name", "arrival_position_fk", "arrival_country_name"],
    ["distance_km"],
    ["language", "domain"],
    ["match_type"]
];

var finalKeysSize = 0;


function parseQuery(qstr) {
    var query = {},
        a = qstr.substr(1).split('&');
    if (qstr != "") {
        for (var i = 0, j = a.length; i < j; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
    }
    return query;
}

function parseAdGroup(adGroup) {
    // fault tolerent data structure
    var groups = adGroup.split('|'),
        data = {};

    for (var i = 0, groupLength = groups.length; i < groupLength; i++) {
        // prevent creating an array if last char is just |
        if (i !== (groups.length - 1)) {
            finalKeysSize++;

            // do not split keyword_codes
            if (i === 1) {
                data[keys[i][0]] = groups[i].trim();
            } else {
                var subGroup = groups[i].trim().split('_');
                for (var j = 0, subGroupLength = subGroup.length; j < subGroupLength; j++) {
                    // condition is for trashing other key words because of static struct
                    j < keys[i].length && (data[keys[i][j]] = subGroup[j].trim());
                }
            }
        }
    }
    return data;
}

// TODO refactor
function process(event) {
    var query = new String(event.getPage_urlquery());
    var queryObject = parseQuery(query);

    if (Object.keys(queryObject).length) {
        // test validity - only treat if all utm fields are present
        if (queryObject.adgroup && queryObject.utm_campaign && queryObject.utm_medium && queryObject.utm_source && queryObject.utm_term) {
            var schema = parseAdGroup(queryObject.adgroup);
            // basic size check
            if (keys.length === finalKeysSize) {
                schema.medium = queryObject.utm_medium;
                schema.keywords = queryObject.utm_term;
                schema.cost_model = queryObject.utm_source;
                schema.campaign_name = queryObject.utm_campaign;
                schema.adgroup_name = queryObject.adgroup

                return [{
                    schema: "iglu:com.goeuro/sem_parameters_context/jsonschema/2-0-1",
                    data: schema
                }];
            } else {
                return [];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}
