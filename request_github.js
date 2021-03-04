/* Code created with this Tutorial: */
/* https://codesnippet.io/github-api-tutorial/ */



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

        let ul = document.getElementById('userRepos');
        let p = document.createElement('p');
        p.innerHTML = (`
            <strong class="text-light font-monospace fs-5">
                <i class="bi bi-caret-right-fill"></i>
                Repositories: ${data.length}
            </strong></br></br>
        `)

        ul.appendChild(p);

        for (let i in data) {

            let li = document.createElement('p');

            li.innerHTML = (`
                <ul class="list-group list-group-horizontal bg-secondary">
                    <li class="list-group-item text-light bg-dark">
                        <i class="bi bi-check-square-fill"></i>
                        <strong>Repository: </strong>
                    </li>
                    <li class="list-group-item text-lowercase bg-light">
                        <a class="text-decoration-none" href="${data[i].html_url}">${data[i].name}</a>
                    </li>
                </ul>
                <li class="list-group-item bg-light shadow p-2 mb-3 rounded">
                    <strong>Description:</strong>
                    <p>${data[i].description}</p>
                    <p>Language: ${data[i].language}</p>
                </li>
            `);

            ul.appendChild(li);
        }
    }

    xhr.send();
}

