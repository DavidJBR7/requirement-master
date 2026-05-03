#!/bin/bash

# Configuración
DIRECTORIO_BASE="${1:-.}"  # Directorio base o actual
ARCHIVO_SALIDA="codigo_proyecto_$(date +%Y%m%d_%H%M%S).txt"

# Buscar y procesar archivos .java
while IFS= read -r -d '' archivo; do
    CONTADOR=$((CONTADOR + 1))

    # Obtener ruta relativa
    ruta_relativa="${archivo#$DIRECTORIO_BASE/}"

    # Escribir cabecera del archivo
    {
        echo ""
        echo "$(realpath "$archivo")"
        echo ""

        # Escribir contenido
        cat "$archivo"

        echo ""
        echo ""
    } >> "$ARCHIVO_SALIDA"

    echo "Procesado: $ruta_relativa"
done < <(find "$DIRECTORIO_BASE" -type f -name "*.java" -print0)

# Mostrar resumen
echo ""
echo "¡Exportación completada!"
echo "Archivos procesados: $CONTADOR"
echo "Resultado guardado en: $ARCHIVO_SALIDA"
