class ObjInfManager {
    #_patients = [];

    constructor(patients = []) {
        this.#_patients = Array.isArray(patients) ? patients : [];
    }

    getPatients(skip = 0, top = 10, filterConfig = {}) {
        let filteredPatients = [...this.#_patients];

        if (filterConfig) {
            for (const key in filterConfig) {
                filteredPatients = filteredPatients.filter(patient => patient[key] === filterConfig[key]);
            }
        }

        filteredPatients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return filteredPatients.slice(skip, skip + top);
    }

    getPatient(id) {
        return this.#_patients.find(patient => patient.id === id) || null;
    }

    validatePatient(patient) {
        if (!patient) return false;

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

    addPatient(patient) {
        if (this.validatePatient(patient)) {
            this.#_patients.push(patient);
            return true;
        }
        return false;
    }

    editPatient(id, updatedFields) {
        const patient = this.getPatient(id);

        if (!patient) return false;

        const immutableFields = ['id', 'author', 'createdAt'];

        for (const key in updatedFields) {
            if (immutableFields.includes(key)) continue;

            if (key in patient) {
                patient[key] = updatedFields[key];
            }
        }

        return this.validatePatient(patient);
    }

    removePatient(id) {
        const initialLength = this.#_patients.length;
        this.#_patients = this.#_patients.filter(patient => patient.id !== id);
        return this.#_patients.length < initialLength;
    }

    addAll(patients) {
        const invalidPatients = [];

        patients.forEach(patient => {
            if (!this.addPatient(patient)) {
                invalidPatients.push(patient);
            }
        });

        return invalidPatients;
    }

    clear() {
        this.#_patients = [];
    }

    getAll() {
        return [...this.#_patients];
    }
}

const data = [
    { id: '1', description: 'Тестовый пациент 1', createdAt: new Date('2023-12-01'), author: 'Иван', owner: 'Иванов И.И.', petName: 'Барсик', animalType: 'Кошка' },
    { id: '2', description: 'Тестовый пациент 2', createdAt: new Date('2023-11-15'), author: 'Петр', owner: 'Петров П.П.', petName: 'Петя', animalType: 'Собака' },
    { id: '3', description: 'Тестовый пациент 3', createdAt: new Date('2023-10-05'), author: 'Анна', owner: 'Анна С.', petName: 'Мурка', animalType: 'Кошка' },
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

    const success = manager.addPatient(newPatient);

    if (success) {
        alert('Пациент успешно добавлен!');
        document.getElementById('add-form').style.display = 'none';
        renderData();
    } else {
        alert('Ошибка при добавлении пациента!');
    }
});

function editPatient(id) {
    const patient = manager.getPatient(id);

    if (patient) {
        document.getElementById('edit-id').value = patient.id;
        document.getElementById('edit-description').value = patient.description;
        document.getElementById('edit-owner').value = patient.owner;
        document.getElementById('edit-petName').value = patient.petName;
        document.getElementById('edit-animalType').value = patient.animalType;

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

    const success = manager.editPatient(id, { description: newDescription, owner: newOwner, petName: newPetName, animalType: newAnimalType });

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
        alert('Пациент успешно удален!');
        renderData();
    } else {
        alert('Ошибка при удалении пациента!');
    }
}

renderData();
