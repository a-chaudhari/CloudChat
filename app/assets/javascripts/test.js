 document.addEventListener("DOMContentLoaded",function(){

   $("#connect").click(function(){
    //  debugger
     var exampleSocket = new WebSocket("ws://localhost:8080/"+$("#token").val());
     exampleSocket.onopen = function (event) {
       // examplesend_all("Can you hear me?");
       $(".status").text("Connected!");
     };
     exampleSocket.onmessage = function (event) {
       console.log(event.data);
       var obj = JSON.parse(event.data)
       $(".outputUL").append("<li>"+obj["user"]+": "+ obj["msg"] +"</li>")
       // $.
     }
   })
 })

//
// function connect() {
//   var exampleSocket = new WebSocket("ws://localhost:8080/abcd1234");
//   exampleSocket.onopen = function (event) {
//     // examplesend_all("Can you hear me?");
//     $(".status").text("Connected!");
//   };
//   exampleSocket.onmessage = function (event) {
//     console.log(event.data);
//     var obj = JSON.parse(event.data)
//     $(".outputUL").append("<li>"+obj["user"]+": "+ obj["msg"] +"</li>")
//     // $.
//   }
// }
