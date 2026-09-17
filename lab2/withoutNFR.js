const fs = require('fs');
const path = require('path');

const getFilePath = (filename) => {
    if (!filename) return null;
    return path.resolve(__dirname, filename);
};

const validateFilename = (filename) => {
    if (!filename) {
        console.log("Error: Please provide a valid filename.");
        return false;
    }
    return true;
};

const createNote = (filename, content) => {
    if (!validateFilename(filename)) return;
    const filePath = getFilePath(filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            console.log("File already exists!");
        } else {
            fs.writeFile(filePath, content || "", 'utf8', (err) => {
                if (err) return console.log("Error creating file:", err);
                console.log("Note created successfully!");
            });
        }
    });
};

const viewNote = (filename) => {
    if (!validateFilename(filename)) return;
    const filePath = getFilePath(filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return console.log("Error reading file:", err.message);
        console.log("--- Note Content ---");
        console.log(data || "[File is empty]");
        console.log("--------------------");
    });
};

const appendNote = (filename, content) => {
    if (!validateFilename(filename)) return;
    if (!content) {
        console.log("Error: Please provide content to append.");
        return;
    }
    const filePath = getFilePath(filename);

    fs.appendFile(filePath, "\n" + content, 'utf8', (err) => {
        if (err) return console.log("Error appending file:", err.message);
        console.log("Content appended successfully!");
    });
};

const deleteNote = (filename) => {
    if (!validateFilename(filename)) return;
    const filePath = getFilePath(filename);

    fs.unlink(filePath, (err) => {
        if (err) return console.log("Error deleting file:", err.message);
        console.log("File deleted successfully!");
    });
};

const listNotes = () => {
    fs.readdir(__dirname, (err, files) => {
        if (err) return console.log("Error listing directory:", err.message);
        const textFiles = files.filter(file => file.endsWith('.txt'));
        console.log("--- Available Text Notes ---");
        if (textFiles.length === 0) {
            console.log("No .txt files found.");
        } else {
            textFiles.forEach((file, index) => {
                console.log(`${index + 1}. ${file}`);
            });
        }
        console.log("----------------------------");
    });
};

const searchNotes = (keyword) => {
    if (!keyword) {
        console.log("Error: Please provide a keyword to search.");
        return;
    }
    fs.readdir(__dirname, (err, files) => {
        if (err) return console.log("Error scanning directory:", err.message);
        const textFiles = files.filter(file => file.endsWith('.txt'));
        let foundMatch = false;

        textFiles.forEach(file => {
            const filePath = getFilePath(file);
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.toLowerCase().includes(keyword.toLowerCase())) {
                console.log(`Match found in [${file}]`);
                foundMatch = true;
            }
        });

        if (!foundMatch) {
            console.log(`No notes contained the keyword: "${keyword}"`);
        }
    });
};

const getStats = (filename) => {
    if (!validateFilename(filename)) return;
    const filePath = getFilePath(filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return console.log("Error reading file:", err.message);
        const lines = data.split('\n').length;
        const words = data.trim() ? data.trim().split(/\s+/).length : 0;
        const characters = data.length;

        console.log(`--- File Statistics: ${filename} ---`);
        console.log(`Lines: ${lines}`);
        console.log(`Words: ${words}`);
        console.log(`Characters: ${characters}`);
        console.log("------------------------------------");
    });
};

const clearNote = (filename) => {
    if (!validateFilename(filename)) return;
    const filePath = getFilePath(filename);

    fs.writeFile(filePath, "", 'utf8', (err) => {
        if (err) return console.log("Error clearing file:", err.message);
        console.log("File content cleared successfully!");
    });
};

const showHelp = () => {
    console.log("=== Note Manager CLI Help ===");
    console.log("node notes.js create <filename> <content>  - Create a new note");
    console.log("node notes.js view <filename>             - View content of a note");
    console.log("node notes.js append <filename> <content>  - Append text to a note");
    console.log("node notes.js delete <filename>           - Delete a note");
    console.log("node notes.js list                        - List all .txt notes");
    console.log("node notes.js search <keyword>            - Search text across all notes");
    console.log("node notes.js stats <filename>            - Count words and characters");
    console.log("node notes.js clear <filename>            - Clear note content without deleting");
};

const command = process.argv[2];
const filename = process.argv[3];
const content = process.argv.slice(4).join(" ");

if (command === "create") {
    createNote(filename, content);
} else if (command === "view") {
    viewNote(filename);
} else if (command === "append") {
    appendNote(filename, content);
} else if (command === "delete") {
    deleteNote(filename);
} else if (command === "list") {
    listNotes();
} else if (command === "search") {
    searchNotes(filename);
} else if (command === "stats") {
    getStats(filename);
} else if (command === "clear") {
    clearNote(filename);
} else if (command === "help") {
    showHelp();
} else {
    console.log("Invalid command!");
    showHelp();
}