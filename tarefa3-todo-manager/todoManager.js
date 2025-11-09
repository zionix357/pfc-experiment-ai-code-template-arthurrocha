const Status = {
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
}

const Priority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
}

const JiraPrefix = {
    PROJ: 'PROJ',
    TASK: 'TASK',
    FEAT: 'FEAT'
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.identifier = 0;
    }

    create(title, description, priority, jiraPrefix) {
        try {
            this.identifier += 1;
            const code = jiraPrefix + "-" + this.identifier;
            const task = new Task(this.identifier, code, title, description, Status.TODO, priority);
            this.tasks.push(task);

            return {
                success: true,
                message: "Tarefa criada com sucesso"
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    list() {
        return this.tasks;
    }

    update(identifier, title, priority) {
        try {
            const task = this.getById(identifier);

            if (!task) {
                return {
                    success: false,
                    message: `Tarefa com ID ${identifier} não encontrada`
                }
            }

            task.update(title, priority)

            return {
                success: true,
                message: `Tarefa com ID ${identifier} atualizada`
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    updateStatus(identifier, status) {
        try {
            const task = this.getById(identifier);

            if (!task) {
                return {
                    success: false,
                    message: `Tarefa com ID ${identifier} não encontrada`
                }
            }

            task.updateStatus(status)

            return {
                success: true,
                message: `Tarefa com ID ${identifier} atualizada de STATUS ${task.status} para STATUS ${status}`
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    getById(identifier) {
        try {
            const task = this.tasks.find(t => t.identifier === identifier);
            if (!task) {
                throw new Error(`Tarefa com ID ${identifier} não encontrada`);
            }
            return task;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    removeById(identifier) {
        try {
            const index = this.tasks.findIndex(t => t.identifier === identifier);
            if (index === -1) {
                throw new Error(`Tarefa com ID ${identifier} não encontrada`);
            }

            this.tasks.splice(index, 1)

            return {
                success: true,
                message: 'Tarefa removida com sucesso'
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    filterByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    filterByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }

    filterByTitle(title) {
        return this.tasks.filter(task => task.title.toLowerCase().includes(title.toLowerCase()))
    }

    filterByCode(code) {
        try {
            const task = this.tasks.find(t => t.code === code);
            if (!task) {
                throw new Error(`Tarefa com CODE ${code} não encontrada`);
            }
            return task;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    getCounts() {
        return {
            todo: this.filterByStatus(Status.TODO).length,
            in_progress: this.filterByStatus(Status.IN_PROGRESS).length,
            done: this.filterByStatus(Status.DONE).length
        }
    }
}

class Task {
    constructor(identifier, code, title, description, status, priority) {
        if (!identifier) {
            throw new Error("Identificador obrigatório");
        }

        if (!title) {
            throw new Error("Título obrigatório");
        }

        if (!description) {
            throw new Error("Descrição obrigatória");
        }

        if (!status) {
            throw new Error("Status obrigatório");
        }

        const validateStatus = Object.values(Status);
        if (!validateStatus.includes(status)) {
            throw new Error("Status inválido");
        }

        if (!priority) {
            throw new Error("Prioridade obrigatório");
        }

        const validatePriority = Object.values(Priority);
        if (!validatePriority.includes(priority)) {
            throw new Error("Prioridade inválida");
        }

        this.identifier = identifier;
        this.code = code;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.completedAt = null;
    }

    update(title, priority) {
        this.title = title;
        this.priority = priority;
        this.updatedAt = new Date();
    }

    updateStatus(status) {
        this.status = status;

        if(this.status === Status.DONE) {
            this.completedAt = new Date();
        } else {
            this.updatedAt = new Date();
        }
    }
}

module.exports = {
  Task,
  TaskManager,
  Status,
  Priority
};