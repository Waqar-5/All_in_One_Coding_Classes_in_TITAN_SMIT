// page 1

import axios from "axios";
//Axios React aur Express ke darmiyan messenger ka kaam karti hai

const API = axios.create({
    baseURL: "http://localhost:3000",
});

export default API;