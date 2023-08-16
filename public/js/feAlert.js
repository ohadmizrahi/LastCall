function hideCustomAlert() {
  const customAlertOk = $('#custom-alert-ok');
  customAlertOk.on('click', () => {
    const customAlert = $('#custom-alert');
    customAlert.hide();
  });
}
hideCustomAlert()

