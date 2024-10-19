from fastapi import FastAPI, Path, HTTPException
from pydantic import BaseModel

app = FastAPI()

# idPath = Path(None, description="The ID", gt=0, le=1000)

inventory = {
    1: {
        "name": "Milk",
        "price": 3.4,
        "description": "Hello Milk",
        "is_offer": False
    },
}


class Item(BaseModel):
    name: str
    price: float
    description: str | None = None
    is_offer: bool | None = None


class UpdateItem(BaseModel):
    name: str | None = None
    price: float | None = None
    description: str | None = None
    is_offer: bool | None = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/all-items")
def get_all_items():
    return inventory


@app.get("/items/{item_id}")
def read_item(item_id=int, q: str | None = None):
    return inventory[int(item_id)]


@app.get("/get-by-name")
def get_item(name: str):
    for item_id in inventory:
        if inventory[item_id]["name"] == name:
            return inventory[item_id]
    raise HTTPException(404, detail="Not found!")


@app.post("/create-item/{item_id}")
def create_item(item_id: int, item: Item):
    if item_id not in inventory:
        # inventory[item_id] = {
        #     "name": item.name,
        #     "price": item.price,
        #     "description": item.description
        # }

        inventory[item_id] = item

        return item
    return {}


@app.put("/update-item/{item_id}")
def update_item(item_id: int, item: UpdateItem):
    if item_id not in inventory:
        return {"Error": "The item is not in inventory"}

    if item.name != None:
        inventory[item_id]["name"] = item.name

    if item.price != None:
        inventory[item_id]["price"] = item.price

    if item.description != None:
        inventory[item_id]["description"] = item.description

    if item.is_offer != None:
        inventory[item_id]["is_offer"] = item.is_offer

    return inventory[item_id]


@app.delete("/delete/{item_id}")
def delete_item(item_id: int):
    if item_id not in inventory:
        return {"Error": "404"}

    del inventory[item_id]
    return {"Success": "Item deleted!"}
