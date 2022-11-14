import { Request, Response, Router } from 'express';
import { Task, User } from './interfaces';
import { v4 as uuid } from 'uuid';
import { userList, taskList } from './storage';

const routes = Router();

// rotas de usuarios
routes.get('/', (req: Request, res: Response) => {
    if (!userList.length) {
        return res.status(404).send({ message: 'Not Found' });
    }
    return res.status(200).json(userList);
});

//rota de cadastro
routes.post('/cadastro', (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(418).send({ type: 'Error', message: 'Dados em branco' });
    }

    const newUser: User = {
        id: uuid(),
        username,
        email,
        password,
    };

    userList.push(newUser);
    return res.status(200).send({ type: 'success', message: 'Usuário cadastrado com sucesso!' });
});

// rota de login
routes.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(418).send({ type: 'Error', message: 'Dados em branco' });
    }

    const findUser = userList.findIndex(
        (element) => element.email === email && element.password === password
    );

    if (findUser < 0) {
        return res.status(404).send({ type: 'Error', message: 'Usuário não encontrado' });
    }

    const userLogon = {
        id: userList[findUser].id,
        username: userList[findUser].username,
    };

    return res.status(200).json(userLogon);
});

// rotas de tasks
// rota de criação de task
routes.post('/task', (req: Request, res: Response) => {
    const { title, description, uid } = req.body;
    if (!title || !description || !uid) {
        return res.status(418).send({ type: 'Error', message: 'Dados em branco' });
    }

    const newTask: Task = {
        id: uuid(),
        title,
        description,
        createdDate: new Date(),
        updateDate: new Date(),
        uid,
    };

    taskList.push(newTask);
    return res.status(200).send({ type: 'success', message: 'Tarefa cadastrada com sucesso!' });
});
// todas as tasks
routes.get('/task', (req: Request, res: Response) => {
    if (!taskList.length) {
        return res.status(404).send({ message: 'Not Found' });
    }
    return res.status(200).json(taskList);
});

// tarefas do usuario logado
routes.get('/task/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const filterTasks = taskList.filter((task) => task.uid === id);

    if (!filterTasks.length) {
        return res.status(404).send({ message: 'task not Found' });
    }

    return res.status(200).json(filterTasks);
});

routes.put('/task/:taskId', (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    const achou = taskList.findIndex((task) => task.id === taskId);

    if (achou < 0) {
        return res.status(404).send({ message: 'task not Found' });
    }

    taskList[achou].title = title ? title : taskList[achou].title;
    taskList[achou].description = description ? description : taskList[achou].description;
    taskList[achou].updateDate = new Date();

    return res
        .status(200)
        .send({ modifiedTask: taskList[achou], message: 'Task successfully modified!' });
});

routes.delete('/task/:taskId', (req: Request, res: Response) => {
    const { taskId } = req.params;
    const find = taskList.findIndex((task) => task.id === taskId);
    if (find < 0) {
        return res.status(404).send({ message: 'task not Found' });
    }
    taskList.splice(find, 1);

    return res.status(200).send({ message: `Delete successfully ,task ${taskList[find].title}!` });
});

export default routes;
