# 🤖 Chatbot de Asistencia sobre Preguntas Frecuentes - Prueba Cpocket

Este proyecto implementa un asistente conversacional utilizando LangchainJS que responde preguntas frecuentes basándose en un conjunto de documentos de texto.

---

## 🎯 Objetivo

Construir un asistente conversacional con **Langchain** y **Node Js** que responda preguntas frecuentes usando un conjunto de documentos de texto como fuente de conocimiento.

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
git clone https://github.com/thiagoCpocket/PruebaChatbot-Cpocket.git
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

> ⚠️ **Importante**: Nunca subas el archivo `.env` a Git. Asegúrate de que esté incluido en `.gitignore`.

---

## 🏃‍♂️ Cómo Ejecutar el Proyecto

### Ejecutar el Chatbot

```bash
npm start
```

O alternativamente:

```bash
node index.js
```

### Uso del Chatbot

1. Una vez ejecutado, el chatbot cargará los documentos de preguntas frecuentes
2. Aparecerá un prompt interactivo donde puedes hacer preguntas
3. El chatbot responderá basándose en el contenido del archivo `docs/preguntas_frecuentes.txt`
4. Para salir del chatbot, escribe `salir`

### Ejemplo de Uso

```
🤖 Pregúntame sobre preguntas frecuentes. Escribe 'salir' para terminar.

Pregunta: ¿Cuáles son los horarios de atención?
Respuesta: [El chatbot responderá basándose en la información disponible]

Pregunta: salir
¡Hasta luego!
```

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