document.addEventListener("DOMContentLoaded",function(){
  var exampleSocket = new WebSocket("ws://localhost:8080/abcd1234");
  exampleSocket.onopen = function (event) {
    // exampleSocket.send("Can you hear me?");
    $(".status").text("Connected!");
  };
  exampleSocket.onmessage = function (event) {
    console.log(event.data);
    var obj = JSON.parse(event.data)
    $(".outputUL").append("<li>"+obj["user"]+": "+ obj["msg"] +"</li>")
    // $.
  }

})
