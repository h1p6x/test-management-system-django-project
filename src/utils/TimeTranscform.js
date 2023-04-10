export function transform(res) {
    for (let i = 0; i < res.results.length; i++) {
        (res.results[i].status === 'Open') ? res['results'][i]['status'] = 'Открыт' :
            res.results[i].status = 'Закрыт';
        const creationDate = res.results[i].creation_date;
        const modificationDate = res.results[i].modification_date;
        res.results[i].creation_date = new Date(creationDate).toLocaleString();
        res.results[i].modification_date = new Date(modificationDate).toLocaleString();
    }
    return res.results
}