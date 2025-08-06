package main

import (
	"go-web3-project/internal/blockchain"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	client := blockchain.NewBlockchainClient()

	err := client.Connect("http://localhost:8545")
	if err != nil {
		log.Fatalf("Failed to connect to blockchain: %v", err)
	}

	// Corrija o caminho dos templates
	tmpl, err := template.ParseFiles("../web/templates/index.html")
	if err != nil {
		log.Fatalf("Erro ao carregar template: %v", err)
	}

	// Corrija o caminho dos arquivos estáticos
	staticDir := filepath.Join("..", "web", "static")
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		data := map[string]interface{}{
			"Title":   "Bem-vindo ao Go Web3 Project",
			"Header":  "Bem-vindo ao Go Web3 Project!",
			"Message": "Olá, seja bem vindo!",
		}
		err := tmpl.Execute(w, data)
		if err != nil {
			http.Error(w, "Erro ao renderizar template", http.StatusInternalServerError)
			log.Printf("Erro ao executar template: %v", err)
		}
	})

	log.Println("Servidor iniciado em http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
