# 🤖 Chatbot de Asistencia sobre Preguntas Frecuentes
## 🎯 Objetivo
Construir un asistente conversacional con **Langchain** que responda preguntas frecuentes usando un conjunto de documentos de texto como fuente de conocimiento.

---


## ✅ Requisitos	

- Usar Langchain (preferiblemente JS )

- Integrar OpenAI u otro LLM compatible.
- Cargar un archivo .txt o .pdf con contenido de preguntas frecuentes.
- Implementar una RetrievalQA chain para que el LLM responda basado en esos documentos.
- Desplegar un endpoint básico o CLI donde se pueda hacer preguntas.
- Incluir un README.md con instrucciones para correr el proyecto.

## 📁 Estructura esperada del proyecto

```plaintext
PruebaChatbot-cpocket/
├── docs/
│   └── preguntas_frecuentes.txt    # Documento fuente con las preguntas frecuentes
├── index.js                        # Archivo principal con la lógica del chatbot
├── .env                            # Variables de entorno (API keys)
└── README.md                       # Documentación del proyecto
```

## 📄 requirements (package.json)
```plaintext

"dependencies": {
  "langchain": "",
  "dotenv": "",
  "readline": ""
}
```


## 🧠 Bonus (opcional)
- Agregar memoria a la conversación.

## 👍🏼 Vista de lo que se espera
```plaintext
Pregunta: ¿Dónde están ubicados?
Respuesta: Nuestra oficina principal está en Medellín, Colombia.
```

## 📌 Nota

- Fecha de entrega:   **28 de mayo de 2025**
- Mandar al correo Link del repositorio a santiago.hernandez@cpocket.global

- Se entrega una plantilla base con la estructura mínima necesaria para comenzar. Sin embargo, si prefieren construir el proyecto desde cero y usar otros LLM compatibles, también es completamente válido.
- Se valorará especialmente la documentación clara y detallada sobre la ejecución del proyecto, ya que esta es una parte fundamental para evaluar tanto el enfoque técnico como la capacidad de comunicación del desarrollador.


## ✌🏼 Buena Suerte
Equipo C-pocket
