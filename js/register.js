document.getElementById("registerBtn").addEventListener("click", function (event) {
    event.preventDefault();

    let inputs = document.querySelectorAll("input");
    let errorConfirm = document.getElementById("error-confirm");
    
    let passwordField = document.getElementById("password");

    let password = passwordField.value.trim();
    let errorMessages = document.querySelectorAll(".error");
    let errorEmail = document.getElementById("error-email");
    let emailField = document.getElementById("email");
    let email = emailField.value.trim();
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

    // Kiểm tra mật khẩu xác nhận
    let confirmField = document.getElementById("confirm");
    let confirmPassword = confirmField.value.trim();
    let confirmMessage = document.getElementById("error-confirm");

    if (password !== confirmPassword) {
        confirmMessage.style.display = "block";
        confirmField.style.border = "2px solid red";
        isValid = false;
    } else {
        confirmMessage.style.display = "none";
        confirmField.style.border = "1px solid #ccc";
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (isValid) {
        let fullName = document.getElementById("name").value.trim();
        let id = users.length ? users[users.length - 1].id + 1 : 1;

        let userData = {
            id: id,
            fullName,
            email,
            password
        };

        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));

        window.location.href = "login.html";
    }
});
