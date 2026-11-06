---
titulo: "Formatos de fuente"
orden: 1
consultas:
  - qué es opentype truetype
  - formatos de archivo de fuente
  - qué son las fuentes variables
---
## Formatos de fuente

Una fuente digital es un archivo que describe la forma de cada carácter mediante curvas. Los formatos más habituales:

- **TrueType (.ttf):** formato clásico, muy extendido en sistemas operativos.
- **OpenType (.otf, .ttf):** el estándar actual. Además de las letras, puede incluir **funciones tipográficas**: ligaduras, versalitas de verdad, cifras elzevirianas, alternativas estilísticas. Funciona igual en Mac, Windows y pantalla.
- **WOFF y WOFF2 (.woff / .woff2):** fuentes **comprimidas para la web**. WOFF2 es el más ligero y el recomendado hoy para cargar tipografías en un sitio.

Un avance reciente son las **fuentes variables**: un solo archivo que contiene un rango continuo de variaciones (peso, ancho, inclinación…) en vez de un archivo por estilo. Permiten ajustar el peso con precisión y reducen mucho el tamaño de descarga cuando se usan varios estilos.

Más allá del formato, conviene distinguir cómo se dibuja la letra: casi toda la tipografía actual es **vectorial** (curvas que escalan sin perder nitidez), frente a los antiguos mapas de bits (*bitmap*), atados a un tamaño. El vector es lo que permite usar una misma fuente a cualquier cuerpo.
