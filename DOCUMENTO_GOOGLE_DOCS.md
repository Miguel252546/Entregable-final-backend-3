# Documento de Entrega - Backend E-commerce + Adoption

---

## 1. Tests Funcionales - adoption.router.js

### Comando de ejecución
```bash
cd Entregable-final-backend-3
npm test src/test/adoptions.test.js
```

**[📸 CAPTURA 1 - PANTALLAZO COMPLETO DEL OUTPUT]**
- Archivo: `test-adoptions-coverage.log`
- Debe mostrar: los 21 tests con √ verde y "Tests: 21 passed, 21 total"

### Resultado: 21/21 tests PASS
```
PASS src/test/adoptions.test.js
Tests: 21 passed, 21 total
```

### Cobertura - adoption.router.js: 100%
**[📸 CAPTURA 2 - PANTALLAZO DE LA TABLA DE COBERTURA]**
- Misma ejecución que arriba, scrollear hasta la tabla.
- Archivo: `test-adoptions-coverage.log` (líneas de la tabla)
- Debe mostrar: `adoption.router.js | 100% | 100% | 100% | 100%`

### Tests totales del proyecto: 55/55 PASS
**[📸 CAPTURA 3 - PANTALLAZO DE npm test]**
- Archivo: `test-all.log`
- Debe mostrar: "Test Suites: 3 passed, 3 total | Tests: 55 passed, 55 total"

---

## 2. Docker

### 2.1 Dockerfile
```
[Pegar el contenido del Dockerfile como texto]
```

### 2.2 Build local
```bash
docker build -t backend-ecommerce:1.0.0 .
```

**[📸 CAPTURA 4 - PANTALLAZO DEL BUILD]**
- Archivo: `docker-build-new.log`
- Debe mostrar: "DONE" y "naming to docker.io/library/backend-ecommerce:1.0.0"

### 2.3 Imagen local
```bash
docker images backend-ecommerce
```

**[📸 CAPTURA 5 - PANTALLAZO IMAGEN LOCAL]**
- Archivo: `docker-images.log`
- Debe mostrar: "backend-ecommerce   1.0.0   317MB"

### 2.4 Publicación en DockerHub
```bash
docker tag backend-ecommerce:1.0.0 miguelz333/backend-ecommerce:1.0.0
docker push miguelz333/backend-ecommerce:1.0.0
```
**URL:** https://hub.docker.com/r/miguelz333/backend-ecommerce

**[📸 CAPTURA 6 - PANTALLAZO DEL PUSH]**
- Debe mostrar: "1.0.0: digest: sha256:ef7752a7... size: 856"

**[📸 CAPTURA 7 - PANTALLAZO DE DOCKERHUB WEB]**
- Ir a https://hub.docker.com/r/miguelz333/backend-ecommerce
- Mostrar el repositorio con la imagen publicada

### 2.5 Ejecución del contenedor
```bash
docker run -d --name backend-ecommerce -p 8080:8080 [...]
```

**[📸 CAPTURA 8 - PANTALLAZO DEL DOCKER PS]**
- Archivo: `docker-ps.log`
- Debe mostrar: "STATUS (healthy)", "0.0.0.0:8080->8080"

### 2.6 Logs del contenedor
```bash
docker logs backend-ecommerce
```

**[📸 CAPTURA 9 - PANTALLAZO DE LOGS]**
- Archivo: `docker-run-output.log`
- Debe mostrar: "Servidor escuchando en puerto 8080", "Base de datos conectada"

### 2.7 docker-compose.yml
```
[Pegar el contenido de docker-compose.yml como texto]
```

---

## 3. Escaneo de Seguridad (Docker Scout)

### 3.1 Quick View
**[📸 CAPTURA 10 - PANTALLAZO DE SCOUT QUICKVIEW]**
```bash
docker scout quickview miguelz333/backend-ecommerce:1.0.0
```
- Debe mostrar: "0C    11H     3M     2L"

### 3.2 Vulnerabilidades detalladas
**[📸 CAPTURA 11 - PANTALLAZO DE SCOUT CVES]**
- Archivo: `docker-scout-cves.log`
- Debe mostrar: "CRITICAL  0 | HIGH  11 | MEDIUM  3 | LOW  2"

### 3.3 SBOM
**[📸 CAPTURA 12 - PANTALLAZO DEL SBOM]**
- Archivo: `docker-sbom.json` (mostrar primeras líneas)
- Debe mostrar: "348 packages indexed"

### Resumen de Vulnerabilidades
| Severidad | Cantidad |
|-----------|----------|
| CRITICAL  | 0        |
| HIGH      | 11       |
| MEDIUM    | 3        |
| LOW       | 2        |
| Total     | 16       |

---

## 4. Instrucciones de Reproducción

### Prerrequisitos
- Node.js 20+
- Docker y Docker Compose
- MongoDB (local o Docker)

### Opción 1: Local
```bash
git clone <repo-url>
cd Entregable-final-backend-3
npm install
cp .env.example .env
npm run dev
```

### Opción 2: Docker Compose
```bash
docker-compose up -d
```

### Opción 3: DockerHub
```bash
docker pull miguelz333/backend-ecommerce:1.0.0
docker run -d --name backend-ecommerce -p 8080:8080 \
  -e URL_MONGODB=mongodb://host.docker.internal:27017/ecommerce \
  miguelz333/backend-ecommerce:1.0.0
```

### Ejecutar Tests
```bash
npm test                           # Todos (55 tests)
npm test src/test/adoptions.test.js # Solo adoptions (21 tests)
npm run test:coverage              # Con cobertura
```

---

## 5. Resumen de Evidencias Incluidas

| # | Captura | Fuente |
|---|---------|--------|
| 1 | Tests adoptions (21 PASS) | `test-adoptions-coverage.log` |
| 2 | Cobertura adoption.router.js 100% | `test-adoptions-coverage.log` |
| 3 | Tests totales (55 PASS) | `test-all.log` |
| 4 | Build Docker exitoso | `docker-build-new.log` |
| 5 | Imagen local | `docker-images.log` |
| 6 | Push a DockerHub | (ejecutar comando) |
| 7 | Repositorio DockerHub web | https://hub.docker.com/r/miguelz333/backend-ecommerce |
| 8 | Contenedor running (healthy) | `docker-ps.log` |
| 9 | Logs del contenedor | `docker-run-output.log` |
| 10 | Scout quickview | (ejecutar comando) |
| 11 | Scout CVEs | `docker-scout-cves.log` |
| 12 | SBOM | `docker-sbom.json` |
