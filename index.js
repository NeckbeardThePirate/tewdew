const globalSubCountValues = [
	5, 7, 9, 12, 15, 18, 22, 25, 30, 35, 40, 50, 60, 75, 100,
];

document.addEventListener('alpine:init', () => {
	Alpine.store('tewDew', {
		title: '',
		subItems: [],
		isThinking: false,
		inProgTitle: '',
		suggestedToDos: [],
		subItemsIndexPosition: 0,
		titleEdit: false,
		subCountValues: [
			5, 7, 9, 12, 15, 18, 22, 25, 30, 35, 40, 50, 60, 75, 100,
		],

		async initializeNewToDo() {
			this.inProgTitle = this.title;
			this.title = '';
			this.isThinking = true;
			console.log(this.subItemsIndexPosition);
			this.suggestedToDos = await runGet(
				this.inProgTitle,
				this.subItemsIndexPosition
			);
			this.isThinking = false;
		},

		updateValue(selectedIndex) {
			console.log(selectedIndex);
			this.subItemsIndexPosition = selectedIndex;
			console.log(this.subItemsIndexPosition);
			return globalSubCountValues[this.subItemsIndexPosition];
		},
		applyToDo() {},
	});
});

document.addEventListener('DOMContentLoaded', () => {
	console.log('hi there');
	Alpine.store('newList', {
		items: [],
	});

	Alpine.store('todos', {
		hasItems: false,
	});
	const todos = Alpine.store('todos');
	loadToDoItems(todos);
});

async function runGet(message, selectedIndex) {
	// const url = 'http://127.0.0.1:8787/';
	const url = 'https://tewdewai.lightlabs.workers.dev/';

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			task: message,
			subItems: globalSubCountValues[selectedIndex],
		}),
	});

	const data = await response.json();
	const returnable = {};

	const toDoArr = data.toDos.split(',');
	toDoArr.forEach((element) => {
		returnable[element] = {
			isOn: true,
			name: element,
		};
	});
	Alpine.store('newActiveList', returnable);
	return toDoArr;
}

function createNewToDo(suggestedToDos, toDoTitle) {
	console.log(toDoTitle);
	const activeList = Alpine.store('newActiveList');
	// const b
	const newList = {
		[toDoTitle]: {
			hasItems: false,
		},
		hasItems: true,
	};
	for (const item in suggestedToDos) {
		const checkItem = suggestedToDos[item];

		if (activeList[checkItem].isOn) {
			if (!newList[toDoTitle].hasItems) {
				newList[toDoTitle].hasItems = true;
			}
			newList[toDoTitle][checkItem] = {
				hasItems: false,
			};
		}
	}

	loadToDoItems(newList);
}

function loadToDoItems(toDoSet) {
	const todos = toDoSet;
	console.log(toDoSet);
	if (todos.hasItems) {
		const toDoItemBox = document.querySelector('.to-do-main-container');
		for (const item in todos) {
			if (item !== 'hasItems') {
				let levels = 0;

				const parentItem = document.createElement('div');
				parentItem.classList.add('todo-container');

				toDoItemBox.appendChild(parentItem);

				loadSubItems(levels, todos[item], parentItem, item);
			}
		}
	}
}

function loadSubItems(levels, item, parentItem, name) {
	if (levels < 5) {
		const containerItem = document.createElement('div');
		containerItem.classList.add('todo-outer-container');

		const mainItem = document.createElement('div');
		mainItem.classList.add('todo-container');

		const checkButton = document.createElement('button');
		checkButton.classList.add('todo-checkbox');
		checkButton.classList.add('size-4');
		checkButton.classList.add('rounded-sm');

		const toDoTitle = document.createElement('p');
		toDoTitle.classList.add('todo-title');
		toDoTitle.textContent = `${name}`;

		mainItem.appendChild(checkButton);
		mainItem.appendChild(toDoTitle);

		containerItem.appendChild(mainItem);

		checkButton.addEventListener('click', () => {
			const isComplete = checkButton.getAttribute('is-complete');
			console.log(isComplete);
			if (!isComplete || isComplete === 'false') {
				checkButton.classList.add('bg-gray-400');
				checkButton.setAttribute('is-complete', true);

				if (item.hasItems) {
					const outerContainer =
						checkButton.parentElement.parentElement.parentElement;
					const subButtons =
						outerContainer.querySelectorAll('.todo-checkbox');

					subButtons.forEach((button) => {
						const isComplete = button.getAttribute('is-complete');
						if (!isComplete) {
							button.classList.add('bg-gray-400');
							button.setAttribute('is-complete', true);
						}
					});
				}
			} else {
				checkButton.classList.remove('bg-gray-400');
				checkButton.setAttribute('is-complete', false);
				console.log('hello from the other side');
			}
		});

		if (item.hasItems) {
			mainItem.classList.add('has-sub-items');
			for (const subItem in item) {
				if (subItem !== 'hasItems') {
					const passable = levels + 1;
					loadSubItems(
						passable,
						item[subItem],
						containerItem,
						subItem
					);
				}
			}
		}

		parentItem.appendChild(containerItem);
	}
}

function createToDoBox(item) {
	const mainItem = document.createElement('div');
	mainItem.classList.add('todo-container');

	if (todos[item].hasItems) {
		parentItem.classList.add('has-sub-items');
	}

	parentItem.appendChild(checkButton);
	parentItem.appendChild(toDoTitle);
}
