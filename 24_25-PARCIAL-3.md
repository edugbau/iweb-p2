## Page 1

Accede al documento original de Wuolah
&lt;img&gt;QR Code&lt;/img&gt;

&lt;img&gt;WUOLAH Logo&lt;/img&gt;

# PARCIAL-3-24-25.pdf

*   &lt;img&gt;Person Icon&lt;/img&gt; macodecena
*   &lt;img&gt;Printer Icon&lt;/img&gt; Ingeniería Web
*   &lt;img&gt;Book Icon&lt;/img&gt; 4° Grado en Ingeniería del Software
*   &lt;img&gt;Building Icon&lt;/img&gt; Escuela Técnica Superior de Ingeniería Informática Universidad de Málaga

<footer>Reservados todos los derechos.
No se permite la explotación económica ni la transformación de esta obra. Queda permitida la impresión en su totalidad.</footer>

---


## Page 2

&lt;img&gt;UNIVERSITAS MALACITANA logo with a dove&lt;/img&gt;
UNIVERSIDAD
DE MÁLAGA

Departamento de Lenguajes
y Ciencias de la Computación

Ingeniería Web 2024/25

---

**MiMapa**

En este ejercicio deberás desarrollar **MiMapa**, una aplicación *web* que permitirá a sus usuarios crear un mapa en el que indicar las ciudades o países que ha visitado, que se mostrarán mediante marcadores en su mapa:

**Mapa de:** pruebaparaingweb@gmail.com

&lt;img&gt;Map showing several red markers on a map of Europe, indicating locations.&lt;/img&gt;

La aplicación **MiMapa** cumplirá con los siguientes requisitos:

*   **Identificación (2 puntos).** Los usuarios podrán hacer *login* y *logout* mediante OAuth 2.0 o un sistema derivado, combinado con el sistema de cuentas de algún proveedor *major* (Google, Facebook, etc.)
*   **Mapas y geocoding (2 puntos).** Una vez identificado mediante su email, la aplicación mostrará el mapa del usuario, con marcadores en los países o ciudades que ha visitado (cuyas coordenadas se almacenarán en una base de datos no relacional, asociadas al email del usuario). El usuario podrá añadir marcadores a su mapa, indicando en un formulario el país o ciudad correspondiente, a partir del cual se obtendrán las coordenadas mediante *geocoding*, añadiéndolas a la base de datos.
*   **Imágenes (2 puntos).** Al añadir un nuevo marcador al mapa, el usuario podrá seleccionar un archivo local con una imagen del país o ciudad correspondiente. Las imágenes se cargarán en la base de datos de la aplicación o en un servicio *cloud* público (como Cloudinary o Drive, guardando en este caso en la base de datos la URI de las imágenes). Las imágenes añadidas al mapa del usuario se mostrarán bien todas juntas en la parte inferior de la página o bien por separado, al seleccionar cada uno de los marcadores.
*   **Visitas (2 puntos).** Se podrá visitar o visualizar el mapa de otro usuario, indicando en un formulario el email con el que esté registrado en la aplicación. En este caso se verá el mapa de dicho usuario de la misma forma que el propio, pero obviamente no se podrán añadir marcadores ni imágenes al mismo.

---

CURSO 2024/25. TERCER PARCIAL

<footer>Reservados todos los derechos. No se permite la explotación económica ni la transformación de esta obra. Queda permitida la impresión en su totalidad.</footer>

---


## Page 3

&lt;img&gt;UNIVERSITAS MALACITANA logo with a dove&lt;/img&gt;
UNIVERSIDAD DE MÁLAGA

Departamento de Lenguajes y Ciencias de la Computación
Ingeniería Web 2024/25

En la parte inferior de la página se listarán las visitas recibidas al mapa, ordenadas de más recientes a más antiguas, indicando para cada una de ellas el *timestamp* con la fecha y hora de la visita, el email del visitante y su token de identificación OAuth. La información sobre las visitas se almacenará también en la base datos, asociada al email del usuario visitado.

*   **Despliegue y entrega (2 puntos).** La aplicación se desplegará sobre un proveedor *cloud* público, como AWS, Vercel, o Firebase. La entrega del examen se realizará a través del campus virtual, en un archivo comprimido que incluirá el código fuente completo de la aplicación, de forma que sea posible su ejecución tanto en modo local como su despliegue en la nube. Se adjuntará también una memoria técnica que describa los siguientes aspectos:
    *   URL donde se ha desplegado la aplicación en un *cloud* público.
    *   email que hayas utilizado para hacer las pruebas.
    *   tecnologías utilizadas (proveedor *cloud*, lenguaje y *framework*, base de datos, etc.)
    *   instrucciones de instalación y despliegue, tanto en local como en la nube, en particular si se ha utilizado alguna tecnología diferente de las presentadas en clase.
    *   URI o credenciales de acceso a la base de datos, en su caso, para poder verificar su contenido.
    *   funcionalidad que se ha implementado, así como posibles limitaciones de la misma y problemas encontrados durante el desarrollo de la aplicación.

CURSO 2024/25. TERCER PARCIAL

<footer>Reservados todos los derechos. No se permite la explotación económica ni la transformación de esta obra. Queda permitida la impresión en su totalidad.</footer>

