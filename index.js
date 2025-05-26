
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();


async function main() {


    // Interfaz interactiva
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log("Pregúntame sobre preguntas frecuentes. Escribe 'salir' para terminar.");

    const promptUser = () => {
        rl.question("\nPregunta: ", async (input) => {
            if (input.toLowerCase() === "salir") {
                rl.close();
                return;
            }

            // const res = await
            console.log("Respuesta:", res.text);
            promptUser();
        });
    };
    promptUser()
}


main();
