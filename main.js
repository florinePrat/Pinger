
    // add alterate html code in messenger page
    htmlPicker =
        "<div id='pinMessages' class=\"_1lix _1liy _1liz\"> <div class=\"_1li-\"> </div> <h4 id='pinTitle' aria-expanded=\"false\" class=\"_1lj0 _6ybm\" aria-pressed=\"true\">PIN MESSAGE<div aria-label=\"PIN\" aria-expanded=\"false\" class=\"_1lj1 _3vo-\" role=\"button\" tabindex=\"0\"> </div> </h4> <div class=\"_1li_\"> <span class=\"_mh6\" id=\"cch_fd0b7cff3fca74\"> <ul class=\"_2o39\"> <a class=\"_3oh- _fy2 _2wjv\" href=\"#\">Afficher tout...</a> </ul> </span> </div> </div>";

    htmlPinger = "<li class=\"_hw4\" id='0604htmlpin'><a class=\"_hw5\" href=\"#\">Pin message</a></li>";

    // function gestPinMessages alterate html to add the localstorage content
    async function getPinMessages(){
        return new Promise((resolve, reject)=>{
            try{
                chrome.storage.local.get(getUrl(), function(item) {
                    console.log(item[getUrl()], item[getUrl()].length);
                    htmlLi = "<div id='pinDetails' class=\"1li\"><span class=\"_mh6\">";
                    if(item[getUrl()].length) {
                        for (let i= 0; i< item[getUrl()].length;i++){
                            htmlLi += "<div class=\"_3szo _6y4w\">" +
                                "<div class=\"_3szp\"><img id='copy_"+ i +"' class='copy' src="+chrome.runtime.getURL("copy.svg")+" width='20px' style='margin-right: 6px' />   " +
                                "<img id='trash_"+ i +"' class='trash' src="+chrome.runtime.getURL("trash.svg")+" width='20px'/> </div> " +
                                "<div class=\"_3szq\" data-tooltip-content=\""+item[getUrl()][i].toString()+"\" data-hover=\"tooltip\" data-tooltip-position=\"above\" data-tooltip-alignh=\"center\">  " + item[getUrl()][i].toString().substring(0, 35) + "... </div>" +
                                "</div>"
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
    function addViewer (){
        let elements = document.getElementsByClassName("_3tkv");
        console.log(elements);

        if(elements[0]!==undefined){
            elements[0].insertAdjacentHTML('beforeend', htmlPicker);
        }
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
        chrome.storage.local.get(null, function(items) {
            let allKeys = Object.keys(items);
            console.log(allKeys);
            if(!in_array(getUrl(),allKeys)){
                // local storage creation
                var pins = [];
                chrome.storage.local.set({[getUrl()]: pins});
                chrome.storage.local.get(getUrl(), function (result) {
                    console.log(getUrl());
                    console.log(result)
                });
            }else {
                chrome.storage.local.get(getUrl(), function (result) {
                    chrome.storage.local.set({
                        [getUrl()]: result[getUrl()] && Array.isArray(result[getUrl()])
                            ? [...result[getUrl()], content_message]
                            : [content_message]
                    }, function () {
                        console.log(result)
                    })
                });
                refrechPin();
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
                console.log($("#pinDetails"));
                $("#pinDetails").show();
            }else{
                console.log($("#pinDetails"));
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
        console.log(nbItem);


        chrome.storage.local.get(getUrl(), function (result) {
            chrome.storage.local.set({
                [getUrl()]: result[getUrl()].splice(nbItem,1)
            }, function () {
                console.log(result)
            })
        });
        refrechPin();




        /*let currentPinMessages = JSON.parse(localStorage.getItem(getUrl()));
        console.log(currentPinMessages);

        currentPinMessages.splice(nbItem,1);

        console.log(currentPinMessages);

        localStorage.setItem(getUrl(), JSON.stringify(currentPinMessages));
        refrechPin();*/

    });

    // copy PIN MESSAGE to clip-board
    $(document).on("click",".copy",function(e){
        let myId = $(this).attr('id');
        let myIdSplited = myId.split('_');
        let nbItem = myIdSplited[1];
        console.log(nbItem);

        chrome.storage.local.get(getUrl(), function(item) {
            navigator.clipboard.writeText(item[getUrl()][nbItem]).then(function() {
                $('#copy_'+nbItem).replaceWith("<img id='copy_"+ nbItem +"' class='copy' src="+chrome.runtime.getURL("tick.svg")+" width='20px' style='margin-right: 6px' />");
                setTimeout(()=>{ $('#copy_'+nbItem).replaceWith("<img id='copy_"+ nbItem +"' class='copy' src="+chrome.runtime.getURL("copy.svg")+" width='20px' style='margin-right: 6px' />");},1500)
            }, function() {
                alert('erreur dans la copie du message')
            });
        });

    });





