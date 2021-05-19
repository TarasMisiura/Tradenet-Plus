var form = document.forms.namedItem("block4_form");
form.addEventListener('submit', function (ev) {

   var oData = new FormData(form);
   var oReq = new XMLHttpRequest();
   oReq.open("POST", 'http://httpbin.org/post', true);
   oReq.onload = function (oEvent) {
      if (oReq.status == 200) {
         var responseObj = JSON.parse(oReq.response);
         console.log("Name :", responseObj.form.name);
         console.log("E-mail :", responseObj.form.email);
         console.log("Phone number :", iti.getNumber());
         // console.log("Phone number :", countryCode + responseObj.form.phone);
         console.log("Country name :", countryName);

         if (responseObj.form.bl4_checkbox == 'on') {
            console.log("Checkbox checked :", true);
         } else {
            console.log("Checkbox checked :", false);
         }
         $('#slide2').removeClass('hide');
         $('#block4_form').addClass('hide');
      } else {
         console.log("ERROR!");
         $('#block4_form input, #block4_form select').removeClass('input-error');
         var responseObj = JSON.parse(oReq.response);

         if (responseObj.hasOwnProperty('validation_errors')) {
            Object.keys(responseObj.validation_errors).forEach(function (field) {
               console.log(field)
            });
         }
         console.log(JSON.parse(oReq.response))
      }
   };
   oReq.send(oData);
   ev.preventDefault();
}, false);