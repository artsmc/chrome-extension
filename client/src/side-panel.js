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
iframe.style.overflow = "hidden";
iframe.style.display = "flex";
iframe.style.transition = "width 0.5s ease-in-out";
iframe.style.boxShadow = "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px, rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;";
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