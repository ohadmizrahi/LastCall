function chatOnLoad() {
    const userName = Cookies.get('name')
    const onLoadMessage = [
        `Welcome ${userName}!`,
        'Let me find the perfect vacation for you based on your preferences.',
        'Please Enter your dream vacation details in the box to the left.']
    $(document).ready(() => {
        writingMessage(onLoadMessage);
    });
}
chatOnLoad()

async function chatOnSubmit() {
    const vacationForm = $('#vacationForm');

    vacationForm.on('submit', async function (event) {
        const recommendedDestination = $('#recommendedDestination');
        event.preventDefault();
        $("#after-chat-buttons").hide();

        const travelStyle = $('#travel-style').val();
        const seasonPreference = $('#season-preference').val();
        const adults = $('#adults').val();
        const kids = $('#kids').val();
        const duration = $('#duration-value').val() + " " + $('#duration-size').val();
        const selectedInterests = $('.interest-checkbox input[type="checkbox"]:checked').map(function () { return $(this).val(); }).get();
        const minBudget = "$" + $('#min-budget').val();
        const maxBudget = "$" + $('#max-budget').val();
        const uniqueDestinations = $('#unique-destinations').val() == "1" ? "Look for" : "Don't look for";

        resetForm(this)

        recommendedDestination.text("")

        const afterSubmitFormMessage = [
            'Dream Vacation Details are:',
            `Travel Style: ${travelStyle}`,
            `Season Preference: ${seasonPreference}`,
            `Budget: ${minBudget} - ${maxBudget}`,
            `Travel Duration: ${duration}`,
             `Adults: ${adults}, Kids: ${kids}`,
             `Top Three Interests: ${selectedInterests}`,
             `${uniqueDestinations} Unique Destinations.`,
            `Searching for the best destination...`
        ];

        await writingMessage(afterSubmitFormMessage);

        const data = {
            travelStyle: travelStyle,
            seasonPreference: seasonPreference,
            adults: adults,
            kids: kids,
            duration: duration,
            selectedInterests: selectedInterests,
            minBudget: minBudget,
            maxBudget: maxBudget,
            uniqueDestinations: uniqueDestinations
        }
        console.log("-------------------");
        const recomandation = await getRecomandedDestination(data);
        $("#after-chat-buttons").show();

        $(document).ready(() => {
            $("#to-dest-card").data("destination", recomandation[0])
        });


        await writingMessage(recomandation);
    });
}

chatOnSubmit()

function minMaxBudgetValidation() {
    $('#min-budget').on('input', function () {
        var minBudgetValue = parseFloat($(this).val()) + 1;
        $('#max-budget').attr('min', minBudgetValue);
    });
}
minMaxBudgetValidation()

function resetForm(form) {
    $(form).trigger('reset');
    $('.interest-checkbox input[type="checkbox"]').prop('disabled', false);
}

async function getRecomandedDestination(data) {
    return fetch("/dest/get_recomandation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(recommendation => {
        return recommendation;
      })
      .catch(error => {
            console.log(error);
            throw error;
      });
}


async function writingMessage(messageToWrite) {
    const typeDelay = 30;
    let typingDelay = 0;

    for (const message of messageToWrite) {
        await new Promise((resolve) => {
            setTimeout(() => {
                if (typeof message === 'string') {
                    Writer(message);
                } else if (typeof message === 'object') {
                    setTimeout(() => {
                    Writer(`Our recommendation is: ${message.name}, ${message.country}.`, true);
                },typeDelay * (message.name.length + 18)*2);
                    setTimeout(() => {
                        Writer(`${message.description}`);
                        resolve();
                    }, typeDelay * (message.name.length + 18)*4);
                }
                resolve();
            }, typingDelay);
        });

        typingDelay = typeDelay * message.length + 500;
    }
}

function Writer(message, isDestination=false) {
    const typeDelay = 30;
    const recommendedDestination = $('#recommendedDestination');
    
    if (recommendedDestination.length === 0) {
        console.warn('Element with ID "recommendedDestination" not found.');
        return;
    }
    
    const messageElement = $('<div>').addClass('typing-message')
    if (isDestination) {
        messageElement.attr('id', 'typing-destination');
    }
    
    recommendedDestination.append(messageElement);

    let index = 0;
    const typingInterval = setInterval(() => {
        if (index < message.length) {
            messageElement.text(messageElement.text() + message.charAt(index));
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, typeDelay);
    
    recommendedDestination.scrollTop(recommendedDestination[0].scrollHeight);
}


function restrictTopInerest() {
    var maxCheckboxLimit = 3;

    $('.interest-checkbox input[type="checkbox"]').on('change', function () {
        var checkedCount = $('.interest-checkbox input[type="checkbox"]:checked').length;

        if (checkedCount === maxCheckboxLimit) {
            $('.interest-checkbox input[type="checkbox"]:not(:checked)').prop('disabled', true);
        } else {
            $('.interest-checkbox input[type="checkbox"]:not(:checked)').prop('disabled', false);
        }
    });
}
restrictTopInerest()

function toggleGuestsSelection() {
    $("#guestsSelection").toggle();
    var placeholderText = $("#guestsSelection").is(":visible") ? "Close Guests Selection" : "Open Guests Selection";
    $("#guests").attr("placeholder", placeholderText);
}

function adjustValue(inputId, increment) {
    var inputField = $("#" + inputId);
    var currentValue = parseInt(inputField.val());
    var newValue = currentValue + increment;
    if (inputId === "adults" && newValue < 1) {
        newValue = 1;
    }
    if (inputId === "kids" && newValue < 0) {
        newValue = 0; 
    }
    inputField.val(newValue);
}