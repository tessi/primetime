~function(){
  var modProd = function(a,b,n) {
    if(b==0) return 0;
    if(b==1) return a%n;
    return (modProd(a,(b-b%10)/10,n)*10+(b%10)*a)%n;
  };

  var modPow = function(a,b,n) {
    if(b==0) return 1;
    if(b==1) return a%n;
    if(b%2==0){
      var c=modPow(a,b/2,n);
      return modProd(c,c,n);
    }
    return modProd(a,modPow(a,b-1,n),n);
  };

  // The Miller-Rabin implementation comes
  // from the Rosetta-Code project:
  // http://rosettacode.org/wiki/Miller-Rabin_primality_test#JavaScript
  var isPrime = function(n) {
    if(n==2||n==3||n==5) return true;
    if(n%2==0||n%3==0||n%5==0) return false;
    if(n<25) return true;
    for(var a=[2,3,5,7,11,13,17,19],b=n-1,d,t,i,x;b%2==0;b/=2);
    for(i=0;i<a.length;i++){
      x=modPow(a[i],b,n);
      if(x==1||x==n-1) continue;
      for(t=true,d=b;t&&d<n-1;d*=2){
        x=modProd(x,x,n); if(x==n-1) t=false;
      }
      if(t) return false;
    }
    return true;
  };

  var unixTimestamp = function(date) {
    return Math.round(date.getTime() / 1000);
  };

  var timeline; // cached canvas
  var ctx;      // cached canvas context
  var initTimeline = function(){
    timeline = document.getElementById("timeline");
    ctx = timeline.getContext("2d");
    ctx.lineWidth = 2;
  };

  var updateTimeline = function(date){
    var image;

    if (isPrime(unixTimestamp(date))) {
      ctx.strokeStyle = "#33AA33";
    } else {
      ctx.strokeStyle = "#FFFFFF";
    };

    // move the canvas content to the right
    image = ctx.getImageData(0, 0, timeline.width, timeline.height);
    ctx.putImageData(image, -2, 0);

    // draw a new line
    ctx.moveTo(timeline.width-2, 0);
    ctx.lineTo(timeline.width-2, timeline.height);
    ctx.stroke();
  };

  var updateTimes = function(date){
    document.getElementById('time-stamp').textContent = unixTimestamp(date);
    document.getElementById('time-text').textContent  = date.toLocaleString();
  };

  var updatePrimeTimeHeader = function(date) {
    var name = '';
    if (isPrime(unixTimestamp(date))) {
      name = 'prime';
    }
    document.getElementById('prime-time').className = name;
  };

  var updateUrl = function(date) {
    var url = window.location.toString();
    var timestamp = unixTimestamp(date);
    url = url.replace(/\?.*$/,'');
    url += '?t=' + timestamp;
    window.history.replaceState({}, '', url);
  };

  var update = function() {
    var date = new Date();
    date.setMilliseconds(0);

    updateTimes(date);
    updateTimeline(date);
    updatePrimeTimeHeader(date);
    updateUrl(date);
  };

  // source: http://stackoverflow.com/a/979997/1881769
  var get_url_param = function(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#/]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
      return null;
    else
      return results[1];
  }

  var restore_from_timestamp = function(timestamp) {
    var t = (parseInt(timestamp) - timeline.width) * 1000;
    var date;
    for (var i = 0; i <= timeline.width; i++) {
      date = new Date(t + i * 1000);
      updateTimeline(date);
    };
    updateTimes(date);
    updatePrimeTimeHeader(date);
  };

  var initPrimeTime = function() {
    var t = get_url_param('t');
    initTimeline();

    if (t) {
      restore_from_timestamp(t);
    } else {
      restore_from_timestamp(unixTimestamp(new Date()));
      update();
      setInterval(update, 1000);
    };
  };

  window.onload = initPrimeTime;
}();