
    // add alterate html code in messenger page
    htmlPicker =
        "<div id='pinMessages' class=\"_1lix _1liy _1liz\"> <div class=\"_1li-\"> </div> <h4 id='pinTitle' aria-expanded=\"false\" class=\"_1lj0 _6ybm\" aria-pressed=\"true\">PINNED MESSAGES<div aria-label=\"PIN\" aria-expanded=\"false\" class=\"_1lj1 _3vo-\" role=\"button\" tabindex=\"0\"> </div> </h4> <div class=\"_1li_\"> <span class=\"_mh6\" id=\"cch_fd0b7cff3fca74\"> <ul class=\"_2o39\"> <a class=\"_3oh- _fy2 _2wjv\" href=\"#\">Afficher tout...</a> </ul> </span> </div> </div>";

    htmlPinger = "<li class=\"_hw4\" id='0604htmlpin'><a class=\"_hw5\" href=\"#\">Pin message</a></li>";

    // function gestPinMessages alterate html to add the localstorage content
    async function getPinMessages(){
        return new Promise((resolve, reject)=>{
            try{
                chrome.storage.local.get(getUrl(), function(item) {
                    htmlLi = "<div id='pinDetails' class=\"1li\"><span class=\"_mh6\">";
                    if(item[getUrl()].length) {
                        for (let i= 0; i< item[getUrl()].length;i++){
                            if(item[getUrl()][i]){
                                htmlLi += "<div class=\"_3szo _6y4w\">" +
                                    "<div class=\"_3szp\"><img id='copy_"+ i +"' class='copy' src="+chrome.runtime.getURL("copy.svg")+" width='20px' style='margin-right: 6px' />   " +
                                    "<img id='trash_"+ i +"' class='trash' src="+chrome.runtime.getURL("trash.svg")+" width='20px'/> </div> " +
                                    "<div class=\"_3szq\" data-tooltip-content=\""+item[getUrl()][i].toString()+"\" data-hover=\"tooltip\" data-tooltip-position=\"above\" data-tooltip-alignh=\"center\">  " + item[getUrl()][i].toString().substring(0, 35) + "... </div>" +
                                    "</div>"
                            }
                        }
                        htmlLi += "</div></span>";
                        resolve(htmlLi);
                    }
                    else {
                        resolve("");
                    }
                });
            }
            catch (e) {
                console.log("erreur")
            }
        })
    }


    // pinShow if "Pin Message" is clicked
    var pinShown = false;
    var previousUrl = $(location).attr('href').split('t/');

    function getUrl(){
        let myUrl = $(location).attr('href').split('t/');
        let url = myUrl[1];
        if(previousUrl !== url){
            pinShown=false;
            previousUrl=url;
        }
        return url
    }

    // get div where PIN MESSAGE is added
    function addViewer(){
        $("._3tkv").ready(function () {
            let elements = document.getElementsByClassName("_3tkv");

            if (!($("#pinMessages").length)){
                elements[0].insertAdjacentHTML('beforeend', htmlPicker);
            }
        });
    }

    addViewer();

    function in_array(string, array){
        var result = false;
        for(i=0; i<array.length; i++){
            if(array[i] === string){
                result = true;
            }
        }
        return result;
    }

    // function to refresh pin
    function refrechPin (){
        $("#pinDetails").remove();
    }


    // when conversation is changed
    $(document).on("click","._1ht5",function(){
        addViewer();
    });

    // Add the content_message to html from pin wanted
    var content_message;
    $(document).on("click","._8sop",function(e){
        $("._hw3").ready(function () {
            let points = document.getElementsByClassName("_hw3");
            if (points[0]){
                points[0].insertAdjacentHTML('beforeend', htmlPinger);
            }
        });
        content_message = $(this).parent().parent().parent().next().attr("aria-label");

    });

    // Add message to local storage array
    $(document).on("click","#0604htmlpin",function(e){
        chrome.storage.local.get(null, function(items) {
            let allKeys = Object.keys(items);
            if(!in_array(getUrl(),allKeys)){
                // local storage creation
                var pins = [];
                chrome.storage.local.set({[getUrl()]: pins}, function() {
                    chrome.storage.local.get(getUrl(), function (result) {
                        chrome.storage.local.set({
                            [getUrl()]: [...result[getUrl()], content_message]
                        });
                    });
                });
            }else {
                chrome.storage.local.get(getUrl(), function (result) {
                    chrome.storage.local.set({
                        [getUrl()]: [...result[getUrl()], content_message]
                    });
                });
                refrechPin();
                pinShown = false
            }
        });
    });



    // show or hide on click on PIN MESSAGE
    $(document).on("click","#pinTitle", async function(e){
        if (pinShown){
            $("#pinDetails").hide();
            pinShown = false
        }else {
            if($("#pinDetails").length){
                $("#pinDetails").show();
            }else{
                var pinMessages = await getPinMessages();
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

        chrome.storage.local.get(getUrl(), function (result) {
            result[getUrl()].splice(nbItem,1);
            chrome.storage.local.set(result)
        });
        refrechPin();
        pinShown = false
    });

    // copy PIN MESSAGE to clip-board
    $(document).on("click",".copy",function(e){
        let myId = $(this).attr('id');
        let myIdSplited = myId.split('_');
        let nbItem = myIdSplited[1];

        chrome.storage.local.get(getUrl(), function(item) {
            navigator.clipboard.writeText(item[getUrl()][nbItem]).then(function() {
                $('#copy_'+nbItem).replaceWith("<img id='copy_"+ nbItem +"' class='copy' src="+chrome.runtime.getURL("tick.svg")+" width='20px' style='margin-right: 6px' />");
                setTimeout(()=>{ $('#copy_'+nbItem).replaceWith("<img id='copy_"+ nbItem +"' class='copy' src="+chrome.runtime.getURL("copy.svg")+" width='20px' style='margin-right: 6px' />");},1500)
            }, function() {
                alert('erreur dans la copie du message')
            });
        });

    });





