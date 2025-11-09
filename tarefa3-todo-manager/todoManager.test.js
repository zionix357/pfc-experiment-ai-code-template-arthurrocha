const {
  Task,
  TaskManager,
  Status,
  Priority
} = require('./todoManager.js');

describe('Sistema de Gerenciamento de Tarefas', () => {
  // Implementar testes para createTask
  test('deve criar uma tarefa com dados básicos e código Jira', () => {
    const manager = new TaskManager();
    const result = manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');

    expect(result.success).toBe(true);
    expect(result.message).toBe('Tarefa criada com sucesso');
    expect(manager.tasks[0].code).toBe('PROJ-1');
    expect(manager.tasks[0].title).toBe('Implementar login');
    expect(manager.tasks[0].description).toBe('Sistema de autenticação');
    expect(manager.tasks[0].priority).toBe(Priority.HIGH);
    expect(manager.tasks[0].status).toBe(Status.TODO);
  });

  // Implementar testes para listTasks
  test('deve listar todas as tarefas criadas', () => {
    const manager = new TaskManager();
    const result1 = manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    const result2 = manager.create('Implementar recuperação de senha', 'Sistema de recuperar senha', 'medium', 'PROJ');

    const list = manager.list();
    expect(result1.success).toBe(true);
    expect(result1.message).toBe('Tarefa criada com sucesso');
    expect(result2.success).toBe(true);
    expect(result2.message).toBe('Tarefa criada com sucesso');
    expect(list.length).toBe(2);

    expect(list[0].code).toBe('PROJ-1');
    expect(list[0].title).toBe('Implementar login');
    expect(list[0].description).toBe('Sistema de autenticação');
    expect(list[0].priority).toBe(Priority.HIGH);
    expect(list[0].status).toBe(Status.TODO);

    expect(list[1].code).toBe('PROJ-2');
    expect(list[1].title).toBe('Implementar recuperação de senha');
    expect(list[1].description).toBe('Sistema de recuperar senha');
    expect(list[1].priority).toBe(Priority.MEDIUM);
    expect(list[1].status).toBe(Status.TODO);
  });

  // Implementar testes para updateTask
  test('deve atualizar dados de uma tarefa existente', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.update(1, 'Implementar loign atualizdo', 'low');

    expect(manager.tasks[0].title).toBe('Implementar loign atualizdo');
    expect(manager.tasks[0].priority).toBe(Priority.LOW);
  });

  // Implementar testes para deleteTask
  test('deve remover uma tarefa por ID', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');

    const result = manager.removeById(1);

    expect(result.success).toBe(true);
    expect(manager.list.length).toBe(0);
  });

  // Implementar testes para changeTaskStatus
  test('deve alterar status da tarefa e definir completedAt', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');

    manager.updateStatus(1, 'done');

    expect(manager.tasks[0].status).toBe(Status.DONE);
    expect(manager.tasks[0].completedAt).toBeInstanceOf(Date);
  });

  // Implementar testes para filterTasksByStatus
  test('deve filtrar tarefas por status TODO', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.create('Implementar cadastro', 'Sistema de cadastro', 'low', 'PROJ');
    manager.updateStatus(2, 'done');

    const result = manager.filterByStatus('todo')

    expect(result.length).toBe(1);
  });

  // Implementar testes para filterTasksByPriority
  test('deve filtrar tarefas por prioridade HIGH', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.create('Implementar cadastro', 'Sistema de cadastro', 'low', 'PROJ');

    const result = manager.filterByPriority('high');

    expect(result.length).toBe(1);
  });

  // Implementar testes para searchTasks
  test('deve buscar tarefas por título', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.create('Implementar cadastro', 'Sistema de cadastro', 'low', 'PROJ');

    const result = manager.filterByTitle('cadastro');

    expect(result.length).toBe(1);
  });

  // Implementar testes para getTaskCounts
  test('deve contar tarefas por status', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.create('Implementar cadastro', 'Sistema de cadastro', 'low', 'PROJ');
    manager.create('Implementar recuperar senha', 'Sistema de recuperar senha', 'low', 'PROJ');

    manager.updateStatus(1, Status.IN_PROGRESS);
    manager.updateStatus(2, Status.DONE);

    const result = manager.getCounts();

    expect(result.todo).toBe(1);
    expect(result.in_progress).toBe(1);
    expect(result.done).toBe(1);
  });

  // Implementar testes para generateTaskCode
  test('deve gerar códigos únicos sequenciais', () => {
    // Testar: gerar 3 códigos consecutivos
    // Verificar: PROJ-1, PROJ-2, PROJ-3
  });

  // Implementar testes para findTaskByCode
  test('deve encontrar tarefa por código Jira', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.create('Implementar cadastro', 'Sistema de cadastro', 'low', 'PROJ');

    let result = manager.filterByCode('PROJ-1');

    expect(result.code).toBe('PROJ-1');
    expect(result.title).toBe('Implementar login');
    expect(result.description).toBe('Sistema de autenticação');
    expect(result.priority).toBe(Priority.HIGH);
    expect(result.status).toBe(Status.TODO);
  });

  // Teste de integração
  test('deve gerenciar ciclo completo de uma tarefa', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');
    manager.create('Implementar cadastro', 'Sistema de cadastro', 'low', 'PROJ');
    expect(manager.tasks.length).toBe(2);

    manager.update(1, 'Implementar loign atualizado', 'low');
    expect(manager.tasks[0].title).toBe('Implementar loign atualizado');
    expect(manager.tasks[0].priority).toBe('low');

    manager.updateStatus(1, 'done');
    expect(manager.tasks[0].status).toBe('done');

    const filterTaskByCode = manager.filterByCode('PROJ-1');
    expect(filterTaskByCode.code).toBe('PROJ-1');

    const filterbyTitleResult = manager.filterByTitle('cadastro');
    expect(filterbyTitleResult.length).toBe(1);
    expect(filterbyTitleResult[0].title).toBe('Implementar cadastro');
  });

  // Teste de edge case
  test('deve lidar com operações em tarefas inexistentes', () => {
    const manager = new TaskManager();
    manager.create('Implementar login', 'Sistema de autenticação', 'high', 'PROJ');

    const updateResult = manager.update(2, 'Title', 'low');
    expect(updateResult.success).toBe(false);

    const removeResult = manager.removeById(2);
    expect(removeResult.success).toBe(false);

    const updateStatusResult = manager.updateStatus(2, 'done');
    expect(updateStatusResult.success).toBe(false);
  });
});