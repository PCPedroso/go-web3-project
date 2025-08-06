class WalletConnect {
    constructor() {
        this.currentAccount = null;
        this.googleAccount = null;
        this.wallets = [];
        this.userPicture = null;
        this.loadWallets();
    }

    loadWallets() {
        const storedWallets = localStorage.getItem('wallets');
        this.wallets = storedWallets ? JSON.parse(storedWallets) : [];
    }

    saveWallets() {
        localStorage.setItem('wallets', JSON.stringify(this.wallets));
    }

    updateGoogleButton(userName, userPicture) {
        const button = document.getElementById('google-connect-btn');
        if (button) {
            if (userName) {
                button.innerHTML = `
                    <img src="${userPicture || ''}" alt="" class="google-user-pic">
                    <span>${userName}</span>
                `;
                button.classList.add('connected');
            } else {
                button.innerHTML = 'Conectar com Google';
                button.classList.remove('connected');
            }
        }
    }

    async connectGoogle() {
        try {
            const client = google.accounts.oauth2.initTokenClient({
                client_id: '219393133871-8e9g6po55cdqosgm80nk22rbbcdcvema.apps.googleusercontent.com',
                scope: 'email profile',
                callback: async (response) => {
                    if (response.access_token) {
                        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: { Authorization: `Bearer ${response.access_token}` }
                        }).then(res => res.json());

                        this.googleAccount = userInfo.name || userInfo.email;
                        this.userPicture = userInfo.picture;
                        
                        localStorage.setItem('googleAccount', this.googleAccount);
                        localStorage.setItem('userPicture', this.userPicture);
                        
                        this.updateGoogleButton(this.googleAccount, this.userPicture);
                        document.getElementById('wallet-register').style.display = 'block';
                        this.renderWalletsList();
                    }
                }
            });
            client.requestAccessToken();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao conectar com Google. Por favor, tente novamente.');
        }
    }

    renderWalletsList() {
        const listContainer = document.getElementById('wallets-list');
        if (!listContainer) return;

        listContainer.innerHTML = this.wallets.length === 0 
            ? '<p>Nenhuma carteira cadastrada.</p>'
            : this.wallets.map(wallet => `
                <div class="wallet-item">
                    <div class="wallet-item-header">
                        <h3>${wallet.name}</h3>
                        <button onclick="walletConnect.deleteWallet('${wallet.address}')">Excluir</button>
                    </div>
                    <p class="wallet-address">${wallet.address}</p>
                    ${wallet.description ? `<p class="wallet-description">${wallet.description}</p>` : ''}
                    <div class="wallet-details">
                        ${wallet.externalCode ? `<span>Código: ${wallet.externalCode}</span>` : ''}
                        ${wallet.limit ? `<span>Limite: ${wallet.limit}</span>` : ''}
                        ${wallet.trusted ? '<span class="trusted">Confiável</span>' : ''}
                    </div>
                </div>
            `).join('');
    }

    deleteWallet(address) {
        if (confirm('Tem certeza que deseja excluir esta carteira?')) {
            this.wallets = this.wallets.filter(w => w.address !== address);
            this.saveWallets();
            this.renderWalletsList();
        }
    }
}

// Initialize the wallet connect instance
const walletConnect = new WalletConnect();

document.addEventListener('DOMContentLoaded', () => {
    if (walletConnect) {
        console.log('WalletConnect initialized');
        
        // Restore Google account if previously logged in
        const storedGoogleAccount = localStorage.getItem('googleAccount');
        const storedUserPicture = localStorage.getItem('userPicture');
        
        if (storedGoogleAccount) {
            walletConnect.googleAccount = storedGoogleAccount;
            walletConnect.userPicture = storedUserPicture;
            walletConnect.updateGoogleButton(storedGoogleAccount, storedUserPicture);
            document.getElementById('wallet-register').style.display = 'block';
            walletConnect.renderWalletsList();
        }
    }

    // Add form submit handler
    document.getElementById('wallet-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newWallet = {
            address: formData.get('address'),
            name: formData.get('name'),
            description: formData.get('description'),
            externalCode: formData.get('external-code'),
            limit: formData.get('limit'),
            trusted: formData.get('trusted') === 'on',
            createdAt: new Date().toISOString()
        };

        // Check for duplicates
        if (walletConnect.wallets.some(w => w.address === newWallet.address)) {
            alert('Esta carteira já está cadastrada!');
            return;
        }

        // Add new wallet
        walletConnect.wallets.push(newWallet);
        walletConnect.saveWallets();
        walletConnect.renderWalletsList();
        
        alert('Carteira salva com sucesso!');
        e.target.reset();
    });
});