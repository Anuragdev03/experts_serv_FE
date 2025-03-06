import http from "../../../api/Client";

interface TaskParams {
    sort: string;
    page: number;
    priority?: string;
    status: string
}

interface UpdateParams {
    id: string | number;
    priority?: string;
    status?: string;
    due_date?: string;
    description?: string;
    title?: string;
}

interface CreateTask {
    priority: string;
    status: string;
    due_date: Date;
    description?: string;
    title: string
}

export async function getTasksList(params: TaskParams) {
    try {
        let url = `/tasks/list`

        if(params?.page) {
            url += `?page=${params.page}`
        }
        if(params?.sort) {
            url += `&sort=${params.sort}`
        }
        if(params?.status) {
            url += `&status=${params.status}`
        }
        if(params?.priority) {
            url += `&priority=${params.priority}`
        }

        const res = await http.get(url, {withCredentials: true});
        return res.data;

    } catch(err:any) {
        return err.response?.data?.message
    }
}

export async function updateTask(params: UpdateParams) {
    try {
        let url = `/tasks/update`;
        if(!params.id) {
            return "Id is required";
        }

        let body:any = { id: params.id };
        if(params.description) {
            body = {...body, description: params.description}
        }
        if(params?.priority) {
            body = {...body, priority: params.priority}
        }
        if(params?.status) {
            body = {...body, status: params.status}
        }
        if(params?.due_date) {
            body = {...body, due_date: params.due_date }
        }
        if(params?.title) {
            body = {...body, title: params.title}
        }

        const res = await http.patch(url, body, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err.response?.data?.message
    }
}

export async function createTask(params: CreateTask) {
    try {
        const res = await http.post("/tasks/create", params, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err.response?.data?.message;
    }
}

export async function deleteTask(id: string | number) {
    try {
        const res = await http.delete(`/tasks/delete/${id}`, {withCredentials: true})
        return res.data;
    } catch(err:any) {
        return err.response?.data?.message
    }
}