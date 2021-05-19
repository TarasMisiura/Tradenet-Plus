// get the country data from the plugin
var countryData = window.intlTelInputGlobals.getCountryData(),
  input = document.querySelector("#phone"),
  addressDropdown = document.querySelector("#address_country"),
  errorMsg = document.querySelector("#error-msg"),
  validMsg = document.querySelector("#valid-msg");

// here, the index maps to the error code returned from getValidationError - see readme
var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];

// init plugin
var iti = window.intlTelInput(input, {
  initialCountry: "auto",
  autoHideDialCode: false,
  nationalMode: false,
  // hiddenInput: "full_phone",
  geoIpLookup: function (callback) {
    $.get('https://ipinfo.io', function () { }, "jsonp").always(function (resp) {
      var countryCode = (resp && resp.country) ? resp.country : "ua";
      callback(countryCode);
    });
  },
  utilsScript: "build/js/utils.js" // just for formatting/placeholders etc
});

// populate the country dropdown
for (var i = 0; i < countryData.length; i++) {
  var country = countryData[i];
  var optionNode = document.createElement("option");
  optionNode.value = country.iso2;
  var textNode = document.createTextNode(country.name);
  optionNode.appendChild(textNode);
  addressDropdown.appendChild(optionNode);
}
// set it's initial value
addressDropdown.value = iti.getSelectedCountryData().iso2;

// listen to the telephone input for changes
input.addEventListener('countrychange', function (e) {
  addressDropdown.value = iti.getSelectedCountryData().iso2;
  // countryCode = '+' + iti.getSelectedCountryData().dialCode;
  countryName = iti.getSelectedCountryData().name;
});

// listen to the address dropdown for changes
addressDropdown.addEventListener('change', function () {
  iti.setCountry(this.value);
});
var reset = function () {
  input.classList.remove("error");
  errorMsg.innerHTML = "";
  errorMsg.classList.add("hide");
  validMsg.classList.add("hide");
  input.classList.remove("input-error");
};

// on blur: validate
input.addEventListener('keyup', function () {
  reset();
  if (input.value.trim()) {
    if (iti.isValidNumber()) {
      // validMsg.classList.remove("hide");
      $('#sent_form').attr('disabled', false);
    } else {
      input.classList.add("error");
      var errorCode = iti.getValidationError();
      errorMsg.innerHTML = errorMap[errorCode];
      errorMsg.classList.remove("hide");
      $('#sent_form').attr('disabled', true);
    }
  }
});

// on keyup / change flag: reset
input.addEventListener('change', reset);
input.addEventListener('keyup', reset);
