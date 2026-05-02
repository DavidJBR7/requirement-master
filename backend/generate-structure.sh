#!/bin/bash

BASE_DIR="src/main/java/com/requirementmaster/backend"

cd "$BASE_DIR" || exit

find . -name "*.java" -type f | while read -r file; do
    # Comentar cada línea individualmente sin espacio después de //
    sed -i 's/^/\/\//' "$file"
    echo "   ✓ Comentado: ${file#./}"
done