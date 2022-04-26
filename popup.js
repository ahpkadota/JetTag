let atiVal = ""

$(document).ready(
    function() {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                if (tabs[0].url.includes("https://rock-va.bytedance.net/appeal_center/workbench")) {                
                    chrome.tabs.sendMessage(tabs[0].id, {
                    greeting: "hello"
                    }, function(response) {
                        let cases = [data[data.length-1]].map(x => x.children.map(y => y.id)).flat();
                        let texts = [data[data.length-1]].map(x => x.children.map(y => y.text)).flat();
                        let idx = response.farewell;
                        for (let i = 0; i < cases.length; i++) {
                            if (response.fair.includes(cases[i])) {
                                let but = document.getElementById("case");
                                but.style = "display: block";
                                but.innerHTML = cases[i];
                                but.addEventListener("click", function(){
                                    let check = document.getElementById("flexCheckDefault");
                                    check.checked = true;
                                    let cloneNodes = document.getElementsByClassName("clone");
                                    for (let i=cloneNodes.length-1;i>=0;i--) {
                                        cloneNodes[i].remove()
                                    }
                                    $('#multipleSelectExample').select2('destroy').empty()
                                    $('#multipleSelectExample').attr("multiple", false)
                                    $('#multipleSelectExample').select2({
                                        data: [data[data.length-1]]
                                    }).trigger('change')
                                    document.getElementById("preview").value = atiVal
                                    $('#multipleSelectExample').on('select2:select select2:unselect', function(e) {
                                        const sel = $('#multipleSelectExample').select2('data')
                                        document.getElementById("preview").value = atiVal + sel.map(x => x.text) + "\nREASON: \n" + sel.map(x => x.ft).join("\r\n")
                                        if (sel == "") {
                                            document.getElementById("preview").value =  atiVal
                                        }
                                    });
                                    $('#multipleSelectExample').val(cases[i]);
                                    $('#multipleSelectExample').trigger("change");
                                    $('#preview').val(data[data.length-1].children[i].text + " \nREASON: \n" + data[data.length-1].children[i].ft);
                                })
                            }
                        }
                        $('#multipleSelectExample').val(idx.filter(item => idx.lastIndexOf(item) == idx.indexOf(item)));
                        const sel = $('#multipleSelectExample').select2('data');
                        for (let i=0;i<sel.length;i++) {
                            let elm = document.getElementById("kftime");
                            let clone = elm.cloneNode(true)
                            clone.addEventListener("input", function() {
                                let clones = document.getElementsByClassName("clone");
                                let val = "";
                                for (let k=0;k<sel.length;k++) {
                                    if (clones[k].children[1].value != "" && clones[k].children[2].value != "") {
                                        val += sel[k].ft + ",\nSec " + clones[k].children[1].value + " / KF " + clones[k].children[2].value + "\n"
                                    } else if (clones[k].children[1].value == "" && clones[k].children[2].value != "") {
                                        val += sel[k].ft + ",\nKF " + clones[k].children[2].value + "\n"
                                    } else if (clones[k].children[1].value != "" && clones[k].children[2].value == "") {
                                        val += sel[k].ft + ",\nSec " + clones[k].children[1].value + "\n"
                                    } else {
                                        val += sel[k].ft + "\n"
                                    }
                                }
                                document.getElementById("preview").value = val + "REASON: \n"
                                if (sel == "") {
                                    document.getElementById("preview").value = ""
                                }
                            })
                            clone.className = "clone"
                            clone.style.display = "flex"
                            clone.firstElementChild.innerHTML = sel[i].text
                            elm.after(clone)
                        }
                        
                        $('#preview').val(sel.map(x => x.ft).join("\r\n")+ "\nREASON: \n");
                        $('#multipleSelectExample').trigger('change');
                    });
                    
                }
            });

            document.getElementById("version").innerHTML = chrome.runtime.getManifest().name +" "+chrome.runtime.getManifest().version;
            document.getElementById("author").innerHTML = "Created by "+chrome.runtime.getManifest().author;
            document.getElementById("homepage").innerHTML = chrome.runtime.getManifest().homepage_url;
            document.getElementById("homepage").href = chrome.runtime.getManifest().homepage_url;

            chrome.storage.local.get(['lol'], function(result) {
                    let t = document.getElementsByClassName("input-text");
                    let u = document.getElementsByClassName("button-shortcut");
                    let v = document.getElementsByClassName("delete");
                    for (let i=0;i<t.length;i++) {
                        t[i].value = result.lol[i];
                        v[i].addEventListener("click", function() {
                            t[i].value = "";
                        })
                            if (result.lol[i] != "") {
                                u[i].title = result.lol[i]
                            }
                            u[i].addEventListener("click", function() {
                                document.getElementById("preview").value = result.lol[i];
                            })
                        }
            });




        document.getElementById("saveShortcuts").addEventListener("click", function() {
            let t = document.getElementsByClassName("input-text");
            let u = [];
            for (let i=0;i<t.length;i++) {
                u.push(t[i].value)
            }
            chrome.storage.local.set({lol: u});

        });







        //Prevents dropdown from opening when removing tags
        $('#multipleSelectExample').select2({
            allowClear: true
        }).on('select2:unselecting', function() {
            $(this).data('unselecting', true);
        }).on('select2:opening', function(e) {
            if ($(this).data('unselecting')) {
                $(this).removeData('unselecting');
                e.preventDefault();
            }
        });

        //gets options from data variable
        $('#multipleSelectExample').select2({
            data: data.slice(0,data.length-1)
        }).trigger('change')



        let check = document.getElementById("flexCheckDefault");
        check.addEventListener("change", function() {
            if (document.getElementById("flexCheckDefault").checked) {
                let cloneNodes = document.getElementsByClassName("clone");
                for (let i=cloneNodes.length-1;i>=0;i--) {
                    cloneNodes[i].remove()
                }
                $('#multipleSelectExample').select2('destroy').empty()
                $('#multipleSelectExample').attr("multiple", false)
                $('#multipleSelectExample').select2({
                    data: [data[data.length-1]]
                }).trigger('change')
                document.getElementById("preview").value = atiVal
                $('#multipleSelectExample').on('select2:select select2:unselect', function(e) {
                    const sel = $('#multipleSelectExample').select2('data')
                    document.getElementById("preview").value = atiVal + sel.map(x => x.text) + "\nREASON: \n" + sel.map(x => x.ft).join("\r\n")
                    if (sel == "") {
                        document.getElementById("preview").value =  atiVal
                    }
                });
            } else {
                $('#multipleSelectExample').select2('destroy').empty()
                $('#multipleSelectExample').attr("multiple", true)
                $('#multipleSelectExample').select2({
                    data: data.slice(0,data.length-1)
                }).trigger('change')
                document.getElementById("preview").value = ""
                $('#multipleSelectExample').on('select2:select select2:unselect', function(e) {
                    const sel = $('#multipleSelectExample').select2('data');
                    document.getElementById("preview").value =  atiVal + sel.map(x => x.ft).join("\r\n") + "\nREASON: \n"
                    if (sel == "") {
                        document.getElementById("preview").value = atiVal + ""
                    }
                });
            }
        })


        let ati = document.getElementById("ati");
        ati.addEventListener("change", function() {
            const sel = $('#multipleSelectExample').select2('data');
            if (document.getElementById("ati").checked) {
                atiVal = "Appeal Template Issue\n";
                if (document.getElementById("flexCheckDefault").checked) {
                    document.getElementById("preview").value = atiVal + sel.map(x => x.text) + "\nREASON: \n" + sel.map(x => x.ft).join("\r\n")
                } else {
                    let clones = document.getElementsByClassName("clone");
                    let val = "";
                    for (let k=0;k<sel.length;k++) {
                        if (clones[k].children[1].value != "" && clones[k].children[2].value != "") {
                            val += sel[k].ft + ",\nSec " + clones[k].children[1].value + " / KF " + clones[k].children[2].value + "\n"
                        } else if (clones[k].children[1].value == "" && clones[k].children[2].value != "") {
                            val += sel[k].ft + ",\nKF " + clones[k].children[2].value + "\n"
                        } else if (clones[k].children[1].value != "" && clones[k].children[2].value == "") {
                            val += sel[k].ft + ",\nSec " + clones[k].children[1].value + "\n"
                        } else {
                            val += sel[k].ft + "\n"
                        }
                    }
                    document.getElementById("preview").value = atiVal + val + "REASON: \n"
                }
                if (sel == "") {
                    document.getElementById("preview").value = atiVal
                }
            } else {
                atiVal = "";
                if (document.getElementById("flexCheckDefault").checked) {
                    document.getElementById("preview").value = atiVal + sel.map(x => x.text) + "\nREASON: \n" + sel.map(x => x.ft).join("\r\n")
                } else {
                    let clones = document.getElementsByClassName("clone");
                    let val = "";
                    for (let k=0;k<sel.length;k++) {
                        if (clones[k].children[1].value != "" && clones[k].children[2].value != "") {
                            val += sel[k].ft + ",\nSec " + clones[k].children[1].value + " / KF " + clones[k].children[2].value + "\n"
                        } else if (clones[k].children[1].value == "" && clones[k].children[2].value != "") {
                            val += sel[k].ft + ",\nKF " + clones[k].children[2].value + "\n"
                        } else if (clones[k].children[1].value != "" && clones[k].children[2].value == "") {
                            val += sel[k].ft + ",\nSec " + clones[k].children[1].value + "\n"
                        } else {
                            val += sel[k].ft + "\n"
                        }
                    }
                    document.getElementById("preview").value = atiVal + val + "REASON: \n"
                }
                if (sel == "") {
                    document.getElementById("preview").value = atiVal
                }
            }
        })
        
        
        // Set the value, creating a new option if necessary
        if ($('#multipleSelectExample').find("option[value='" + data.id + "']").length) {
            $('#multipleSelectExample').val(data.id).trigger('change');
        } else {
            // Create a DOM Option and pre-select by default
            var newOption = new Option(data.text, data.id, true, true);
            // Append it to the select
            $('#multipleSelectExample').append(newOption).trigger('change');
        }

        //copies tags when pressing button
        document.getElementById("basic-addon2").addEventListener("click", function() {
            toast("Tags copied to clipboard!");
            navigator.clipboard.writeText($('#preview').val())
        });

        //sets selected tag values to textarea element for preview
        $('#multipleSelectExample').on('select2:select select2:unselect', function(e) {
            const sel = $('#multipleSelectExample').select2('data');
            let check = document.getElementById("flexCheckDefault");
            if (check.checked == false) {
                let cloneNodes = document.getElementsByClassName("clone");
                for (let i=cloneNodes.length-1;i>=0;i--) {
                    cloneNodes[i].remove()
                }
                for (let j=0;j<sel.length;j++) {
                    let elm = document.getElementById("kftime");
                    let clone = elm.cloneNode(true);
                    clone.addEventListener("input", function() {
                        let clones = document.getElementsByClassName("clone");
                        let val = "";
                        for (let k=0;k<sel.length;k++) {
                            if (clones[k].children[1].value != "" && clones[k].children[2].value != "") {
                                val += sel[k].ft + ",\nSec " + clones[k].children[1].value + " / KF " + clones[k].children[2].value + "\n"
                            } else if (clones[k].children[1].value == "" && clones[k].children[2].value != "") {
                                val += sel[k].ft + ",\nKF " + clones[k].children[2].value + "\n"
                            } else if (clones[k].children[1].value != "" && clones[k].children[2].value == "") {
                                val += sel[k].ft + ",\nSec " + clones[k].children[1].value + "\n"
                            } else {
                                val += sel[k].ft + "\n"
                            }
                        }
                        document.getElementById("preview").value = atiVal + val + "REASON: \n"
                        if (sel == "") {
                            document.getElementById("preview").value = atiVal + ""
                        }
                    })
                    clone.className = "clone"
                    clone.style.display = "flex"
                    clone.firstElementChild.innerHTML = sel[j].text
                    elm.after(clone)
                }
            }
            document.getElementById("preview").value = atiVal + sel.map(x => x.ft).join("\r\n") + "\nREASON: \n"
            if (sel == "") {
                document.getElementById("preview").value = atiVal + ""
            }
        });

        //chrome storage local test
        document.getElementById("save").addEventListener("click", function() {
            try {
                let value = document.getElementById("input").value;
                var jsonStr = value.replace(/(\w+:)|(\w+ :)/g, function(s) {
                    return '"' + s.substring(0, s.length-1) + '":';
                  });
                JSON.parse(jsonStr);
                chrome.storage.local.set({
                    key: jsonStr
                }, toast("Success! Close and open extension to display results."))
            } catch (err) {
                toast("Invalid format! :(")
            }
        })
        document.getElementById("clear").addEventListener("click", function() {
            chrome.storage.local.clear(toast("Cache cleared!"))
        });
    });


let data = [];
chrome.storage.local.get(['key'], function(result) {
    if (result.key) {
        data = JSON.parse(result.key);
    }
});
  

function toast(x) {
    var toastLiveExample = document.getElementById('liveToast');
    var toast = new bootstrap.Toast(toastLiveExample);
    document.getElementsByClassName('toast-body')[0].innerHTML = x;
    toast.show();
}

