document.addEventListener('DOMContentLoaded', function() {
    // Elementos do modal de termos
    const termsOverlay = document.getElementById('termsOverlay');
    const acceptTermsBtn = document.getElementById('acceptTerms');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // Mostrar o modal quando a página carrega (se termos não foram aceitos)
    if(localStorage.getItem('termsAccepted') !== 'true') {
        setTimeout(() => {
            termsOverlay.classList.add('active');
        }, 500);
    } else {
        agreeTermsCheckbox.checked = true;
    }
    
    // Aceitar termos
    acceptTermsBtn.addEventListener('click', function() {
        termsOverlay.classList.remove('active');
        agreeTermsCheckbox.checked = true;
        localStorage.setItem('termsAccepted', 'true');
    });
    
    // Recusar termos
    document.querySelector('.terms-decline')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Para se cadastrar em nosso serviço, você precisa aceitar os Termos e Políticas.');
    });

    // Máscara para CPF
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 3) value = value.replace(/^(\d{3})(\d)/g, '$1.$2');
        if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
        if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4');
        if (value.length > 11) value = value.substring(0, 14);
        
        e.target.value = value;
    });

    // Máscara para telefone
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) value = '(' + value;
        if (value.length > 3) value = value.substring(0, 3) + ') ' + value.substring(3);
        if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10);
        if (value.length > 15) value = value.substring(0, 15);
        
        e.target.value = value;
    });

    // Validação do formulário com melhor feedback visual
    document.getElementById('registerForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Elementos do formulário
        const form = e.target;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Reset de erros
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
        });
        
        // Validações
        let isValid = true;
        
        if (!name) {
            showError('name', 'Por favor, informe seu nome completo');
            isValid = false;
        }
        
        if (!email || !validateEmail(email)) {
            showError('email', 'Por favor, informe um e-mail válido');
            isValid = false;
        }
        
        if (!cpf || cpf.length < 14) {
            showError('cpf', 'CPF inválido');
            isValid = false;
        }
        
        if (!phone || phone.length < 14) {
            showError('phone', 'Telefone inválido');
            isValid = false;
        }
        
        if (!password || password.length < 6) {
            showError('password', 'A senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showError('confirmPassword', 'As senhas não coincidem');
            isValid = false;
        }
        
        if (!agreeTerms) {
            termsOverlay.classList.add('active');
            alert('Você precisa aceitar os Termos e Política de Privacidade');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Botão de loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div> Enviando...';
        
        try {
            const response = await fetch('/register/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    cpf: cpf.replace(/\D/g, ''), 
                    phone: phone.replace(/\D/g, ''), 
                    password 
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = '/login';
            } else {
                // Tratamento de erros específicos do servidor
                if (result.error === 'Email already exists') {
                    showError('email', 'Este e-mail já está cadastrado');
                } else if (result.error === 'CPF already exists') {
                    showError('cpf', 'Este CPF já está cadastrado');
                } else {
                    alert(result.message || 'Erro no cadastro. Tente novamente.');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão. Tente novamente mais tarde.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
    
    // Função auxiliar para mostrar erros
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');
        
        inputGroup.classList.add('error');
        
        let errorElement = inputGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            inputGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    // Validação de e-mail
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

        // Constante com a URL da API
        const API_URL = 'http://127.0.0.1:8080/api/usuarios'; // endpoint base

   
        // Função para cadastrar usuário
        async function cadastrarUsuario(dados) {
            const res = await fetch(`${API_URL}/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (!res.ok) {
                let errorMessage = 'Erro na requisição';
                try {
                    const err = await res.json();
                    errorMessage = err.message || errorMessage;
                } catch {
                    // resposta não é JSON, ignora
                }
                throw new Error(errorMessage);
            }

            return res.json();
        }

        // Event listener para o formulário
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;

            // Obter dados do formulário
            const data = {
                nome: form.name.value,
                email: form.email.value,
                cpf: form.cpf.value.replace(/\D/g, ''),
                telefone: form.phone.value.replace(/\D/g, ''),
                senha: form.password.value,
                confirmarSenha: form.confirmPassword.value,
                agreeTerms: form.agreeTerms.checked
            };

            // Validação básica - senhas coincidem
            if (data.senha !== data.confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            // Validação - termos aceitos (já garantido pelo required no HTML)
            if (!document.getElementById('agreeTerms').checked) {
                alert('Você deve aceitar os termos de serviço!');
                return;
            }

            try {
                // Chamada à API
                const response = await cadastrarUsuario(data);
                console.log('Usuário cadastrado com sucesso:', response);
                alert('Cadastro realizado com sucesso!');

                // Redirecionar para login após cadastro bem-sucedido
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Erro ao cadastrar: ' + error.message);
            }
        });

        // Máscara para CPF (opcional)
        document.getElementById('cpf').addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
            if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
            if (value.length > 11) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');

            e.target.value = value.substring(0, 14);
        });

        // Máscara para telefone (opcional)
        document.getElementById('phone').addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue = '(' + value.substring(0, 2);
            }
            if (value.length > 2) {
                formattedValue += ') ' + value.substring(2, 7);
            }
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 11);
            }

            e.target.value = formattedValue;
        });