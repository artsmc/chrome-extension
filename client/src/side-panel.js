chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        console.log("message received");
        toggle();
    }
})

var iframe = document.createElement('iframe'); 
iframe.style.height = "100%";
iframe.style.backgroundColor = "#fff";
iframe.style.border = "none";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.bottom = "0px";
iframe.style.right = "0px";
iframe.style.padding = "20px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.display = "flex";
iframe.style.transition = "width 0.5s ease-in-out";
iframe.style.boxShadow = "0px 10px 60px -30px rgba(0, 0, 0, 0.3)";
// in the window.location.hash replace the first # character with /
const hashConverter = window.location.hash.replace("#", "#/");
iframe.src = chrome.runtime.getURL("index.html"+hashConverter)

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="420px";
    }
    else{
        iframe.style.width="0px";
    }
}