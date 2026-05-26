import express, { type Request, type Response } from "express"

const itemRouter = express.Router()

const testData = [
    { id: "1", name: "A" },
    { id: "2", name: "B" },
    { id: "3", name: "C" },
];

itemRouter.get("", (_request: Request, response: Response) => {
    response.json(testData);
});

itemRouter.get("/:id", (request: Request, response: Response) => {
    const id = request.params.id;

    const result = testData.find((item) => {
        return item.id === id;
    });

    if (!result) {
        return response.status(404).json({ error: "Item not found " });
    }
    response.status(200).json(result);
});

itemRouter.post("", (request: Request, response: Response) => {
    const name = request.body.name;
    if (typeof name !== "string") {
        return response.status(400).json({ error: "Name must be a string" });
    }

    if (name.trim() === "") {
        return response.status(400).json({ error: "Name cannot be empty" });
    }
    const newItem = {
        id: String(Date.now()),
        name: request.body.name,
    };
    testData.push(newItem);
    response.status(201).json(newItem);
});

itemRouter.delete("/:id", (request: Request, response: Response) => {
    const id = request.params.id;
    const itemIndex = testData.findIndex((item) => {
        return item.id === id;
    });

    if (itemIndex === -1) {
        return response.status(404).json({ error: "Item not found " });
    }
    const deletedItem = testData.splice(itemIndex, 1);
    response.json(deletedItem[0]);
});

itemRouter.patch("/:id",(request: Request, response: Response)=>{
    const id = request.params.id
     const itemToUpdate = testData.find((item) => {
        return item.id === id;
    });

    if (!itemToUpdate) {
        return response.status(404).json({ error: "Item not found " });
    }
    const name = request.body.name
     if (typeof name !== "string") {
        return response.status(400).json({ error: "Name must be a string" });
    }

    if (name.trim() === "") {
        return response.status(400).json({ error: "Name cannot be empty" });
    }

    itemToUpdate.name = name

    response.json(itemToUpdate)

})

export default itemRouter
