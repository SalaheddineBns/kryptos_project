# 💸 Kryptos Project

Projet global de suivi, gestion et analyse de cryptomonnaies basé sur une architecture **microservices (Spring Boot)** avec un **frontend React**.

---
## ❗ Problématique

> Comment offrir aux investisseurs en cryptomonnaies une plateforme centralisée, intelligente et personnalisée pour suivre en temps réel les prix, gérer leur portefeuille, recevoir des alertes, analyser leur historique d'investissement et bénéficier d’un accompagnement automatisé ?

## 🧱 Structure du projet

```bash
kryptos_project/
│
├── ms-crypto                # Service de données de marché (Binance, Coinbase)
├── ms-crypto-wallet         # Gestion des portefeuilles utilisateurs
├── ms-crypto-alerts         # Système d'alertes de prix personnalisées
├── ms-crypto-chatBot        # ChatBot crypto intelligent (Spring AI, NLP)
├── identity-crypto-service  # Authentification, autorisation (JWT)
├── front_Kryptos            # Frontend React (interface utilisateur)
└── README.md
```

---

## 📦 Démarrer le projet

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/kryptos_project.git
cd kryptos_project
```

---

### 2. Lancer les microservices

Depuis chaque dossier :

```bash
cd ms-crypto
./mvnw spring-boot:run
```

Répéter pour :
- `ms-crypto-wallet`
- `ms-crypto-alerts`
- `ms-crypto-chatBot`
- `identity-crypto-service`

---

### 3. Lancer le frontend React

```bash
cd front_Kryptos
npm install
npm run dev
```

---

## 📈 Fonctionnalités principales

- 🔐 Authentification sécurisée avec JWT
- 📊 Suivi en temps réel des prix des cryptos (Binance & Coinbase)
- 📁 Gestion de portefeuille multi-actifs
- 🔔 Alertes personnalisables sur les seuils de prix
- 🤖 ChatBot intelligent pour assistance crypto
- 📉 Statistiques et historique sur les cryptos préférées

---

## 🧩 Détail des microservices

### `identity-crypto-service`
- Authentification / Inscription
- Gestion des tokens JWT
- Sécurisation des endpoints des autres services

### `ms-crypto`
- Récupération en temps réel des prix via les API Binance/Coinbase
- Moyennes historiques (par jour, semaine, mois, année)
- Exposition de données agrégées via REST

### `ms-crypto-wallet`
- Gestion des portefeuilles utilisateurs
- Suivi des actifs en temps réel
- Ajout/retrait d’actifs

### `ms-crypto-alerts`
- Définition de seuils d’alerte personnalisés
- Notifications automatiques (e-mail, webhook, etc.)

### `ms-crypto-chatBot`
- Assistance via langage naturel
- Intégration d’IA (Spring AI, NLP)
- Réponses contextuelles sur les prix, les tendances, etc.

---

## 🖥️ Interface utilisateur (React)

- Authentification / Inscription
- Dashboard personnalisé (prix, portefeuille, alertes)
- Interface intuitive pour les alertes et statistiques
- Intégration du chatbot en ligne

---

## 🚀 Stack technique

- **Backend** : Spring Boot 3, Spring Cloud, Spring Security, Spring WebFlux
- **Frontend** : React.js, Tailwind CSS, Axios
- **API Crypto** : Binance, Coinbase
- **Communication inter-service** : REST + FeignClient
- **Base de données** : H2 (dev), PostgreSQL (prod)
- **Token** : JWT
- **Observabilité** : Spring Boot Actuator (optionnel)

---

## 👥 Contributeurs

- Salaheddine BENKHANOUS  
- Khalid KOUTTANE  
- Sid Ali AMRANI  
- Tony
