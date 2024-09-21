// Массив для хранения заметок и папок
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let folders = JSON.parse(localStorage.getItem('folders')) || [];

// Инициализация расширенного текстового редактора Quills
var quill = new Quill('#editor-container', {
    theme: 'snow'
});

// Функция отображения заметок и папок на боковой панели
function renderNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    // Сначала отрисуйте папки
    folders.forEach((folder, folderIndex) => {
        const folderLi = document.createElement('li');
        folderLi.classList.add('text-lg', 'mb-2', 'font-bold', 'text-cyan-500');
        folderLi.textContent = folder.name;
        folderLi.addEventListener('click', () => toggleFolder(folderIndex));
        notesList.appendChild(folderLi);

        // Визуализация заметок внутри каждой папки
        if (folder.isOpen) {
            folder.notes.forEach((note, noteIndex) => {
                const noteLi = document.createElement('li');
                noteLi.classList.add('text-md', 'ml-4', 'mb-2');
                noteLi.textContent = note.title;
                noteLi.addEventListener('click', () => displayNoteContent(folderIndex, noteIndex));
                notesList.appendChild(noteLi);
            });
        }
    });

    // Отображать заметки, которых нет в папках
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.classList.add('text-lg', 'mb-2');
        li.textContent = note.title;
        li.addEventListener('click', () => displayNoteContent(null, index));
        notesList.appendChild(li);
    });
}

// Функция для создания новой заметки
document.getElementById('create-note-btn').addEventListener('click', () => {
    const newNote = {
        title: `Заметка ${notes.length + 1}`,
        content: quill.getContents() // Сохраните содержимое редактора Quill
    };

    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
});

// Функция для создания новой папки
document.getElementById('create-folder-btn').addEventListener('click', () => {
    const newFolder = {
        name: `Папка ${folders.length + 1}`,
        notes: [],
        isOpen: false
    };

    folders.push(newFolder);
    localStorage.setItem('folders', JSON.stringify(folders));
    renderNotes();
});

// Функция отображения содержимого заметки в редакторе
function displayNoteContent(folderIndex, noteIndex) {
    let note;
    if (folderIndex !== null) {
        note = folders[folderIndex].notes[noteIndex];
    } else {
        note = notes[noteIndex];
    }
    quill.setContents(note.content); // Загружайте содержимое в редактор Quill
}

// Функция для переключения видимости папок
function toggleFolder(folderIndex) {
    folders[folderIndex].isOpen = !folders[folderIndex].isOpen;
    localStorage.setItem('folders', JSON.stringify(folders));
    renderNotes();
}

// Отображать заметки при загрузке страницы
renderNotes();

// Google OAuth Functionality
function handleClientLoad() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID',
        });
    });
}

document.getElementById('login-btn').addEventListener('click', () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(googleUser => {
        const profile = googleUser.getBasicProfile();
        document.getElementById('auth-container').innerHTML = `
            <p>Вошел как ${profile.getName()}</p>
        `;
    });
});

handleClientLoad();
