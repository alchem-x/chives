export async function getMetaData() {
    const response = await fetch('https://db.nano-exp.com/api/v2/tables/mi7rrfpfll7x8ao/records', {
        headers: {
            'xc-token': DB_TOKEN,
        }
    })
    return await response.json()
}