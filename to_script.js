// Sélection des éléments HTML avec leurs IDs :
let form = document.getElementById("todo");
let todo_list = document.getElementById("todo-row");
let date = document.getElementById("date");

// cette fonction met à jour automatiquement la date à chaque seconde
function setTime() {
  date.innerHTML = moment(new Date())
    .locale("fr")
    .format("dddd,  DD MMMM YYYY HH:mm:ss A");
}
setInterval(setTime, 1000);

//  prendre les données du formulaire pour ajouter une nouvelle tâche :
form.addEventListener("submit", (event) => {
  event.preventDefault();

  let item = event.target.todo;
  let priority = event.target.priority.value;
  let deadline = event.target.deadline.value;
  let todo = generateHTMLcode(item.value, priority, deadline);

  todo_list.appendChild(todo);

  todo.scrollIntoView();

  item.value = "";
});

// Générer la structure HTML pour une seule tâche à faire :
function generateHTMLcode(todo_text, priority, deadline) {
  // Créer les éléments HTML nécessaires :
  let list_div = document.createElement("div");
  let text_div = document.createElement("div");
  let text_p = document.createElement("p");
  let create_p = document.createElement("p");
  let priority_p = document.createElement("p");
  let deadline_p = document.createElement("p");
  let btn_div = document.createElement("div");
  let btn = document.createElement("button");
  let icon = document.createElement("i");

  // Appliquer les classes pour le style :

  list_div.classList.add("list");
  text_div.classList.add("todo-item-date-text");
  text_div.classList.add("todo-content");
  text_p.classList.add("todo-text");
  create_p.classList.add("created-date");
  priority_p.classList.add("todo-priority");
  deadline_p.classList.add("todo-deadline");
  btn_div.classList.add("list-buttons");
  btn.classList.add("delete-list");
  icon.classList.add("fa", "fa-trash");

  // Définir le contenu des éléments textuels :
  text_p.innerHTML = todo_text;
  create_p.innerHTML = "Crée:" + moment(new Date()).format(" DD  MMM HH:mm ");
  priority_p.innerHTML = "Prio: " + priority;
  deadline_p.innerHTML = "Éch: " + deadline;

  // Ajouter des écouteurs d'événements pour marquer comme fait et supprimer des éléments :
  list_div.addEventListener("click", () => {
    listDone(list_div);
  });
  btn.addEventListener("click", () => {
    removeListItem(list_div);
  });

  // Assembler la structure HTML :

  btn.appendChild(icon);
  btn_div.appendChild(btn);
  text_div.append(text_p, create_p, priority_p, deadline_p);
  list_div.append(text_div, btn_div);

  return list_div;
}
// Basculer la classe "fait" sur une tâche à faire :
function listDone(list) {
  list.classList.toggle("done");
}

// Supprimer complètement une tâche à faire :
function removeListItem(list) {
  list.remove();
}
