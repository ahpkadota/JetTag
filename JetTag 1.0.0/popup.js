$(document).ready(
    function() {
        //Message sender to/from content.js - get string from website
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                greeting: "hello"
            }, function(response) {
                let titles = data.slice(0,data.length-2).map(x => x.children.map(y => y.id)).flat();
                let cases = [data[data.length-1]].map(x => x.children.map(y => y.id)).flat();
                let idx = [];
                for (let i = 0; i < cases.length; i++) {
                    if (response.fair.includes(cases[i])) {
                        let but = document.getElementById("case");
                        but.style = "display: block";
                        but.innerHTML = cases[i];
                        but.addEventListener("click", function(){$('#preview').val(data[data.length-1].children[i].text + " \nREASON: \n" + data[data.length-1].children[i].ft);})
                    }
                }
                for (let i = 0; i < response.farewell.length; i++) {
                    if (titles.includes(response.farewell[i])) {
                        idx.push(response.farewell[i])
                    }
                }
                $('#multipleSelectExample').val(idx.filter(item => idx.lastIndexOf(item) == idx.indexOf(item)));
                const sel = $('#multipleSelectExample').select2('data');
                $('#preview').val(sel.map(x => x.ft).join("\r\n")+ "\nREASON: \nHello, . Thank you.");
                $('#multipleSelectExample').trigger('change');
            });
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
                $('#multipleSelectExample').select2('destroy').empty()
                $('#multipleSelectExample').attr("multiple", false)
                $('#multipleSelectExample').select2({
                    data: [data[data.length-1]]
                }).trigger('change')
                document.getElementById("preview").value = ""
                $('#multipleSelectExample').on('select2:select select2:unselect', function(e) {
                    const sel = $('#multipleSelectExample').select2('data')
                    document.getElementById("preview").value = sel.map(x => x.text) + "\nREASON: \n" + sel.map(x => x.ft).join("\r\n")
                    if (sel == "") {
                        document.getElementById("preview").value = ""
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
                    const sel = $('#multipleSelectExample').select2('data')
                    document.getElementById("preview").value = sel.map(x => x.ft).join("\r\n") + "\nREASON: Hello, . Thank you."
                    if (sel == "") {
                        document.getElementById("preview").value = ""
                    }
                });
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
            const sel = $('#multipleSelectExample').select2('data')
            document.getElementById("preview").value = sel.map(x => x.ft).join("\r\n") + "\nREASON: Hello, . Thank you."
            if (sel == "") {
                document.getElementById("preview").value = ""
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
                }, toast("Success!"))
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
    data = JSON.parse(result.key);
});


  

function toast(x) {
    var toastLiveExample = document.getElementById('liveToast');
    var toast = new bootstrap.Toast(toastLiveExample);
    document.getElementsByClassName('toast-body')[0].innerHTML = x;
    toast.show();
}
