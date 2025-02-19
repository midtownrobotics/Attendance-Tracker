async function post(body) {
        console.log(body)

        const url = "/"
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