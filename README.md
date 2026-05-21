# Projektuppgift – Databas (DT207G Backend-baserad webbutveckling)

**Genomförd av: joha2102**

Länk till API:t: 

## Projektbeskrivning

Detta projekt är del 1 av Projektuppgiften i kursen *Backend-baserad webbutveckling*.

Syftet är att skapa en webbtjänst som hanterar 

Del 2 av uppgiften är en frontend-applikation som finns här:  
**länk kommer**

## Installation

Initiera npm-projekt:
```
npm init -y
```

Installera paket:
```
npm install express cors dotenv jsonwebtoken bcrypt pg
```

Installera nodemon:
npm install nodemon --save-dev

Kör projektet:
```
npm run serve
```

### Basrelationer
users (id (PK), username, password, account_created, is_admin)
categories (id (PK), name, created_at)
menu_items (id(PK), name, price, description, created_at, is_available, is_offer, category_id(FK))
messages (id (PK), name, email, message, is_handled, created_at)

