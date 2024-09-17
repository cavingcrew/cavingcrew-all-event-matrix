

function pokeToWordPressOrders(data, order_id) {

  //console.log("Wordpress " + data);

  let encodedAuthInformation = Utilities.base64Encode(apiusername + ":" + apipassword);
  let headers = { "Authorization": "Basic " + encodedAuthInformation };
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': headers,  // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(data)
  };
  apiUrl = "https://www." + apidomain + "/wp-json/wc/v3/orders/" + order_id

  var response = UrlFetchApp.fetch(apiUrl, options);
  var responseData = JSON.parse(response.getContentText());
  //console.log(responseData)
  if (response.getResponseCode() == 200) {
    return responseData.id;
  } else {
    return 'Error';
  }
}

function pokeToWordPressProducts(data, product_id) {

  //console.log("Wordpress " + data);

  let encodedAuthInformation = Utilities.base64Encode(apiusername + ":" + apipassword);
  let headers = { "Authorization": "Basic " + encodedAuthInformation };
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': headers,  // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(data)
  };
  apiUrl = "https://www." + apidomain + "/wp-json/wc/v3/products/" + product_id

  var response = UrlFetchApp.fetch(apiUrl, options);
  var responseData = JSON.parse(response.getContentText());
  if (response.getResponseCode() == 200) {
    return responseData.id;
  } else {
    return 'Error';
  }
}

function pokeToWooUserMeta(data, user_id) {

  //console.log("Wordpress " + data);

  let encodedAuthInformation = Utilities.base64Encode(apiusername + ":" + apipassword);
  let headers = { "Authorization": "Basic " + encodedAuthInformation };
  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': headers,  // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(data)
  };
  apiUrl = "https://www." + apidomain + "/wp-json/wc/v3/customers/" + user_id

  var response = UrlFetchApp.fetch(apiUrl, options);
  var responseData = JSON.parse(response.getContentText());
  if (response.getResponseCode() == 200) {
    return responseData;
  } else {
    return 'Error';
  }
}


function pokeNoteToOrder(orderNumber, noteText) {
    var apiUrl = 'https://www.' + apidomain + '/wp-json/wc/v3/orders/' + orderNumber + '/notes';
  var encodedAuthInformation = Utilities.base64Encode(apiusername + ':' + apipassword);
  var headers = {'Authorization': 'Basic ' + encodedAuthInformation, 'Content-Type': 'application/json'};
  var payload = {'note': noteText};
  var options = {'method': 'post', 'headers': headers, 'payload': JSON.stringify(payload)};
  var response = UrlFetchApp.fetch(apiUrl, options);
  var responseData = JSON.parse(response.getContentText());
  //console.log(response.getResponseCode())
  if (response.getResponseCode() == 201) {
    //console.log(responseData)
    return responseData.id;
  } else {
    return 'Error';
  }
}