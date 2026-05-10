function createNewId():string {
    const newId = crypto.randomUUID()
    return newId
}

export default createNewId