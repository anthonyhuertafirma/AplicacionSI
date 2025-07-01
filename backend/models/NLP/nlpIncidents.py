from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path
import torch

BASE_DIR = Path(__file__).resolve().parent

print(BASE_DIR)

# MODELO
tokenizer = AutoTokenizer.from_pretrained(BASE_DIR)
model = AutoModelForSequenceClassification.from_pretrained(BASE_DIR)
model.eval()

# MAPA DE CLASES
id2label = {
    0: 'ACCESOS',
    1: 'ALERTAS ORACLE',
    2: 'ARANDA',
    3: 'CELULARES',
    4: 'CONSULTAPP',
    5: 'CORREO OFFICE 365',
    6: 'CPU',
    7: 'CPU',
    8: 'CPU',
    9: 'CPU',
    10: 'SERVIDOR',
    11: 'DIMERC',
    12: 'EQUIPO DE COMUNICACIÓN',
    13: 'ESCANER DE DOCUMENTOS',
    14: 'EXTRANET QS',
    15: 'FLEJERA',
    16: 'GAVETA DE DINERO',
    17: 'IMPRESORA',
    18: 'IMPRESORA FLEJERA',
    19: 'IMPRESORAS TÉRMICAS',
    20: 'INCIDENTES DEL SISTEMA DE VENTAS',
    21: 'INTERNET',
    22: 'INTRANET',
    23: 'IRS',
    24: 'ISOTOOLS',
    25: 'KRONOS',
    26: 'LECTOR DE CODIGO DE BARRA',
    27: 'LECTOR DE HUELLA DIGITAL',
    28: 'LIBRO DE RECLAMOS',
    29: 'MENÚ PRINCIPAL',
    30: 'MICHECK',
    31: 'MONITOR',
    32: 'MOUSE',
    33: 'MYPALTIME',
    34: 'OFIMÁTICA',
    35: 'PAGINA DE ENCUESTAS',
    36: 'PDA',
    37: 'PINPAD',
    38: 'RACK DE COMUNICACIONES',
    39: 'RL',
    40: 'REPORTEADOR DE TRAMAS',
    41: 'RESOLUCIÓN DE DUDAS, CONSULTAS O PROCESOS DESCONOCIDOS POR EL LOCAL',
    42: 'SCANER DE DOCUMENTOS',
    43: 'SERVIDOR PRINCIPAL',
    44: 'TABLERO DE VENTAS',
    45: 'TECLADO',
    46: 'UPS',
    47: 'WECONNECT'
}


router = APIRouter()

class TextoEntrada(BaseModel):
    texto: str

@router.post("/predictnlp")
def predecir_categoria(entrada: TextoEntrada):
    inputs = tokenizer(entrada.texto, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        pred_id = torch.argmax(outputs.logits, dim=1).item()

    return {
        "texto": entrada.texto,
        "categoria_predicha": id2label.get(pred_id, f"label_{pred_id}")
    }
