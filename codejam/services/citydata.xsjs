function isEmpty(str) {
    return (!str || str.length === 0);
}

function insertEntry() {
    var body = '';
    var ID = $.request.parameters.get('id');
    var CITY_NAME = $.request.parameters.get('cname');
    var ASCII_NAME = $.request.parameters.get('aname');
    var LAT = $.request.parameters.get('lat');
    var LON = $.request.parameters.get('lon');
    var POPULATION = $.request.parameters.get('pop');
    var COUNTRY = $.request.parameters.get('ctry');
    var COUNTRY_ISO2 = $.request.parameters.get('iso2');
    var COUNTRY_ISO3 = $.request.parameters.get('iso3');
    var PROVINCE = $.request.parameters.get('prov');
    
    
    if ( isEmpty(ID) === true ) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('ID cannot be empty');
        return;
    }
    
    if ( isEmpty(CITY_NAME) === true ) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('City name cannot be empty');
        return;
    }
    
    if ( isEmpty(LAT) === true ) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Latitude cannot be empty');
        return;
    }
    
    if ( isEmpty(LON) === true ) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Longitude cannot be empty');
        return;
    }
    
    if ( isEmpty(POPULATION) === true) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Population cannot be empty');
        return;
    }
    
    if ( isEmpty(COUNTRY) === true) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Country cannot be empty');
        return;
    }
    
    if ( isEmpty(COUNTRY_ISO3) === true) {
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Country ISO3 code cannot be empty');
        return;
    }
    
    var conn = $.hdb.getConnection();
    var pstmt;
    var rs;
    var query;
    
    try {
        //Insert new record
        query = "INSERT INTO \"CJCITY\".\"CODEJAMMER.codejam.data::cities.City\" values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        conn.executeUpdate(query, ID, CITY_NAME, ASCII_NAME, LAT, LON, POPULATION, COUNTRY, COUNTRY_ISO2, COUNTRY_ISO3, PROVINCE);
        conn.commit();
        conn.close();
    } catch (error) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(error.message);
        return;
    }
    
    body = 'Submission Successful'; //Success
    $.trace.debug(body);
    $.response.setBody(body);
    $.response.headers.set('access-control-allow-origin', '*');
    $.response.status = $.net.http.OK;
}

function fillSessionInfo(){
    var body = '';
    body = JSON.stringify({
        "session" : [{"UserName": $.session.getUsername(), "Language": $.session.language}]
    });
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "Insert":
        insertEntry();
        break;
    case "getSessionInfo":
        fillSessionInfo();
        break;
    default:
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody('Invalid Command');
}
