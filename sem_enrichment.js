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

    adgroup.split('|').forEach(function (value, index) {
        // do not split keywords group
        if (index === 1) {
            buffer.push(value);
        }
        else {
            value.split('_').forEach(function (subvalue) {
                buffer.push(subvalue);
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

// TODO refactor
function process(event) {
    var appId = new String(event.getApp_id());
    // var appId = "qa14-goeuro-de";

    if (/qa/.test(appId)) {
        var query = new String(event.getPage_urlquery());
        var queryObject = parseQuery(query);

        //var queryObject = parseQuery(event);

        if (Object.keys(queryObject).length) {
            // test validity - only treat if all utm fields are present
            if (queryObject.adgroup && queryObject.utm_campaign && queryObject.utm_medium && queryObject.utm_source && queryObject.utm_term) {
     
                var parsedAdgroup = parseAdGroup(queryObject.adgroup.trim());

                if (parsedAdgroup.length !== 14) {
                    throw "SEM enrichment - adgroup didn't pass size check - " + queryObject.adgroup;
                }

                //([a, b, ...rest]) => ([[a, ...rest], b])

                var schema = Object.assign({}, {
                    medium: queryObject.utm_source,
                    keywords: queryObject.utm_term,
                    cost_model: queryObject.utm_medium,
                    campaign_name: queryObject.utm_campaign,
                    adgroup_name: queryObject.adgroup
                }, mergeArraysAsKeyValue(adgroupSchema, parsedAdgroup));

                console.log(schema);

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

