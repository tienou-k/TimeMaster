document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-btn");
  const form = document.getElementById("todo");
  const todoList = document.getElementById("todo-row");
  const date = document.getElementById("date");

  // Mettre à jour la date initiale
  setTime();
  setInterval(setTime, 1000);

  function setTime() {
    // Mettre à jour l'élément date avec l'heure actuelle formatée en français
    date.innerHTML = moment(new Date())
      .locale("fr")
      .format("dddd, DD MMMM YYYY HH:mm:ss A");
  }

  submitBtn.addEventListener("click", (event) => {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const todoInput = document.getElementById("todo-input");
    const prioritySelect = document.getElementById("priority-select");
    const deadlineInput = document.getElementById("deadline-input");

    // Créer une nouvelle tâche avec les valeurs des champs du formulaire
    createItem(todoInput.value, prioritySelect.value, deadlineInput.value);

    // Réinitialiser les valeurs des champs du formulaire
    todoInput.value = "";
    prioritySelect.value = "Faible";
    deadlineInput.value = "";
  });

  function createItem(todoText, priority, deadline) {
    // Créer un élément HTML représentant une tâche
    const todo = generateHTMLcode(todoText, priority, deadline);

    // Ajouter la tâche à la liste des tâches affichées
    todoList.appendChild(todo);

    // Charger les tâches depuis le localStorage, ajouter la nouvelle tâche et sauvegarder
    const itemsArray = loadItemsFromStorage();
    itemsArray.push({
      id: generateUniqueId(),
      todoText,
      priority,
      deadline,
      deleted: false,
    });
    saveItemsToStorage(itemsArray);
  }

  // Fonction pour créer un élément HTML représentant une tâche
  function generateHTMLcode(todoText, priority, deadline) {
    const listDiv = document.createElement("div");
    listDiv.classList.add("list");

    const textDiv = document.createElement("div");
    textDiv.classList.add("todo-content");

    const textP = document.createElement("p");
    textP.classList.add("todo-text");
    textP.textContent = todoText;

    const priorityP = document.createElement("p");
    priorityP.classList.add("todo-priority");
    priorityP.textContent = "Prio: " + priority;

    const deadlineP = document.createElement("p");
    deadlineP.classList.add("todo-deadline");
    deadlineP.textContent = "Éch: " + deadline;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-list");
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-list");
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';

    // Écouter l'événement de clic sur le bouton de suppression
    deleteBtn.addEventListener("click", () => {
      listDiv.remove();
      markItemAsDeleted(listDiv.dataset.id);
    });
    //Ecouter l'évènement de clic sur le bouton de modification
    editBtn.addEventListener("click", () => {
      alert("Cette fonction est à implenter");
    });

    textDiv.append(textP, priorityP, deadlineP);
    listDiv.append(textDiv, deleteBtn, editBtn);

    // Stocker l'ID de la tâche dans l'attribut data-id pour la gestion ultérieure
    listDiv.dataset.id = generateUniqueId();

    return listDiv;
  }

  // Fonction pour marquer une tâche comme supprimée
  function markItemAsDeleted(itemId) {
    const itemsArray = loadItemsFromStorage();
    const updatedItemsArray = itemsArray.map((item) => {
      if (item.id === itemId) {
        return { ...item, deleted: true };
      }
      return item;
    });

    saveItemsToStorage(updatedItemsArray);
  }

  // Fonction pour charger les tâches depuis le localStorage
  function loadItemsFromStorage() {
    return JSON.parse(localStorage.getItem("todo-input")) || [];
  }

  // Fonction pour sauvegarder les tâches dans le localStorage
  function saveItemsToStorage(itemsArray) {
    // Filtrer les tâches supprimées avant de sauvegarder
    const filteredItems = itemsArray.filter((item) => !item.deleted);
    localStorage.setItem("todo-input", JSON.stringify(filteredItems));
  }

  // Fonction pour générer un identifiant unique
  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  // Charger les tâches existantes depuis le localStorage au chargement de la page
  const itemsArray = loadItemsFromStorage();
  itemsArray.forEach((item) => {
    // Afficher uniquement les tâches non supprimées
    if (!item.deleted) {
      const todo = generateHTMLcode(
        item.todoText,
        item.priority,
        item.deadline
      );
      todoList.appendChild(todo);
    }
  });
});
