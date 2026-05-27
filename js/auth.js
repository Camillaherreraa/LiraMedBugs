

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile,
    deleteUser,
    linkWithCredential,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDDZIOSglp8UK_W7sKhAe-ao1jXT3U8ZoE",

    authDomain: "liramed-cc785.firebaseapp.com",

    projectId: "liramed-cc785",

    storageBucket: "liramed-cc785.firebasestorage.app",

    messagingSenderId: "503164756360",

    appId: "1:503164756360:web:34512b873a51c755f6da3d",

    measurementId: "G-HY64BCCG87"

};

let app, auth;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (e) {
    console.warn("Firebase não inicializado corretamente. Verifique firebaseConfig.", e);
}

function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = `auth-message ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function handleFirebaseError(error, messageEl) {
    console.error(error);
    if (error.code === 'auth/invalid-api-key') {
        showMessage(messageEl, 'Erro: Chave do Firebase (apiKey) não configurada no código.', 'error');
    } else if (error.code === 'auth/email-already-in-use') {
        showMessage(messageEl, 'Este email já está cadastrado.', 'error');
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        showMessage(messageEl, 'Email ou senha inválidos.', 'error');
    } else if (error.code === 'auth/invalid-email') {
        showMessage(messageEl, 'O formato do e-mail é inválido. Verifique e tente novamente.', 'error');
    } else {
        showMessage(messageEl, `Erro: ${error.message}`, 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
        });

        registerForm.addEventListener('submit', (e) => {
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const messageEl = document.getElementById('reg-message');
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            if (!name) {
                showMessage(messageEl, 'O nome é obrigatório.', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage(messageEl, 'A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }

            if (!auth) {
                showMessage(messageEl, 'Firebase não configurado.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Carregando...';

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    return updateProfile(userCredential.user, { displayName: name });
                })
                .then(() => {
                    showMessage(messageEl, 'Cadastro realizado com sucesso! Redirecionando...', 'success');
                    setTimeout(() => { window.location.href = 'loja.html'; }, 150000);
                })
                .catch((error) => {
                    handleFirebaseError(error, messageEl);
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Criar Conta';
                });
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const messageEl = document.getElementById('login-message');
            const submitBtn = loginForm.querySelector('button[type="submit"]');


            if (!auth) {
                showMessage(messageEl, 'Firebase não configurado.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Carregando...';

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    showMessage(messageEl, 'Login realizado com sucesso!', 'success');
                    setTimeout(() => { window.location.href = 'loj.html'; }, 1000);
                })
                .catch((error) => {
                    handleFirebaseError(error, messageEl);
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                });
        });

        const forgotPasswordBtn = document.getElementById('forgot-password');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value.trim();
                const messageEl = document.getElementById('login-message');
                
                if (!email) {
                    showMessage(messageEl, 'Digite seu e-mail no campo acima e clique em "Esqueci minha senha" novamente.', 'error');
                    return;
                }

                sendPasswordResetEmail(auth, email)
                    .then(() => {
                        showMessage(messageEl, 'E-mail de redefinição enviado! Verifique sua caixa de entrada e spam.', 'success');
                    })
                    .catch((error) => {
                        handleFirebaseError(error, messageEl);
                    });
            });
        }

        const googleBtns = document.querySelectorAll('.btn-google');
        const provider = new GoogleAuthProvider();

        googleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const formId = btn.closest('form').id;
                const messageEl = formId === 'form-login' ? document.getElementById('login-message') : document.getElementById('reg-message');

                if (!auth) {
                    showMessage(messageEl, 'Firebase não configurado.', 'error');
                    return;
                }

                signInWithPopup(auth, provider)
                    .then((result) => {
                        window.location.href = 'loja.html';
                    }).catch((error) => {
                        if (error.code === 'auth/account-exists-with-different-credential') {
                            const email = error.customData.email;
                            const pendingCred = GoogleAuthProvider.credentialFromError(error);
                            
                            const password = prompt(`O e-mail ${email} já possui uma conta. Digite sua senha para vincular sua conta do Google:`);
                            
                            if (password) {
                                signInWithEmailAndPassword(auth, email, password)
                                    .then((result) => {
                                        return linkWithCredential(result.user, pendingCred);
                                    })
                                    .then(() => {
                                        alert('Contas vinculadas com sucesso!');
                                        window.location.href = 'loja.html';
                                    })
                                    .catch((err) => {
                                        showMessage(messageEl, 'Senha incorreta ou erro ao vincular contas.', 'error');
                                    });
                            } else {
                                showMessage(messageEl, 'Vinculação cancelada. Faça login com e-mail e senha.', 'error');
                            }
                        } else {
                            handleFirebaseError(error, messageEl);
                        }
                    });
            });
        });

        if (auth) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    window.location.href = 'loja.html';
                }
            });
        }
    }

    const isLojaPage = window.location.pathname.includes('loja.html');

    if (isLojaPage) {
        if (!auth) {
            document.querySelectorAll('.user-name-display').forEach(el => el.textContent = "Erro de Configuração");
        } else {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userNameDisplays = document.querySelectorAll('.user-name-display');
                    const displayName = user.displayName || user.email.split('@')[0];
                    userNameDisplays.forEach(el => {
                        el.textContent = `Olá, ${displayName}`;
                    });
                } else {
                    window.location.href = 'login.html';
                }
            });
        }

        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn && auth) {
            logoutBtn.addEventListener('click', () => {
                signOut(auth).then(() => {
                    window.location.href = 'index.html';
                }).catch((error) => {
                    console.error("Erro ao sair", error);
                });
            });
        }

        const btnProfile = document.getElementById('btn-profile');
        const profileModal = document.getElementById('profile-modal');
        const closeProfileModal = document.getElementById('close-profile-modal');
        const formUpdateProfile = document.getElementById('form-update-profile');
        const updateNameInput = document.getElementById('update-name');
        const btnDeleteAccount = document.getElementById('btn-delete-account');
        const profileMessage = document.getElementById('profile-message');

        if (btnProfile && profileModal && auth) {
            btnProfile.addEventListener('click', () => {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    updateNameInput.value = currentUser.displayName || '';
                }
                profileModal.style.display = 'block';
            });

            closeProfileModal.addEventListener('click', () => {
                profileModal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    profileModal.style.display = 'none';
                }
            });

            if (formUpdateProfile) {
                formUpdateProfile.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const novoNome = updateNameInput.value.trim();
                    if (!novoNome) return;

                    const currentUser = auth.currentUser;
                    if (currentUser) {
                        updateProfile(currentUser, { displayName: novoNome }).then(() => {
                            showMessage(profileMessage, 'Perfil atualizado com sucesso!', 'success');
                            const userNameDisplays = document.querySelectorAll('.user-name-display');
                            userNameDisplays.forEach(el => {
                                el.textContent = `Olá, ${novoNome}`;
                            });
                            setTimeout(() => { profileModal.style.display = 'none'; }, 2000);
                        }).catch(error => {
                            handleFirebaseError(error, profileMessage);
                        });
                    }
                });
            }

            if (btnDeleteAccount) {
                btnDeleteAccount.addEventListener('click', () => {
                    const confirmDelete = confirm("Tem certeza absoluta que deseja excluir sua conta? Esta ação não pode ser desfeita e você perderá o acesso.");
                    if (confirmDelete) {
                        const currentUser = auth.currentUser;
                        if (currentUser) {
                            deleteUser(currentUser).then(() => {
                                alert("Conta excluída com sucesso.");
                                window.location.href = 'index.html';
                            }).catch(error => {
                                if (error.code === 'auth/requires-recent-login') {
                                    alert("Por motivos de segurança, você precisa fazer login novamente antes de excluir sua conta.");
                                    signOut(auth).then(() => window.location.href = 'login.html');
                                } else {
                                    handleFirebaseError(error, profileMessage);
                                }
                            });
                        }
                    }
                });
            }
        }

    }
});
