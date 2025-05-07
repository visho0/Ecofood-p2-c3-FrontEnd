document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registrationMessageDiv = document.getElementById('registrationMessage');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            registrationMessageDiv.textContent = 'Las contraseñas no coinciden.';
            registrationMessageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                registrationMessageDiv.textContent = 'Registro exitoso. Datos guardados (¡INSEGURO!).';
                registrationMessageDiv.style.color = 'green';
            } else {
                registrationMessageDiv.textContent = data.message || 'Error al registrar la cuenta.';
                registrationMessageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error al enviar la petición de registro:', error);
            registrationMessageDiv.textContent = 'Error de conexión. Por favor, inténtalo de nuevo más tarde.';
            registrationMessageDiv.style.color = 'red';
        }
    });
});