const app = (function () {

    const baseUrl = "https://c1kk4owb5c.execute-api.us-east-1.amazonaws.com/twitterApi";

    function init() {
        document.getElementById("postform").addEventListener("submit", function (event) {
            event.preventDefault();
        });
        getPosts();
    }

    document.addEventListener("DOMContentLoaded", function () {
        validateAuthorized();
    });

    function initLogin() {
        document.getElementById("loginform").addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    function getPosts() {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            var posts = JSON.parse(this.responseText);
            loadPosts(posts.entity);
        };
        xhttp.open("GET", `${baseUrl}/streams`);
        xhttp.setRequestHeader("authorization", sessionStorage.getItem("token"));
        xhttp.send();
    }

    function createPost() {
        let content = document.getElementById("content").value;
        document.getElementById("content").value = "";
        let username = getUsername();
        fetch(`${baseUrl}/post`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": sessionStorage.getItem("token")
            },
            body: JSON.stringify({ username, content }),
        })
            .then((response) => response.json())
            .then((post) => {
                addPostToStream(post.entity);
            });
    }

    function getUsername() {
        const jwtToken = sessionStorage.getItem("token");
        const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
        console.log(decodedToken["cognito:username"]);
        return decodedToken["cognito:username"];
    }

    function validateAuthorized() {
        var accessToken = localStorage.getItem('token');
        if (!accessToken) {
            var accessToken = getTokenFromURL();
            console.log(accessToken)
            if (accessToken) {
                console.log("Un token fue encontrado en la URL");
                sessionStorage.setItem('token', accessToken);
            } else {
                window.location.href = "https://twitter-user-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=2u3hukfu5p2bb4mn81f6aqetg5&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmy-bucket-twitter.s3.amazonaws.com%2Fstream.html";
            }
        }
    }

    function getTokenFromURL() {
        var fragment = window.location.hash.substring(1);
        return fragment.split('&')[0].split('=')[1];
    }

    function login() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        fetch(`${baseUrl}/secured/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Login failed");
                }
                return response.json();
            })
            .then((data) => {
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("token", data.token);
                window.location.href = "stream.html";
            })
            .catch((error) => {
                alert(error);
            });
    }

    function logout() {
        sessionStorage.clear();
        window.location.href = "https://twitter-user-pool.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=2u3hukfu5p2bb4mn81f6aqetg5&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fmy-bucket-twitter.s3.amazonaws.com%2Fstream.html";
    }

    return {
        init: init,
        initLogin: initLogin,
        createPost: createPost,
        login: login,
        logout: logout
    }
})();
