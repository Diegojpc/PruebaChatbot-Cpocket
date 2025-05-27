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
import { ChatPromptTemplate } from "@langchain/core/prompts";


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

// --- 4. Creación de la Cadena RetrievalQA ---
async function createRetrievalQAChain(llm, retriever) {
    console.log("Creando cadena RetrievalQA...");
    
    // Create a prompt template for the question answering
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `Usa el conexto dado para responder la pregunta.
Si no sabes la respuesta, dí que no sabes.
Usa tres oraciones como maximo  manten una respuesta concisa.

Context: {context}`],
        ["human", "{input}"]
    ]);

    // Create the document chain
    const questionAnswerChain = await createStuffDocumentsChain({
        llm,
        prompt: prompt,
    });

    // Create the retrieval chain
    const chain = await createRetrievalChain({
        retriever,
        combineDocsChain: questionAnswerChain,
    });
    
    console.log("Cadena createRetrievalChain creada.");
    return chain;
}

// --- 5. Interfaz de Línea de Comandos (CLI) ---
async function startCLI(_chain) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("\n🤖 Pregúntame sobre preguntas frecuentes. Escribe 'salir' para terminar.");

    const promptUser = () => {
        rl.question("\nPregunta: ", async (input) => {
            if (input.toLowerCase() === "salir") {
                console.log("¡Hasta luego!");
                rl.close();
                return;
            }

            try {
                const response = await _chain.invoke({ input });
                // The new createRetrievalChain returns an object with an 'answer' property
                const answer = response.answer;
                console.log("Respuesta:", answer);
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