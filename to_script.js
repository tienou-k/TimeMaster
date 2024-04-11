document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-btn");
  const todoInput = document.getElementById("todo-input");
  const prioritySelect = document.getElementById("priority-select");
  const deadlineInput = document.getElementById("deadline-input");
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

  // Ajouter un écouteur d'événements sur le champ de saisie pour vérifier son contenu
  todoInput.addEventListener("input", () => {
    validateInput();
  });

  // Valider le champ de saisie pour activer ou désactiver le bouton "Ajouter"
  function validateInput() {
    if (todoInput.value.trim() !== "") {
      submitBtn.removeAttribute("disabled");
    } else {
      submitBtn.setAttribute("disabled", true);
    }
  }

  // Ajouter un écouteur d'événements sur le bouton "Ajouter"
  submitBtn.addEventListener("click", (event) => {
    // Empêcher le comportement par défaut du formulaire
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const todoText = todoInput.value.trim();
    const priority = prioritySelect.value;
    const deadline = deadlineInput.value;

    if (todoText !== "") {
      // Créer une nouvelle tâche avec les valeurs des champs du formulaire
      const newItem = {
        id: generateUniqueId(),
        todoText,
        priority,
        deadline,
        deleted: false,
      };

      // Ajouter la nouvelle tâche aux données stockées
      addItemToStorage(newItem);

      // Mettre à jour l'interface utilisateur avec les tâches mises à jour
      renderTodoList();

      // Réinitialiser les valeurs des champs du formulaire
      todoInput.value = "";
      prioritySelect.value = "Faible";
      deadlineInput.value = "";

      // Désactiver à nouveau le bouton "Ajouter"
      submitBtn.setAttribute("disabled", true);
    }
  });

  function renderTodoList() {
    // Effacer la liste actuelle des tâches affichées
    todoList.innerHTML = "";

    // Charger les tâches depuis le localStorage et afficher uniquement celles non supprimées
    const itemsArray = loadItemsFromStorage();
    itemsArray.forEach((item) => {
      if (!item.deleted) {
        const todo = generateHTMLcode(item);
        todoList.appendChild(todo);
      }
    });
  }

  // Créer les éléments HTML pour afficher une tâche
  function generateHTMLcode(item) {
    const listDiv = document.createElement("div");
    listDiv.classList.add("list");

    const textDiv = document.createElement("div");
    textDiv.classList.add("todo-content");

    // Ajouter un gestionnaire d'événements pour barrer/débarrer le texte au clic
    textDiv.addEventListener("click", () => {
      const textP = textDiv.querySelector(".todo-text");
      if (textP) {
        textP.classList.toggle("completed");
      }
    });

    const textP = document.createElement("p");
    textP.classList.add("todo-text");
    textP.textContent = item.todoText;

    const priorityP = document.createElement("p");
    priorityP.classList.add("todo-priority");
    priorityP.textContent = item.priority;

    const deadlineP = document.createElement("p");
    deadlineP.classList.add("todo-deadline");
    deadlineP.textContent = item.deadline;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-list");
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

    deleteBtn.addEventListener("click", () => {
      // Marquer l'élément comme supprimé et mettre à jour le localStorage
      markItemAsDeleted(item.id);
      // Mettre à jour l'interface utilisateur
      renderTodoList();
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-list");
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';

    textDiv.append(textP, priorityP, deadlineP);
    listDiv.append(textDiv, editBtn, deleteBtn);

    return listDiv;
  }

  // Charger les tâches depuis le localStorage
  function loadItemsFromStorage() {
    return JSON.parse(localStorage.getItem("todo-input")) || [];
  }

  // Ajouter une tâche à localStorage
  function addItemToStorage(item) {
    const itemsArray = loadItemsFromStorage();
    itemsArray.push(item);
    localStorage.setItem("todo-input", JSON.stringify(itemsArray));
  }

  // Marquer une tâche comme supprimée dans localStorage
  function markItemAsDeleted(itemId) {
    const itemsArray = loadItemsFromStorage();
    const updatedItemsArray = itemsArray.map((item) => {
      if (item.id === itemId) {
        item.deleted = true;
      }
      return item;
    });
    localStorage.setItem("todo-input", JSON.stringify(updatedItemsArray));
  }

  // Générer un identifiant unique pour une tâche
  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  // Initialiser l'interface utilisateur
  renderTodoList();
  validateInput();
});
