var adgroupSchema = [
   "business_unit",
   "variation_number",
   "campaign_type",
   "keyword_codes",
   "departure_name",
   "departure_position_fk",
   "departure_country_name",
   "arrival_name",
   "arrival_position_fk",
   "arrival_country_name",
   "distance_km",
   "language",
   "domain",
   "match_type"
];

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

function parseAdGroup (adgroup) {
    var buffer = [];
    // remove trailing |
    if (adgroup.substr(-1, 1) === '|') {
        adgroup = adgroup.substr(0, adgroup.length - 1)
    }
    adgroup.split('|').forEach(function (val, i) {
        // do not split keywords group
        if (i === 1) {
            buffer.push(val);
        }
        else {
            val.split('_').forEach(function (subval) {
                buffer.push(subval);
            });
        }
    });
    return buffer;
}

function mergeArraysAsKeyValue(keys, values) {
    var schema = {};
    for (i = 0; i < keys.length; i++) {
        schema[keys[i]] = values[i];
    }   
    return schema;
}

function process(event) {
    var query = new String(event.getPage_urlquery());
    var queryObject = parseQuery(query);
    //var queryObject = parseQuery(event);
    if (Object.keys(queryObject).length) {
        if (queryObject.adgroup && queryObject.utm_campaign && queryObject.utm_medium && queryObject.utm_source && queryObject.utm_term) {
            var parsedAdgroup = parseAdGroup(queryObject.adgroup.trim());
            if (parsedAdgroup.length !== 14) {
                throw "SEM enrichment - adgroup didn't pass size check - " + queryObject.adgroup;
            }
            var schema = mergeArraysAsKeyValue(adgroupSchema, parsedAdgroup);
            schema.medium = queryObject.utm_source;
            schema.keywords = queryObject.utm_term;
            schema.cost_model = queryObject.utm_medium;
            schema.campaign_name = queryObject.utm_campaign;
            schema.adgroup_name = queryObject.adgroup;


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
}
