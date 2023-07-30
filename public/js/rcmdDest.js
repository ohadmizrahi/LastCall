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

        const budget = $('#budget').val();
        const adults = $('#adults').val();
        const kids = $('#kids').val();
        const atmosphere = $('#atmosphere').val();

        vacationForm[0].reset();

        recommendedDestination.text("")
        
        const afterSubmitFormMessage = [
            'Dream Vacation Details are:',
            `Budget: $${budget}, Adults: ${adults}, Kids: ${kids}, Atmosphere: ${atmosphere}.`,
            `Searching for the best destination...`, ""
        ];

        await writingMessage(afterSubmitFormMessage);

        const recomandation = findRecomandedDestination();
        await writingMessage(recomandation);
    });
}

chatOnSubmit()

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
