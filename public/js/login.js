// Validação simples do formulário
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validação básica
    if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Aqui você pode adicionar a lógica de autenticação
    console.log('Email:', email);
    console.log('Password:', password);

    // Simulando um login bem-sucedido
    alert('Login realizado com sucesso! (simulação)');
    window.location.href = '/../../views/inicial.html';

    // Redirecionamento (substitua pela sua URL)
    // window.location.href = 'dashboard.html';
});

        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            const dados = {
                email: email,
                senha: senha
            };

            try {
                const response = await fetch("http://localhost:8080/api/usuarios/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });

                if (!response.ok) {
                    const erro = await response.text();
                    alert("Erro: " + erro);
                    return;
                }

                const usuario = await response.json();
                console.log("Usuário logado:", usuario);

                localStorage.setItem("usuario", JSON.stringify(usuario));

                alert("Login bem-sucedido!");
                window.location.href = "inicial.html"; // redireciona após login

            } catch (error) {
                alert("Erro na requisição: " + error.message);
            }
        });