# WEBLAB
Code Repository für das Projekt des WEBLAB-Moduls.

- [Aufgabenstellung](Aufgabenstellung.md)
- [Architekturdokumentation](https://github.com/vonivo/WEBLAB/releases/download/latest/architecture.pdf)
- [Arbeitsjournal](Arbeitsjournal.md)

## Running the Application

### 1. Build the Docker images

```bash
docker compose build --no-cache
```

### 2. Start the containers

```bash
docker compose up -d
```

### 3. Open the application

Once the containers are running, open:

[http://localhost](http://localhost:80)

## Testing

### Frontend Tests

```bash
cd frontend
npm run test:ci
```

### Backend Tests

```bash
cd backend
npm test
```

### End-to-End Tests

Build and start the E2E environment:

```bash
docker compose -f docker-compose.e2e.yml build --no-cache
docker compose -f docker-compose.e2e.yml up -d
```

Then run the Cypress tests:

```bash
cd frontend
npm run cypress:run
```


Offen:
Arbeitsjournal
Chapter 6