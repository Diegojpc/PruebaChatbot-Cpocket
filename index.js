import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai"
import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// --- 1. Configuración del Modelo y Embeddings ---
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,           
    // openAIApiKey: process.env.OPENAI_API_KEY
});

const embeddings = new OpenAIEmbeddings({
    // openAIApiKey: process.env.OPENAI_API_KEY
});

// --- 2. Carga y Procesamiento de Documentos ---
async function loadAndProcessDocuments() {
    console.log("Cargando documentos...");
    const loader = new TextLoader("docs/preguntas_frecuentes.txt");
    // const loader = new PDFLoader("docs/preguntas_frecuentes.pdf");
    
    const docs = await loader.load();
    if (docs.length === 0) {
        console.error("No se encontraron documentos o el archivo está vacío.");
        process.exit(1);
    }
    console.log(`Documentos cargados: ${docs.length}`);

    // Dividir los documentos en chunks más pequeños
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(`Documentos divididos en ${splitDocs.length} chunks.`);

    return splitDocs;
}

// --- 3. Creación del Vector Store y Retriever ---
async function createVectorStoreAndRetriever(documents) {
    console.log("Creando vector store...");
    const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
    console.log("Vector store creado.");

    return vectorStore.asRetriever();
}

// --- 4. Creación de la Cadena RetrievalQA con Memoria Conversacional ---
async function createRetrievalQAChain(llm, retriever) {
    console.log("Creando cadena RetrievalQA con memoria conversacional...");
    
    // Create a history-aware retriever
    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
        ["user", "Dada la conversación anterior y una nueva pregunta del usuario que podría hacer referencia al contexto en el historial de chat, formula una pregunta independiente que se pueda entender sin el historial de chat. NO respondas la pregunta, solo reformúlala si es necesario y de lo contrario devuélvela tal como está."],
    ]);

    const historyAwareRetriever = await createHistoryAwareRetriever({
        llm,
        retriever,
        rephrasePrompt: historyAwarePrompt,
    });

    // Create a prompt template for the question answering with chat history
    const qaPrompt = ChatPromptTemplate.fromMessages([
        ["system", `Eres un asistente útil que responde preguntas basándose en el contexto proporcionado y el historial de la conversación.

Usa el contexto dado para responder la pregunta del usuario.
Si no sabes la respuesta basándote en el contexto, dí que no sabes.
Usa tres oraciones como máximo y mantén una respuesta concisa.
Ten en cuenta el historial de la conversación para proporcionar respuestas coherentes y contextualmente relevantes.

Context: {context}`],
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
    ]);

    // Create the document chain
    const questionAnswerChain = await createStuffDocumentsChain({
        llm,
        prompt: qaPrompt,
    });

    // Create the retrieval chain with history awareness
    const chain = await createRetrievalChain({
        retriever: historyAwareRetriever,
        combineDocsChain: questionAnswerChain,
    });
    
    console.log("Cadena RetrievalQA con memoria conversacional creada.");
    return chain;
}

// --- 5. Interfaz de Línea de Comandos (CLI) con Memoria Conversacional ---
async function startCLI(_chain) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // Array para almacenar el historial de la conversación
    const chatHistory = [];

    console.log("\n🤖 Pregúntame sobre preguntas frecuentes. Escribe 'salir' para terminar.");
    console.log("💭 Ahora puedo recordar nuestra conversación anterior para darte respuestas más contextuales.");

    const promptUser = () => {
        rl.question("\nPregunta: ", async (input) => {
            if (input.toLowerCase() === "salir") {
                console.log("¡Hasta luego! Ha sido un placer conversar contigo.");
                rl.close();
                return;
            }

            try {
                // Invoke the chain with input and chat history
                const response = await _chain.invoke({ 
                    input: input,
                    chat_history: chatHistory
                });
                
                const answer = response.answer;
                console.log("Respuesta:", answer);

                // Add the current interaction to chat history
                chatHistory.push(new HumanMessage(input));
                chatHistory.push(new AIMessage(answer));

                // Limit chat history to last 10 messages (5 exchanges) to avoid token limits
                if (chatHistory.length > 10) {
                    chatHistory.splice(0, 2);
                }

            } catch (err) {
                console.error("Error al procesar la pregunta:", err.message ?? err);
            }
            promptUser();
        });
    };
    
    promptUser()
}

async function main() {

    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error("Por favor, define la variable de entorno OPENAI_API_KEY con tu clave de OpenAI.");
        }
    

        const documents = await loadAndProcessDocuments();
        const retriever = await createVectorStoreAndRetriever(documents);
        const chain = await createRetrievalQAChain(model, retriever);

        await startCLI(chain);

    } catch (error) {
        console.error("Ocurrio un error en la aplicación:", error.message);
        if (error.response && error.response.data) {
            console.error("Detalles del error API:", error.response.data);
        }
        process.exit(1);
    }
}

main();