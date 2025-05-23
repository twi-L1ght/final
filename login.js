document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value;

    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }

    fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/dashboard.html";
    })

    .then(res => {
        console.log("Response status:", res.status);
        return res.text();
    })
    .then(text => {
        console.log("Response text:", text);
        if (text === "success") {
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Login failed: " + text);
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        alert("Error connecting to server: " + err.message);
    });
});

