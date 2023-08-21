
document.addEventListener('readystatechange', function(event) {
    if (document.readyState === "complete") {
        console.log('readystatechange');
        startApplication();
        const observer = new MutationObserver(function(mutationList, observer) {
            // Your handling code here
            startApplication()
        });

        // Select the element you want to watch
        const elementNode = document.getElementsByClassName("omni-conversation-pane")[0];

        // Call the observe function by passing the node you want to watch with configuration options
        observer.observe(elementNode, { 
            attributes: false, 
            childList: true, 
            subtree: false }
        );

        // When ready to diconnect
        observer.disconnect();
        function startApplication(){
          const conversation = document.getElementsByClassName("omni-conversation-pane")[0];
          const conversationStyle = {
            flexDirection: 'row'
          }
          Object.keys(conversationStyle).forEach(key => {
            conversation.style[key] = conversationStyle[key];
          });
          const conversationView = conversation.getElementsByClassName("ember-view")[0];
          const conversationViewStyle = {
            width: '80%'
          }
          Object.keys(conversationViewStyle).forEach(key => {
            conversationView.style[key] = conversationViewStyle[key];
          });
          const appSidebar = document.createElement('div');
          const appSidebarStyle = {
              border: '1px solid silver',
              width: '400px'
          }
          Object.keys(appSidebarStyle).forEach(key => {
            appSidebar.style[key] = appSidebarStyle[key];
          });
          const conversationFrame = conversation.appendChild(appSidebar);
          const iframe = document.createElement('iframe');
          const styles = {
            height: "100%",
            backgroundColor: "#fff",
            border: "none",
            width: "41%",
            position: "absolute",
            top: "0px",
            bottom: "0px",
            padding: "20px",
            display: "flex",
            transition: "width 0.5s ease-in-out",
            boxShadow: "0px 10px 60px -30px rgba(0, 0, 0, 0.3)"
          };
          Object.keys(styles).forEach(key => {
            iframe.style[key] = styles[key];
          });
          const hashConverter = window.location.hash.replace("#", "#/");
          iframe.src = chrome.runtime.getURL("index.html" + hashConverter);
          const docFrame = appSidebar.appendChild(iframe);
        }
        
    }
});

