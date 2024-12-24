class ObjInfManager {
    #_patients = [];

    constructor(towards = []) {
        this.#_patients = Array.isArray(toward) ? patients : [];
    }

    getTowards(skip = 0, top = 10, filterConfig = {}) {
        let filteredPatients = [...this.#_patients];

        if (filterConfig) {
            for (const key in filterConfig) {
                filteredPatients = filteredPatients.filter(patient => patient[key] === filterConfig[key]);
            }
        }

        filteredPatients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return filteredPatients.slice(skip, skip + top);
    }

    getToward(id) {
        return this.#_towards.find(toward => toward.id === id) || null;
    }

    validateToward(toward) {
        if (!toward) return false;

        const { id, description, createdAt, author, owner, petName, animalType } = patient;
        if (
            !id || typeof id !== 'string' ||
            !description || typeof description !== 'string' || description.length > 200 ||
            !createdAt || !(createdAt instanceof Date) ||
            !author || typeof author !== 'string' || !author.trim() ||
            !owner || typeof owner !== 'string' || !owner.trim() ||
            !petName || typeof petName !== 'string' || !petName.trim() ||
            !animalType || typeof animalType !== 'string' || !animalType.trim()
        ) {
            return false;
        }

        return true;
    }

    addToward(toward) {
        if (this.validateToward(toward)) {
            this.#_towards.push(toward);
            return true;
        }
        return false;
    }

    editToward(id, updatedFields) {
        const patient = this.getToward(id);

        if (!toward) return false;

        const immutableFields = ['id', 'author', 'createdAt'];

        for (const key in updatedFields) {
            if (immutableFields.includes(key)) continue;

            if (key in toward) {
                patient[key] = updatedFields[key];
            }
        }

        return this.validatePatient(toward);
    }

    removeToward(id) {
        const initialLength = this.#_towards.length;
        this.#_patients = this.#_towards.filter(patient => patient.id !== id);
        return this.#towards.length < initialLength;
    }

    addAll(toward) {
        const invalidTowards = [];

        patients.forEach(patient => {
            if (!this.addPatient(patient)) {
                invalidPatients.push(patient);
            }
        });

        return invalidTowardss;
    }

    clear() {
        this.#_towards = [];
    }

    getAll() {
        return [...this.#_towards];
    }
}

const data = [
    { id: '1', description: 'Тестовый товар 1', createdAt: new Date('2023-12-01'), author: 'Иван', owner: 'Иванов И.И.', petName: 'Барсик', animalType: 'Кошка' },
    { id: '2', description: 'Тестовый товар 2', createdAt: new Date('2023-11-15'), author: 'Петр', owner: 'Петров П.П.', petName: 'Петя', animalType: 'Собака' },
    { id: '3', description: 'Тестовый товар 3', createdAt: new Date('2023-10-05'), author: 'Анна', owner: 'Анна С.', petName: 'Мурка', animalType: 'Кошка' },
];

const manager = new ObjInfManager(data);

function renderData() {
    const container = document.getElementById('data-container');
    container.innerHTML = '';

    manager.getPatients(0, 10).forEach(patient => {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <h3>${patient.description}</h3>
            <p>Автор: ${patient.author}</p>
            <p>Владелец: ${patient.owner}</p>
            <p>Кличка: ${patient.petName}</p>
            <p>Вид: ${patient.animalType}</p>
            <p>Дата создания: ${patient.createdAt.toLocaleDateString()}</p>
            <button class="edit" onclick="editPatient('${patient.id}')">Редактировать</button>
            <button class="delete" onclick="removePatient('${patient.id}')">Удалить</button>
        `;
        container.appendChild(item);
    });
}

document.getElementById('add-patient').addEventListener('click', () => {
    document.getElementById('add-form').style.display = 'block';
    document.getElementById('edit-form').style.display = 'none';
});

document.getElementById('save-add').addEventListener('click', () => {
    const newDescription = document.getElementById('description').value;
    const newOwner = document.getElementById('owner').value;
    const newPetName = document.getElementById('petName').value;
    const newAnimalType = document.getElementById('animalType').value;

    if (!newDescription.trim() || !newOwner.trim() || !newPetName.trim() || !newAnimalType.trim()) {
        alert('Все поля должны быть заполнены!');
        return;
    }

    const newPatient = {
        id: Date.now().toString(),
        description: newDescription,
        createdAt: new Date(),
        author: 'Аноним',
        owner: newOwner,
        petName: newPetName,
        animalType: newAnimalType,
    };

    const success = manager.addToward(newToward);

    if (success) {
        alert('Towar успешно добавлен!');
        document.getElementById('add-form').style.display = 'none';
        renderData();
    } else {
        alert('Ошибка при добавлении towara!');
    }
});

function editToward(id) {
    const patient = manager.getToward(id);

    if (patient) {
        document.getElementById('edit-id').value = toward.id;
        document.getElementById('edit-description').value = toward.description;
        document.getElementById('edit-owner').value = toward.owner;
        document.getElementById('edit-petName').value = toward.petName;
        document.getElementById('edit-animalType').value = toward.animalType;

        document.getElementById('add-form').style.display = 'none';
        document.getElementById('edit-form').style.display = 'block';
    }
}

document.getElementById('save-edit').addEventListener('click', () => {
    const id = document.getElementById('edit-id').value;
    const newDescription = document.getElementById('edit-description').value;
    const newOwner = document.getElementById('edit-owner').value;
    const newPetName = document.getElementById('edit-petName').value;
    const newAnimalType = document.getElementById('edit-animalType').value;

    if (!newDescription.trim() || !newOwner.trim() || !newPetName.trim() || !newAnimalType.trim()) {
        alert('Все поля должны быть заполнены!');
        return;
    }

    const success = manager.editToward(id, { description: newDescription, owner: newOwner, petName: newPetName, animalType: newAnimalType });

    if (success) {
        alert('Пациент успешно обновлен!');
        document.getElementById('edit-form').style.display = 'none';
        renderData();
    } else {
        alert('Ошибка при обновлении пациента!');
    }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-form').style.display = 'none';
});

function removePatient(id) {
    const success = manager.removePatient(id);
    if (success) {
        alert('Товар успешно удален!');
        renderData();
    } else {
        alert('Ошибка при удалении пациента!');
    }
}

renderData();
