document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Mencegah form submit default

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Harap isi username dan password!");
        return;
    }

    try {
        const response = await fetch('http://localhost/tokoBangunan/backend/admin/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // penting jika backend pakai PHP session (cookie)
            body: JSON.stringify({
                username,
                password
            })
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            window.location.href = "home.html";
        } else {
            alert(result.message || "Login gagal. Cek username dan password.");
        }
    } catch (error) {
        console.error('Login error:', error);
        alert("Terjadi kesalahan saat login.");
    }
});
