document.getElementById("logInBtn").addEventListener("click", function (event) {
    event.preventDefault();

    let inputs = document.querySelectorAll("input");
    let errorMessages = document.querySelectorAll(".error");
    let errorEmail = document.getElementById("error-email");
    let emailField = document.getElementById("email");
    let email = emailField.value.trim();
    let passwordField = document.getElementById("password");
    let password = passwordField.value.trim();
    let isValid = true;

    // Kiểm tra tất cả các input
    inputs.forEach((input, index) => {
        if (input.value.trim() === "") {
            input.style.border = "2px solid red";
            errorMessages[index].style.display = "block";
            isValid = false;
        } else {
            input.style.border = "1px solid #ccc";
            errorMessages[index].style.display = "none";
        }
    });

    // Kiểm tra email
    if (!email.endsWith("@gmail.com")) {
        emailField.style.border = "2px solid red";
        errorEmail.style.display = "block";
        isValid = false;
    } else {
        emailField.style.border = "1px solid #ccc";
        errorEmail.style.display = "none";
    }

    // Kiểm tra mật khẩu
    if (password.length < 8) {
        passwordField.style.border = "2px solid red";
        document.getElementById("error-password").style.display = "block";
        isValid = false;
    } else {
        passwordField.style.border = "1px solid #ccc";
        document.getElementById("error-password").style.display = "none";
    }

    if (!isValid) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email);

    if (!user) {
        errorEmail.innerText = "Email chưa đăng ký!";
        errorEmail.style.display = "block";
        return;
    }

    if (user.password !== password) {
        document.getElementById("error-password").innerText = "Sai mật khẩu!";
        document.getElementById("error-password").style.display = "block";
        return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "dashboard.html";
});
