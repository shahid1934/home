(function () {
  emailjs.init("kQrNenvXjmhMa8Vb_"); // required
})();

function sendMail() {
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_6lxkstf", "template_q9vi9j3", params)
    .then(function () {
      alert("Message sent successfully!");
      document.getElementById("contact-form").reset();
    })
    .catch(function (error) {
      console.log(error);
      alert("Failed to send message");
    });
}