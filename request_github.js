
function requestUserRepos(){

    const xhr = new XMLHttpRequest();

    const url = 'https://api.github.com/users/gabrioliv/repos';

    xhr.open('GET', url, true);

    xhr.onload = function() {

        const data = JSON.parse(this.response);

        let root = document.getElementById('userRepos');

        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }

        let p = document.getElementById('userRepos');
        p.innerHTML = (`
            <code class="text-light font-monospace fs-5">
                <i class="bi bi-caret-right-fill">${data.length}</i>
            </code>
        `)

        console.log(p);

        let counter = 0;

        for (let i in data) {
            counter += 1;

            let language = "";

            data[i].language ? (language = `<p>Language: ${data[i].language}</p>`) : (language = "");

            let nav = document.createElement("nav");

            nav.classList.add("navbar", "navbar-dark", "text-start", "bg-dark")

            nav.innerHTML = (`
                <div class="container">
                    <button class="btn btn-dark" type="button" data-bs-toggle="collapse" data-bs-target="#navbarRepo${counter}" aria-controls="navbarHeader" aria-expanded="true" aria-label="Toggle navigation">
                        <i class="bi bi-list fs-5">
                            <code class="navbar-brand">${data[i].name}</code>
                        </i>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarRepo${counter}">
                        <ul class="navbar-nav">
                            <p></p>
                            <li class="nav-item">
                                <p><a class="text-info" href="${data[i].html_url}" target="_blank">Source Link</a></p>
                            </li>
                            <li class="nav-item text-light">
                                <p><b>Fork: </b><span>${data[i].fork ? "Yes" : "No"}</span></p>
                            </li>
                            <li class="nav-item text-light">
                                <p><b>Description:</b></p>
                                <p>${language}</p>
                                <p>${data[i].description}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            `);

            console.log(nav);

            p.appendChild(nav);
        }
    }

    xhr.send();
}

