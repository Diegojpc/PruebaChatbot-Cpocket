# 🤖 Chatbot de Asistencia sobre Preguntas Frecuentes - Prueba Cpocket

Este proyecto implementa un asistente conversacional utilizando LangchainJS que responde preguntas frecuentes basándose en un conjunto de documentos de texto con **memoria conversacional**.

---

## 🎯 Objetivo

Construir un asistente conversacional con **Langchain** y **Node Js** que responda preguntas frecuentes usando un conjunto de documentos de texto como fuente de conocimiento, con la capacidad de recordar conversaciones anteriores para proporcionar respuestas más contextuales.

---

## ✨ Características Principales

- 🧠 **Memoria Conversacional**: El chatbot recuerda las interacciones anteriores durante la sesión
- 📚 **Base de Conocimiento**: Responde basándose en documentos de preguntas frecuentes
- 🔍 **Búsqueda Semántica**: Utiliza embeddings para encontrar información relevante
- 💬 **Interfaz CLI Interactiva**: Conversación fluida por línea de comandos
- 🎯 **Respuestas Contextuales**: Considera el historial para dar respuestas coherentes

---

## 🛠️ Tecnologías Utilizadas

-   Node.js
-   LangchainJS (`langchain`, `@langchain/openai`, `@langchain/community`)
-   OpenAI API (GPT-4o para el LLM y modelos de embeddings)
-   Dotenv (para manejo de variables de entorno)

---

## 📁 Estructura del Proyecto

```plaintext
PruebaChatbot-cpocket/
├── docs/
│   └── preguntas_frecuentes.txt    # Documento fuente con las preguntas frecuentes
├── index.js                        # Archivo principal con la lógica del chatbot
├── .env                            # Variables de entorno (API keys) - (No subir a Git)
├── package.json                    # Dependencias y scripts del proyecto
├── package-lock.json               # Lockfile de dependencias
└── README.md                       # Documentación del proyecto
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

-   **Node.js** (versión 18 o superior)
-   **npm** (incluido con Node.js)
-   **Clave API de OpenAI** (obtener en [OpenAI Platform](https://platform.openai.com/api-keys))

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Diegojpc/PruebaChatbot-Cpocket.git
cd PruebaChatbot-Cpocket
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

Agrega tu clave API de OpenAI al archivo `.env`:

```env
OPENAI_API_KEY=tu_clave_api_de_openai_aqui
```

---

## 🏃‍♂️ Cómo Ejecutar el Proyecto

### Ejecutar el Chatbot

```bash
npm start
```

ó alternativamente:

```bash
node index.js
```

### Uso del Chatbot

1. Una vez ejecutado, el chatbot cargará los documentos de preguntas frecuentes
2. Aparecerá un prompt interactivo donde puedes hacer preguntas
3. El chatbot responderá basándose en el contenido del archivo `docs/preguntas_frecuentes.txt`
4. **El chatbot recordará tu conversación** para dar respuestas más contextuales
5. Para salir del chatbot, escribe `salir`

### Ejemplo de Uso con Memoria Conversacional

```
🤖 Pregúntame sobre preguntas frecuentes. Escribe 'salir' para terminar.
💭 Ahora puedo recordar nuestra conversación anterior para darte respuestas más contextuales.

Pregunta: ¿Cuáles son los horarios de atención?
Respuesta: Nuestros horarios de atención son de lunes a viernes de 9:00 AM a 6:00 PM.

Pregunta: ¿Y los fines de semana?
Respuesta: Los fines de semana tenemos horarios reducidos, de 10:00 AM a 2:00 PM los sábados. Los domingos permanecemos cerrados.

Pregunta: ¿Puedo llamar después de las 6?
Respuesta: No, después de las 6:00 PM no hay atención telefónica durante los días de semana. Te recomiendo llamar dentro de nuestro horario de atención.

Pregunta: salir
¡Hasta luego! Ha sido un placer conversar contigo.
```

---

## 🧠 Cómo Funciona la Memoria Conversacional

El chatbot implementa memoria conversacional mediante:

1. **Historial de Chat**: Almacena las últimas 5 interacciones (10 mensajes)
2. **Contexto Consciente**: Reformula preguntas basándose en el historial
3. **Respuestas Coherentes**: Considera conversaciones anteriores para mantener coherencia
4. **Gestión de Memoria**: Limita el historial para evitar exceder límites de tokens

### Beneficios de la Memoria Conversacional

- ✅ **Preguntas de Seguimiento**: "¿Y los fines de semana?" después de preguntar por horarios
- ✅ **Referencias Contextuales**: "¿Puedo hacer eso online?" refiriéndose a un proceso mencionado antes
- ✅ **Conversaciones Naturales**: Flujo de conversación más humano y natural
- ✅ **Clarificaciones**: El chatbot puede pedir aclaraciones basándose en el contexto

---

## 🔧 Solución de Problemas

### Error: "OPENAI_API_KEY no definida"

Asegúrate de que:
1. El archivo `.env` existe en la raíz del proyecto es decir dentro de la carpeta `./PruebaChatbot-Cpocket`
2. La variable `OPENAI_API_KEY` está correctamente definida
3. No hay espacios extra alrededor del signo `=`

### Error: "No se encontraron documentos"

Verifica que el archivo `docs/preguntas_frecuentes.txt` existe y contiene información.

### Problemas de Conexión a OpenAI

1. Verifica que tu clave API es válida
2. Asegúrate de tener créditos disponibles en tu cuenta de OpenAI
3. Comprueba tu conexión a internet

---

## 📝 Personalización

### Modificar el Documento de Conocimiento

Para cambiar las preguntas frecuentes, edita el archivo `docs/preguntas_frecuentes.txt` con tu propio contenido.

### Ajustar Parámetros del Modelo

En `index.js`, puedes modificar:
- `temperature`: Controla la creatividad de las respuestas (0-1)
- `chunkSize`: Tamaño de los fragmentos de texto (por defecto: 1000)
- `chunkOverlap`: Superposición entre fragmentos (por defecto: 200)
- **Límite de Memoria**: Cambia el límite de mensajes en el historial (por defecto: 10 mensajes)