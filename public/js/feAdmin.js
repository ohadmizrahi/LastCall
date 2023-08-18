

function generateNewFlights() {
    fetch("/admin/generate_new_flights", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(flights => {
            console.log(`${flights.flightsCount} flights was inserted`)
            window.location.href = "/admin"
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = "/admin"
        });
}

function showHideReturnFlight() {
    $("#returnFlightCheckbox").change(function () {
        if (this.checked) {
            $("#returnFlightDetails").collapse("show");
            $(".return-detail").attr("required", true);
        } else {
            $("#returnFlightDetails").collapse("hide");
            $(".return-detail").removeAttr("required");
        }
    })
}

function manageAuthSelection() {
    const actionSelect = $('select[name="action"]');
    const newAuthLevelGroup = $('#new-auth-level-group');
    const confirmationGroup = $('#confirmation-group');
    const submit = $('#manage-auth-form button[type="submit"]');
    const confirmDeleteButton = $('#confirmDelete');
    const cancelDeleteButton = $('#cancelDelete');

    actionSelect.on('change', function () {
        if (this.value === 'update') {
            newAuthLevelGroup.show();
            confirmationGroup.hide();
            submit.show()
        } else if (this.value === 'delete') {
            newAuthLevelGroup.hide();
            confirmationGroup.show();
            submit.hide()
        }
    });
    cancelDeleteButton.on('click', function () {
        confirmationGroup.hide();
        submit.show()
        actionSelect.val('');
    });

    confirmDeleteButton.on('click', function () {
        submit.show()
        confirmationGroup.hide();
    });
}

manageAuthSelection()
showHideReturnFlight()
destinationValidation()