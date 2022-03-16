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
                let titles = data.map(x => x.children.map(y => y.text)).flat();
                let idx = [];
                for (let i = 0; i < titles.length; i++) {
                    var replace = "," + titles[i].replace(/[()&]/g, "") + ";";
                    var re = new RegExp(replace, "g");
                    if ((response.farewell.replace(/[()&]/g, "").match(re) || []).length == 1) {
                        idx.push(i)
                    }
                }
                $('#multipleSelectExample').val(idx);
                const sel = $('#multipleSelectExample').select2('data');
                $('#preview').val(sel.map(x => x.fullText).join("\r\n")+ "\nREASON: ");
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
            data: data
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
            document.getElementById("preview").value = sel.map(x => x.fullText).join("\r\n") + "\nREASON: "
            if (sel == "") {
                document.getElementById("preview").value = ""
            }
        });

        //chrome storage local test
        document.getElementById("save").addEventListener("click", function() {
            try {
                let value = document.getElementById("input").value;
                JSON.parse(value);
                chrome.storage.local.set({
                    key: value
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
