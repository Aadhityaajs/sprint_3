import axios from "axios";

const BASE_URL = "http://localhost:8081/api/users/"


export const login = async (loginDeails) => {
    const data = {
        username: loginDeails.username,
        password: loginDeails.password
    }
    console.log(data);
    try {
        const response = await axios.post(BASE_URL + "login", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(response);
        return response;
    } catch (err) {

    }
}



export const signup = async (signUpDetails) => {
    const data = {
        username: signUpDetails.username,
        email: signUpDetails.email,
        phone: signUpDetails.phone,
        address: signUpDetails.address,
        password: signUpDetails.password,
        role: signUpDetails.role,
        securityQuestion: signUpDetails.securityQuestion,
        securityAnswer: signUpDetails.securityAnswer
    }
    try {
        console.log(data);
        const response = await axios.post(BASE_URL + "signup", data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    } catch (err) {
        console.error("Signup API error:", err);
        throw err;
    }
}