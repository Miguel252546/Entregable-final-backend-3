# ======================================================
# Security Scan Script for backend-ecommerce Docker Image
# ======================================================
# Requisitos: Docker Desktop, Docker Scout
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts/security-scan.ps1
# ======================================================

$IMAGE_NAME = "backend-ecommerce:1.0.0"

Write-Host "============================================="
Write-Host "  Security Scan - $IMAGE_NAME"
Write-Host "============================================="

# 1. Verificar imagen
Write-Host "`n[1/5] Verificando imagen local..."
$exists = docker image inspect $IMAGE_NAME 2>$null
if (-not $?) {
    Write-Host "  Imagen no encontrada. Construyendo..."
    docker build -t $IMAGE_NAME .
}
Write-Host "  OK"

# 2. Docker Scout quickview
Write-Host "`n[2/5] Docker Scout Quickview..."
docker scout quickview $IMAGE_NAME

# 3. Docker Scout CVEs
Write-Host "`n[3/5] Docker Scout CVEs..."
docker scout cves $IMAGE_NAME

# 4. Docker Scout recommendations
Write-Host "`n[4/5] Docker Scout recommendations..."
docker scout recommendations $IMAGE_NAME

# 5. Docker SBOM
Write-Host "`n[5/5] Generando SBOM..."
docker scout sbom $IMAGE_NAME --format json | Set-Content docker-sbom.json
Write-Host "  SBOM guardado en docker-sbom.json"

Write-Host "`n============================================="
Write-Host "  Security Scan completado"
Write-Host "============================================="
