# Projektuppgift – Databas (DT207G Backend-baserad webbutveckling)

**Genomförd av: joha2102**

Länk till API:t: 
Webbapplikationen finns här: 

Detta projekt är del 1 av Projektuppgiften i kursen *Backend-baserad webbutveckling*.

Del 2 av uppgiften är en frontend-applikation som finns här:  
https://github.com/JohannaHannahoJ/bbw-projektuppgift-frontend-jh

## Projektbeskrivning
Syftet med uppgiften är att skapa en webbtjänst (REST API) som hanterar en restaurangapplikation genom att hantera användare och meny med koppling till en PostgreSQL-databas. Tillagt är även hantering av kategorier och meddelanden.
API:et använder PostgreSQL (Neon) som databas och JWT för autentisering.

## Tekniker
- Node.js
- Express
- PostgreSQL (Neon)
- pg Pool
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- CORS

## Installation

Klona repo
```
git clone <backend-repo-url>
```

Installera dependencies:
```
npm install express cors dotenv jsonwebtoken bcrypt pg
```

Installera nodemon:
```
npm install nodemon --save-dev
```

Kör projektet:
```
npm run serve
```
## Databas
Databasen är skapad via Neons PostgreSQL-tjänst. 

Projektet har en `.env`-fil för känsliga uppgifter. Se `.env.sample` för aktuella variabler.

För att skapa databasen körs:
```
node install.js
```
Install.js kopplar då upp sig mot Neons PostgreSQL och skapar tabellerna.

### Basrelationer
users (id (PK), username, password, account_created, is_admin)
categories (id (PK), name, created_at)
menu_items (id(PK), name, price, description, created_at, is_available, is_offer, category_id(FK))
messages (id (PK), name, email, message, is_handled, created_at)

## Testdata
För att fylla databasen med testdata kan följande script köras:

```
node inserts.js
```

## API Endpoints
Så här når du API:ets olika tabeller

### Users
| Metod | Ändpunkt            | Beskrivning                                        |
|-------|-------------------- |----------------------------------------------------|
| POST  | /api/users/login    | Loggar in en användare och returnerar JWT-token    |
| GET   | /api/users          | Hämtar alla användare (kräver admin)               |
| POST  | /api/users/register | Skapar ny användare (kräver admin)                 |
| DELETE| /api/users/:id      | Raderar användare (kräver admin)                   |

Exempel på JSON:
{
  "username": "admin",
  "password": "password123",
  "is_admin": true
}

### Menu
| Metod | Ändpunkt            | Beskrivning                                        |
|-------|-------------------- |----------------------------------------------------|
| GET   | /api/menu           | Hämtar alla menyartiklar                           |
| POST  | /api/menu           | Skapar ny menyartikel                              |
| PUT   | /api/menu/:id       | Uppdaterar menyartikel                             |
| DELETE| /api/menu/:id       | Raderar menyartikel                                |

Exempel på JSON:
{
  "name": "Sushi Mix",
  "price": 129,
  "description": "Blandade bitar",
  "category_id": 1,
  "is_available": true,
  "is_offer": false
}

### Categories
| Metod | Ändpunkt            | Beskrivning                                        |
|-------|-------------------- |----------------------------------------------------|
| GET   | /api/categories     | Hämtar alla kategorier                             |
| POST  | /api/categories     | Skapar ny kategori                                 |
| PUT   | /api/categories/:id | Uppdaterar kategori (Ej implementerat i appen)     |

Exempel på JSON:
{
  "name": "Sushi"
}

### Messages
| Metod | Ändpunkt            | Beskrivning                                        |
|-------|-------------------- |----------------------------------------------------|
| GET   | /api/messages       | Hämtar alla meddelanden                            |
| POST  | /api/messages       | Skapar meddelande                                  |
| PUT   | /api/messages/:id   | Uppdaterar meddelande                              |
| DELETE| /api/messages/:id   | Raderar meddelande                                 |

Exempel på JSON:
{
  "name": "Jag",
  "email": "jag@mail.com",
  "message": "Hej!"
}