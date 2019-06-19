// https://github.com/showdownjs/showdown/issues/309
showdown.extension('mdinclude', function () {
	var myGb = [];
	return [
    {
      type: 'lang',
      filter: function(text) {
        text = text.replace(/\n{{(.*)}}\n/g, function(wm, url) {
          var n = myGb.push('<md-include data-url="' + url + '"></md-include>') - 1;
          return '\n\n~M~I' + n + '~M~I\n\n';
        });
        return text;
      }
    },
    {
    	type: 'output',
      filter: function(text) {
      	text = text.replace(/<p>~M~I(\d+)~M~I<\/p>/g, function (wm, n) {
        	var otp = myGb[n];
          return otp;
        });
        myGb = [];
        return text;
      }
    }
  ];
});

var cnv = new showdown.Converter({extensions: ['mdinclude']});
document.getElementById('content').innerHTML = cnv.makeHtml(document.getElementById('md-content').value);


// Cicle through all md-includes
var mdIncludeList = document.getElementsByTagName('md-include');

for (var i = 0; i < mdIncludeList.length; i++) {
		var url = mdIncludeList[i].getAttribute("data-url");
    replaceMd(url, mdIncludeList[i])
}


//AJAX CALL - You can use jquery or something else
function replaceMd(url, DOMObj) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = function() {
      if (xhr.status === 200) {
        var myDiv = document.createElement("div");
        myDiv.innerHTML = cnv.makeHtml(xhr.responseText);
      	DOMObj.parentNode.replaceChild(myDiv, DOMObj);
      }
      else {
          alert('Request failed.  Returned status of ' + xhr.status);
      }
  };
  xhr.send();
}