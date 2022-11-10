export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    updateDate: Date;
    uid: string;
}
