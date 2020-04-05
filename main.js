
    // add alterate html code in messenger page
    htmlPicker =
        "<div id='pinMessages' class=\"_1lix _1liy _1liz\"> <div class=\"_1li-\"> </div> <h4 id='pinTitle' aria-expanded=\"false\" class=\"_1lj0 _6ybm\" aria-pressed=\"true\">PIN MESSAGE<div aria-label=\"PIN\" aria-expanded=\"false\" class=\"_1lj1 _3vo-\" role=\"button\" tabindex=\"0\"> </div> </h4> <div class=\"_1li_\"> <span class=\"_mh6\" id=\"cch_fd0b7cff3fca74\"> <ul class=\"_2o39\"> <a class=\"_3oh- _fy2 _2wjv\" href=\"#\">Afficher tout...</a> </ul> </span> </div> </div>";

    htmlPinger = "<li class=\"_hw4\" id='0604htmlpin'><a class=\"_hw5\" href=\"#\">Pin message</a></li>";

    // function gestPinMessages alterate html to add the localstorage content
    function getPinMessages(){
        let currentPinMessages = JSON.parse(localStorage.getItem(getUrl()));
        htmlLi = "<div id='pinDetails' class=\"1li\"><span class=\"_mh6\">";
        if(currentPinMessages) {
            for (let i= 0; i< currentPinMessages.length;i++){
                htmlLi += "<div class=\"_3szo _6y4w\">" +
                    "<div class=\"_3szp\"><img id='copy_"+ i +"' class='copy' src="+chrome.runtime.getURL("copy.svg")+" width='20px' style='margin-right: 6px' />   " +
                    "<img id='trash_"+ i +"' class='trash' src="+chrome.runtime.getURL("trash.svg")+" width='20px'/> </div> " +
                    "<div class=\"_3szq\" data-tooltip-content=\""+currentPinMessages[i]+"\" data-hover=\"tooltip\" data-tooltip-position=\"above\" data-tooltip-alignh=\"center\">  " + currentPinMessages[i].substring(0, 35) + "... </div>" +
                    "</div>"
            }
            htmlLi += "</div></span>";
            return htmlLi;
        }
        else {
            return "";
        }
    }

    // pinShow if "Pin Message" is clicked
    var pinShown = false;
    var previousUrl = $(location).attr('href').split('t/');
    function getUrl(){
        let myUrl = $(location).attr('href').split('t/');
        let url = myUrl[1];
        console.log(url);
        if(previousUrl !== url){
            pinShown=false;
            previousUrl=url;
        }
        return url
    }

    // get div where PIN MESSAGE is added
    function addViewer (){
        let elements = document.getElementsByClassName("_3tkv");
        console.log(elements);

        if(elements[0]!==undefined){
            elements[0].insertAdjacentHTML('beforeend', htmlPicker);
        }
    }
    addViewer();


    // when conversation is changed
    $(document).on("click","._1ht5",function(){
        if (!$('#pinMessages').length){
            addViewer();
        }
    });

    // Add the content_message to html from pin wanted
    var content_message;
    $(document).on("click","._8sop",function(e){
        console.log('clic capted');
        let points = document.getElementsByClassName("_hw3");
        console.log(points);
        points[0].insertAdjacentHTML('beforeend', htmlPinger);
        content_message = $(this).parent().parent().parent().next().attr("aria-label");
        console.log(content_message)
    });

    // Add message to local storage array

    $(document).on("click","#0604htmlpin",function(e){
        if (!(localStorage.getItem(getUrl()) !== null && localStorage.getItem(getUrl()).length)){
            // local storage creation
            var pins = [];
            console.log('je passe par là');
            localStorage.setItem(getUrl(), JSON.stringify(pins));
        }
        let currentPinMessages = JSON.parse(localStorage.getItem(getUrl()));
        console.log(currentPinMessages);
        currentPinMessages.push(content_message);
        console.log(currentPinMessages);
        localStorage.setItem(getUrl(), JSON.stringify(currentPinMessages));
        refrechPin();
    });



    // function to refresh pin
    function refrechPin (){
        $("#pinDetails").remove();
    }

    // show or hide on click on PIN MESSAGE
    $(document).on("click","#pinTitle",function(e){
        if (pinShown){
            $("#pinDetails").hide();
            pinShown = false
        }else {
            if($("#pinDetails").length){
                console.log($("#pinDetails"));
                $("#pinDetails").show();
            }else{
                console.log($("#pinDetails"));
                let pinMessages = getPinMessages();
                $("#pinMessages").append(pinMessages);
            }
            pinShown = true
        }
    });

    // delete PIN MESSAGE
    $(document).on("click",".trash",function(e){
        let myId = $(this).attr('id');
        let myIdSplited = myId.split('_');
        let nbItem = myIdSplited[1];
        console.log(nbItem);


        let currentPinMessages = JSON.parse(localStorage.getItem(getUrl()));
        console.log(currentPinMessages);

        currentPinMessages.splice(nbItem,1);

        console.log(currentPinMessages);

        localStorage.setItem(getUrl(), JSON.stringify(currentPinMessages));
        refrechPin();

    });

    // copy PIN MESSAGE to clip-board
    $(document).on("click",".copy",function(e){
        let myId = $(this).attr('id');
        let myIdSplited = myId.split('_');
        let nbItem = myIdSplited[1];
        console.log(nbItem);
        let currentPinMessages = JSON.parse(localStorage.getItem(getUrl()));


        navigator.clipboard.writeText(currentPinMessages[nbItem]).then(function() {
            $('#copy_'+nbItem).replaceWith("<img id='copy_"+ nbItem +"' class='copy' src="+chrome.runtime.getURL("tick.svg")+" width='20px' style='margin-right: 6px' />");
            setTimeout(()=>{ $('#copy_'+nbItem).replaceWith("<img id='copy_"+ nbItem +"' class='copy' src="+chrome.runtime.getURL("copy.svg")+" width='20px' style='margin-right: 6px' />");},1500)
        }, function() {
            alert('erreur dans la copie du message')
        });
    });





