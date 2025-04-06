document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah form disubmit secara default

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // Memeriksa username dan password
    if (username === "momok" && password === "123") {
        // Jika benar, arahkan ke halaman Home
        window.location.href = "home.html"; // Alihkan ke halaman Home
    } else {
        alert("Username atau password salah!");
    }
});
