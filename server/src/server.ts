import express from "express";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/", (_request: Request, response: Response) => {
    response.json("server is running");
});

app.get("/items",(_request:Request,response:Response
)=>{
    response.json(testData)
})

app.post("/items", (request: Request, response: Response)=>{
    const newItem = {
        id:Date.now(),
        name:request.body.name
    }
    testData.push(newItem)
    response.status(201).json(newItem)

})
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
});

const testData = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
];

