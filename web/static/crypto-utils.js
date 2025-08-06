class CryptoUtils {
    static async encrypt(text, key) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encodedText = new TextEncoder().encode(text);
        
        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encodedText
        );
        
        const encryptedData = new Uint8Array([
            ...iv,
            ...new Uint8Array(ciphertext)
        ]);
        
        return btoa(String.fromCharCode(...encryptedData));
    }

    static async decrypt(encryptedData, key) {
        const data = new Uint8Array(
            atob(encryptedData).split('').map(c => c.charCodeAt(0))
        );
        
        const iv = data.slice(0, 12);
        const ciphertext = data.slice(12);
        
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );
        
        return new TextDecoder().decode(decrypted);
    }
}