import joblib
from fastapi import FastAPI
from service import imagepredict
import numpy as np
from models.PhoneInput import PhoneInput
from fastapi.middleware.cors import CORSMiddleware
from service import transferLearning
from models.NLP import nlpIncidents

app = FastAPI()
model = joblib.load("./notebooks/naive_bayes_model.joblib")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # o ["*"] si estás en dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transferLearning.router, tags=["Predicts"])
app.include_router(nlpIncidents.router, tags=["nlpredict"])

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

app.include_router(imagepredict.router, tags=["Predicts"])

@app.post("/predict")
async def root(specs: PhoneInput):
    input_data = [[
        specs.battery_power,
        specs.blue,
        specs.clock_speed,
        specs.dual_sim,
        specs.fc,
        specs.four_g,
        specs.int_memory,
        specs.m_dep,
        specs.mobile_wt,
        specs.n_cores,
        specs.pc,
        specs.px_height,
        specs.px_width,
        specs.ram,
        specs.sc_h,
        specs.sc_w,
        specs.talk_time,
        specs.three_g,
        specs.touch_screen,
        specs.wifi
    ]]

    prediction = model.predict(input_data)

    if prediction == 0:
        return "Gama baja"
    elif prediction == 1:
        return "Gama media"
    elif prediction == 2:
        return "Gama media alta"
    else:
        return "Gama alta"


@app.post("/predict-rn")
def predict(data: dict[str, float]):
    X = np.array([[v for v in data.values()]])
    pred = model.predict(X)
    clase = int(np.argmax(pred))
    return {"clase": clase}
