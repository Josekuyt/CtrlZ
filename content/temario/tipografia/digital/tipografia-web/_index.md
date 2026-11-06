---
titulo: "Tipografía para la web"
orden: 3
consultas:
  - qué son las webfonts
  - cómo cargar una fuente en una web
  - tipografía en pantalla rendimiento
---
## Tipografía para la web

En la web, la tipografía no vive en el ordenador del lector: hay que **enviarla** con la página. Eso se hace con *webfonts*, fuentes que se cargan con la regla `@font-face` o desde un servicio de fuentes.

Tres cosas a cuidar:

- **Rendimiento.** Cada fuente es un archivo que el navegador descarga. Conviene usar el formato **WOFF2**, cargar solo los pesos que de verdad se usan y, si es posible, limitar los caracteres a los del idioma. Menos peso, carga más rápida.
- **El parpadeo de carga.** Mientras la fuente llega, el texto puede mostrarse con otra o quedar invisible un instante. Se controla con la propiedad `font-display`: lo habitual es `swap`, que enseña enseguida una fuente de reserva y la cambia al llegar la buena.
- **La pila de reserva** (*font stack*). Siempre se declara una lista: la fuente deseada y, detrás, alternativas genéricas (una *sans serif* del sistema). Si algo falla, el texto se lee igual.

La pantalla también impone sus reglas: conviene una **altura x generosa**, formas abiertas y un cuerpo algo mayor que en papel. Las tipografías humanísticas, serif o sans, suelen comportarse mejor en lectura larga en pantalla.
