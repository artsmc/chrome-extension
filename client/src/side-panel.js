console.log("side-panel script loaded");

chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        console.log("message received");
        toggle();
    }
})

var iframe = document.createElement('iframe'); 
iframe.style.height = "100%";
iframe.style.backgroundColor = "transparent";
iframe.style.border = "none";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "5px";
iframe.style.zIndex = "9000000000000000000";
iframe.src = chrome.runtime.getURL("index.html")

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
    }
}