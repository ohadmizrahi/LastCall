function chatOnLoad() {
    const userName = Cookies.get('name')
    const onLoadMessage = [
        `Welcome ${userName}!`,
        'Let me find the perfect vacation for you based on your preferences.',
        'Please Enter your dream vacation details in the box to the left']
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

        const travelStyle = $('#travel-style').val();
        const seasonPreference = $('#season-preference').val();
        const adults = $('#adults').val();
        const kids = $('#kids').val();
        const atmosphere = $('#atmosphere').val();
        const duration = $('#duration-value').val() + " " + $('#duration-size').val();
        const historical = $('#historical-preference').val();
        var selectedInterests = $('.interest-checkbox input[type="checkbox"]:checked').map(function () { return $(this).val(); }).get();

        console.log(selectedInterests);
        // const atmosphere = $('#atmosphere').val();
        // const atmosphere = $('#atmosphere').val();

        resetForm(this)

        recommendedDestination.text("")

        const afterSubmitFormMessage = [
            'Dream Vacation Details are:',
            `Travel Style: ${travelStyle}, Adults: ${adults}, Kids: ${kids}, Atmosphere: ${atmosphere} ${duration}.`,
            `Searching for the best destination...`, ""
        ];

        await writingMessage(afterSubmitFormMessage);

        const recomandation = findRecomandedDestination();
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

function findRecomandedDestination() {
    const recomandetion = [{
        destination: "Sunny Beach Resort, Maldives",
        description: "Spend your dream vacation at the beautiful Sunny Beach Resort in Maldives. Relax on sandy beaches, enjoy water activities, and indulge in luxury amenities."
    }]
    return recomandetion
}

const typeDelay = 35;
async function writingMessage(messageToWrite) {
    let typingDelay = 0;

    for (const message of messageToWrite) {
        await new Promise((resolve) => {
            setTimeout(() => {
                if (typeof message === 'string') {
                    Writer(message);
                } else if (typeof message === 'object') {
                    Writer(`Our recommendation is \n ${message.destination}.\n`);
                    setTimeout(() => {
                        Writer(`${message.description}`);
                        resolve();
                    }, typeDelay * (message.destination.length + 18));
                }
                resolve();
            }, typingDelay);
        });

        typingDelay += typeDelay * message.length + 500;
    }
}

function Writer(message) {
    const recommendedDestination = $('#recommendedDestination');
    const messageElement = $('<div>').addClass('typing-message')
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