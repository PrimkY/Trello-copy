let trash = document.querySelectorAll('.trash');
let btnDeleteAll = document.querySelector('.btn__delete');
let btnDeleteConfirm = document.querySelector('.btn--dark');
let dashboardDone = document.querySelector('.dashboard__cards-done');
let cardsTodos = document.querySelectorAll(".card__todo");

const storage = {
	// Получить все данные из хранилки по ключу
	getDataByKey: function (key) {
	  if (localStorage.getItem(key) !== null) {
		return JSON.parse(localStorage.getItem(key));
	  } else {
		return [];
	  }
	},
	// Добавить данные по ключу
	pushDataByKey: function (key, data) {
	  let dataByKey = this.getDataByKey(key);
	  dataByKey = [...dataByKey, data];
	  localStorage.setItem(key, JSON.stringify(dataByKey));
	},
  };
  
// DragNDrop
let containerTdo = document.querySelector('.dashboard__cards-todo');
let containerInProgress = document.querySelector('.dashboard__cards-inProgress');
let containerDone = document.querySelector('.dashboard__cards-done');

let drake = dragula([containerTdo, containerInProgress, containerDone]);

drake.on('drop', function(el, target, source, sibling) {
    if (target === containerInProgress && target.children.length >= 6) {
        $('.ui.modal.pop-up__inprogress').modal({blurring: true}).modal('show');

    }
});

// Search
const searchModul = document.querySelector('.search__box');
searchModul.addEventListener('keyup', (event) => {
	const searchModul = document.querySelector(".search__txt");
	const todosArr = document.querySelectorAll('.card__todo');
	let input = searchModul.value;
	input = input.toLowerCase();

	for (const item of todosArr) {
		if (!item.textContent.toLowerCase().includes(input)){
			item.style.display = 'none';
		} else {
			item.style.display = 'block';
		}
	}
})

//Add New card

let todos = [];

const TodoConstructor = function (todoTitle, todoDescription, todoImg, todoUser, todoId) {
	this.todoTitle = todoTitle;
	this.todoDescription = todoDescription;
	this.todoImg = todoImg;
	this.todoUser = todoUser;
	this.todoId = todoId;
}

//Create Todo
const createTodo = (todoTitle, todoDescription, todoImg, todoUser, todoId) => {
	const todoCase = document.createElement("div");
	todoCase.className = "card__todo";

	const cardTop = document.createElement("div");
	cardTop.className = "card_top";

	const todoTitleHead = document.createElement("h3");
	todoTitleHead.className = "card__todo-title title4";
	const todoTitleText = document.createTextNode(todoTitle);

	const todoDate = document.createElement("div");
	const date = new Date().toLocaleTimeString();
	todoDate.className = "card__todo-title";

	const todoDescriptionCard = document.createElement("div");
	todoDescriptionCard.className = "todo-description";
	const todoDescriptionText = document.createTextNode(todoDescription);

	todoCase.append(cardTop);
	cardTop.append(todoTitleHead);
	todoTitleHead.append(todoTitleText);
	cardTop.append(todoDate);
	todoDate.append(date);
	todoDescriptionCard.append(todoDescriptionText);
	todoCase.append(todoDescriptionCard);

	const cardBottom = document.createElement("div");
	cardBottom.className = "card_bottom";

	const user = document.createElement("div");
	user.className = "user";

	const todoAuthor = document.createElement("img");
	todoAuthor.className = "card__todo-author";
	const imgAtr = document.createAttribute('src');
	imgAtr.value = todoImg;
	todoAuthor.setAttributeNode(imgAtr);

	const todoUserName = document.createElement("p");
	const todoUserNameText = document.createTextNode(todoUser);
	todoUserName.className = "todo__user-name";

	const cardEdit = document.createElement("div");
	cardEdit.className = "card__todo-edit";

	const linkEdit = document.createElement("a");
	linkEdit.className = "card__todo-edit";
	const linkEditPicture = document.createElement("i");
	linkEditPicture.className = "edit icon";

	const linkDelete = document.createElement("a");
	linkDelete.className = "card__todo-delete";
	const linkDeletePicture = document.createElement("i");
	linkDeletePicture.className = "trash alternate icon";

	todoCase.append(cardBottom);
	cardBottom.append(user);
	user.append(todoAuthor);
	user.append(todoUserName);
	cardBottom.append(cardEdit);
	cardEdit.append(linkEdit);
	cardEdit.append(linkDelete);
	linkEdit.append(linkEditPicture);
	linkDelete.append(linkDeletePicture);
	todoUserName.append(todoUserNameText);

	todoCase.setAttribute('id', `${todoId}`);

	return todoCase;
}

//Get access
const approveBtn = document.getElementById("approveBtn");
const cardTodo = document.getElementById("todoCase");
const inputTitle = document.getElementById('inputTitle');
const inputDescription = document.getElementById('inputDescription');

// Open add todo modal
const btnAdd = document.getElementById('btn-add');
btnAdd.addEventListener('click', () => {
	inputTitle.value = '';
	inputDescription.value = '';
	$('.ui.modal.add__todo').modal({ blurring: true }, { allowMultiple: true}).modal('show');
	$('.ui.dropdown').dropdown();
})

approveBtn.addEventListener('click', () => {
	const currentUser = $('#selection').dropdown('get value');
	const el = document.querySelector(`[data-value = ${currentUser}]`);
	const img = el.querySelector('.ui.mini.avatar.image').src;
	const todoUser = el.textContent;
	const todoId = Date.now();

	const todo = new TodoConstructor(inputTitle.value, document.getElementById('inputDescription').value, img, todoUser, todoId);
	cardTodo.append(createTodo(inputTitle.value, document.getElementById('inputDescription').value, img, todoUser, todoId));
	todos.push(todo);
	storage.pushDataByKey('cards', todo);
})

// Edit todo
const btnEditModal = document.querySelectorAll('.card__todo-edit').length;
for(let i = 0; i < btnEditModal; i++) {
    document.querySelectorAll('.card__todo-edit')[i].addEventListener('click', () => {
        $('.ui.modal.add__todo').modal({blurring: true}).modal('show');
        $('.ui.dropdown').dropdown();
    })
}

// Pop ups
const checkTodos = () => {
	const cards = storage.getDataByKey('cards');
	if (cards) {
		todos = [...todos, ...cards.map(card => new TodoConstructor(card.todoTitle, card.todoDescription, card.todoImg, card.todoUser, card.todoId))];
	}
	for(let i = 0; i < todos.length; i++){
		console.log(todos);
		cardTodo.append(createTodo(todos[i].todoTitle, todos[i].todoDescription, todos[i].todoImg, todos[i].todoUser, todos[i].todoId));
	}
}
checkTodos();

// Delete card
btnDeleteConfirm.addEventListener("click", (event) => {
	dashboardDone.innerHTML = '';
});

btnDeleteAll.addEventListener("click", (event) => {
	$('.ui.modal.pop-up__delete-all').modal({blurring: true}).modal('show');
});

for(let i = 0; i < cardsTodos.length; i++) {
	trash[i].addEventListener("click", (event) => {
		if(event.target === trash[i]) {
			cardsTodos[i].remove();
		}
	});
}