import axios from "axios";

const httpClient = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("tokenUser"),
        }
    }
);

export default httpClient;