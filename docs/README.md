# Memoria del Parcial

Este directorio contiene el template de LaTeX para la memoria breve del parcial.

## Compilar la Memoria

### Opción 1: Con pdflatex (Recomendado)

```bash
# Compilar dos veces para generar el índice correctamente
pdflatex memoria.tex
pdflatex memoria.tex
```

### Opción 2: Con Overleaf

1. Ve a [Overleaf](https://www.overleaf.com/)
2. Crea un nuevo proyecto
3. Sube el archivo `memoria.tex`
4. Compila automáticamente

### Opción 3: Con VS Code

Instala la extensión **LaTeX Workshop** y abre `memoria.tex`. Se compilará automáticamente.

## Contenido del Template

El template incluye las siguientes secciones:

1. **Diseño de la Base de Datos**
   - Modelo conceptual
   - Estructura de colecciones MongoDB
   - Justificación del diseño no relacional
   - Relaciones entre entidades

2. **Servicios REST Básicos**
   - Operaciones CRUD
   - Endpoints implementados

3. **Servicios REST Adicionales**
   - Búsquedas parametrizadas
   - Operaciones sobre relaciones

4. **Descripción y Pruebas del Servicio**
   - Documentación OpenAPI
   - Ejemplos de uso
   - Pruebas realizadas

5. **Despliegue del Servicio**
   - Tecnologías utilizadas
   - Arquitectura del proyecto
   - Configuración del entorno
   - Despliegue con Docker

6. **Conclusiones**

## Instrucciones

Todos los campos marcados con `TODO:` deben ser completados con la información específica de tu proyecto:

- Reemplaza `[Tu Nombre]` con tu nombre
- Reemplaza `[Entidad 1]`, `[Entidad 2]`, etc. con tus entidades reales
- Completa las descripciones de campos y colecciones
- Añade los ejemplos de requests/responses reales
- Documenta las decisiones de diseño

## Requisitos

Para compilar necesitas tener instalado:

- **TeXLive** (Linux): `sudo apt-get install texlive-full`
- **MiKTeX** (Windows): https://miktex.org/download
- **MacTeX** (macOS): https://www.tug.org/mactex/

O simplemente usa **Overleaf** online.

