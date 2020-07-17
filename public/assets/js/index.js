(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (__dirname){
const fs = require('fs');
const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};
let noteList = [];
// A function for getting all notes from the db
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  }).then(function(res) {
    res = JSON.stringify(res);
    console.log('getNotes: ' + res);
    return res;
  });
};

// A function for saving a note to the db
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  }).then( function(res) {
        console.log('POSTING to notes from client: \n' + JSON.stringify(res))
        activeNote = res;
        var newNote = {
          id: 1,
          title: $noteTitle.val(),
          text: $noteText.val(),
        };
        res.push(newNote);
    });
};

// A function for deleting a note from the db
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  })
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = () => {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  } 
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function () {
  var newNote = {
    id: 1,
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  //newNote = JSON.stringify(newNote);
  console.log('handling note save \n' + newNote)
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  console.log('getting notes then rendering list...')
  return getNotes().then(renderNoteList);
};

// Render's the list of note titles
const renderNoteList = (notes) => {
    console.log('rendering note list \n' + notes)
  $noteList.empty();
  notes = JSON.parse(notes);
  const noteListItems = [];
  // Returns jquery object for li with given text and delete button
  // unless withDeleteButton argument is provided as false
  const create$li = (text, withDeleteButton = true) => {
  const $li = $("<li class='list-group-item'>");
  const $span = $("<span>").text(text);
  $li.append($span);

  if (withDeleteButton) {
    const $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );
    $li.append($delBtn);
  }
  return $li;
  };

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
  const $li = create$li(note.title).data(note);
  noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// Delete the clicked note
const handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();
  event.preventDefault();

  var note = $(this).parent(".list-group-item").data();
    console.log('deleting note...' + JSON.stringify(note))
  if (activeNote.id === note.id) {
    activeNote = {};
  }
  $(this).parent(".list-group-item").addClass('hide');
  deleteNote(note.id).then(() => {
    
    getAndRenderNotes();
    renderActiveNote();
    location.reload();
  });
};

// Sets the activeNote and displays it
const handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

$saveNoteBtn.on("click", handleNoteSave)
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();

}).call(this,"/")
},{"fs":1}]},{},[2]);