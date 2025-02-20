async function post(body, admin = false) {
        console.log(body)

        const url = admin ? "/admin" : "/"

        return fetch(url, {
                method: "POST",
                credentials: 'same-origin',
                headers: {
                        'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
        }).then(res => res.json()).then(data => {
                return data.res
        });
}