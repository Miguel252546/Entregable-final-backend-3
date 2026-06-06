#!/bin/bash
# ======================================================
# Security Scan Script for backend-ecommerce Docker Image
# ======================================================
# Requisitos: Docker Desktop, Docker Scout, Trivy (opcional)
# 
# Uso:
#   ./scripts/security-scan.sh
# ======================================================

set -e

IMAGE_NAME="backend-ecommerce:1.0.0"
echo "============================================="
echo "  Security Scan - ${IMAGE_NAME}"
echo "============================================="

# 1. Asegurar que la imagen existe
echo ""
echo "[1/5] Verificando imagen local..."
if ! docker image inspect ${IMAGE_NAME} > /dev/null 2>&1; then
    echo "  Imagen no encontrada. Construyendo..."
    docker build -t ${IMAGE_NAME} .
fi
echo "  OK"

# 2. Docker Scout quickview
echo ""
echo "[2/5] Docker Scout Quickview..."
docker scout quickview ${IMAGE_NAME}
echo ""

# 3. Docker Scout vulnerabilities
echo ""
echo "[3/5] Docker Scout CVEs..."
docker scout cves ${IMAGE_NAME}
echo ""

# 4. Docker Scout recommendations
echo ""
echo "[4/5] Docker Scout recommendations..."
docker scout recommendations ${IMAGE_NAME}
echo ""

# 5. Docker SBOM (Software Bill of Materials)
echo ""
echo "[5/5] Generando SBOM..."
docker scout sbom ${IMAGE_NAME} --format json > docker-sbom.json
echo "  SBOM guardado en docker-sbom.json"
echo ""

echo "============================================="
echo "  Security Scan completado"
echo "============================================="
