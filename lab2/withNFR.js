const fs = require("fs");
const path = require("path");

// ----------------------------
// Constants
// ----------------------------

const NOTES_DIRECTORY = __dirname;
const FILE_ENCODING = "utf8";
const TEXT_FILE_EXTENSION = ".txt";

// ----------------------------
// Utility Functions
// ----------------------------

const getFilePath = (filename) => {
    return path.resolve(NOTES_DIRECTORY, filename);
};

const isValidFilename = (filename) => {
    if (!filename) {
        console.log("Error: Please provide a valid filename.");
        return false;
    }

    return true;
};

const isValidContent = (content) => {
    if (!content) {
        console.log("Error: Please provide content.");
        return false;
    }

    return true;
};

const getTextFiles = (callback) => {
    fs.readdir(NOTES_DIRECTORY, (error, files) => {
        if (error) {
            console.log("Error reading notes directory:", error.message);
            return;
        }

        const textFiles = files.filter((file) =>
            file.endsWith(TEXT_FILE_EXTENSION)
        );

        callback(textFiles);
    });
};

const printError = (message, error) => {
    console.log(`${message}:`, error.message);
};

// ----------------------------
// Note Operations
// ----------------------------

const createNote = (filename, content = "") => {
    if (!isValidFilename(filename)) return;

    const filePath = getFilePath(filename);

    fs.access(filePath, fs.constants.F_OK, (error) => {
        if (!error) {
            console.log("File already exists!");
            return;
        }

        fs.writeFile(filePath, content, FILE_ENCODING, (error) => {
            if (error) {
                printError("Error creating file", error);
                return;
            }

            console.log("Note created successfully!");
        });
    });
};

const viewNote = (filename) => {
    if (!isValidFilename(filename)) return;

    const filePath = getFilePath(filename);

    fs.readFile(filePath, FILE_ENCODING, (error, data) => {
        if (error) {
            printError("Error reading file", error);
            return;
        }

        console.log("\n--- Note Content ---");
        console.log(data || "[File is empty]");
        console.log("--------------------\n");
    });
};

const appendNote = (filename, content) => {
    if (!isValidFilename(filename)) return;
    if (!isValidContent(content)) return;

    const filePath = getFilePath(filename);
    const textToAppend = `\n${content}`;

    fs.appendFile(filePath, textToAppend, FILE_ENCODING, (error) => {
        if (error) {
            printError("Error appending file", error);
            return;
        }

        console.log("Content appended successfully!");
    });
};

const deleteNote = (filename) => {
    if (!isValidFilename(filename)) return;

    const filePath = getFilePath(filename);

    fs.unlink(filePath, (error) => {
        if (error) {
            printError("Error deleting file", error);
            return;
        }

        console.log("File deleted successfully!");
    });
};

const clearNote = (filename) => {
    if (!isValidFilename(filename)) return;

    const filePath = getFilePath(filename);

    fs.writeFile(filePath, "", FILE_ENCODING, (error) => {
        if (error) {
            printError("Error clearing file", error);
            return;
        }

        console.log("File content cleared successfully!");
    });
};

// ----------------------------
// Listing and Searching
// ----------------------------

const listNotes = () => {
    getTextFiles((textFiles) => {
        console.log("\n--- Available Text Notes ---");

        if (textFiles.length === 0) {
            console.log("No .txt files found.");
        } else {
            textFiles.forEach((file, index) => {
                console.log(`${index + 1}. ${file}`);
            });
        }

        console.log("----------------------------\n");
    });
};

const searchNotes = (keyword) => {
    if (!keyword) {
        console.log("Error: Please provide a keyword to search.");
        return;
    }

    const searchKeyword = keyword.toLowerCase();

    getTextFiles((textFiles) => {
        if (textFiles.length === 0) {
            console.log("No .txt files found.");
            return;
        }

        let remainingFiles = textFiles.length;
        let foundMatch = false;

        textFiles.forEach((file) => {
            const filePath = getFilePath(file);

            fs.readFile(filePath, FILE_ENCODING, (error, content) => {
                if (error) {
                    printError(`Error reading ${file}`, error);
                } else if (
                    content.toLowerCase().includes(searchKeyword)
                ) {
                    console.log(`Match found in [${file}]`);
                    foundMatch = true;
                }

                remainingFiles--;

                if (remainingFiles === 0 && !foundMatch) {
                    console.log(
                        `No notes contained the keyword: "${keyword}"`
                    );
                }
            });
        });
    });
};

// ----------------------------
// Statistics
// ----------------------------

const calculateStats = (content) => {
    const lines = content.split("\n").length;

    const words = content.trim()
        ? content.trim().split(/\s+/).length
        : 0;

    const characters = content.length;

    return {
        lines,
        words,
        characters,
    };
};

const getStats = (filename) => {
    if (!isValidFilename(filename)) return;

    const filePath = getFilePath(filename);

    fs.readFile(filePath, FILE_ENCODING, (error, content) => {
        if (error) {
            printError("Error reading file", error);
            return;
        }

        const stats = calculateStats(content);

        console.log(`\n--- File Statistics: ${filename} ---`);
        console.log(`Lines: ${stats.lines}`);
        console.log(`Words: ${stats.words}`);
        console.log(`Characters: ${stats.characters}`);
        console.log("------------------------------------\n");
    });
};

// ----------------------------
// Help
// ----------------------------

const showHelp = () => {
    console.log(`
=== Note Manager CLI Help ===

node notes.js create <filename> <content>  - Create a new note
node notes.js view <filename>              - View content of a note
node notes.js append <filename> <content>  - Append text to a note
node notes.js delete <filename>            - Delete a note
node notes.js list                         - List all .txt notes
node notes.js search <keyword>             - Search text across all notes
node notes.js stats <filename>             - Show file statistics
node notes.js clear <filename>             - Clear note content
node notes.js help                         - Show available commands
`);
};

// ----------------------------
// Command Handling
// ----------------------------

const commandHandlers = {
    create: (filename, content) => createNote(filename, content),
    view: (filename) => viewNote(filename),
    append: (filename, content) => appendNote(filename, content),
    delete: (filename) => deleteNote(filename),
    list: () => listNotes(),
    search: (keyword) => searchNotes(keyword),
    stats: (filename) => getStats(filename),
    clear: (filename) => clearNote(filename),
    help: () => showHelp(),
};

const runCommand = () => {
    const command = process.argv[2];
    const argument = process.argv[3];
    const content = process.argv.slice(4).join(" ");

    const handler = commandHandlers[command];

    if (!handler) {
        console.log("Invalid command!");
        showHelp();
        return;
    }

    handler(argument, content);
};

runCommand();