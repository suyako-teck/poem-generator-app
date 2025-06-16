from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
import requests
import shutil
from datetime import datetime
import logging
import sys
import json
from fastapi.security import APIKeyHeader
from fastapi import Security

# ロギングの設定
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log')
    ]
)

logger = logging.getLogger(__name__)

# 環境変数の読み込み
load_dotenv()

app = FastAPI(title="ポエム生成API")

# アップロードディレクトリの作成
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 静的ファイルのマウント
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発中は全てのオリジンを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# リクエストログミドルウェア
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    logger.info(f"Headers: {dict(request.headers)}")
    
    try:
        body = await request.body()
        if body:
            logger.info(f"Request body: {body.decode()}")
    except Exception as e:
        logger.error(f"Error reading request body: {str(e)}")
    
    response = await call_next(request)
    
    # CORSヘッダーの追加
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

# Hugging Face APIの設定
HF_API_URL = "https://api-inference.huggingface.co/models/cyberagent/open-calm-7b"
HF_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

def generate_text(prompt: str) -> str:
    if not HF_API_KEY:
        raise HTTPException(status_code=500, detail="Hugging Face API is not configured")
    
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    
    # プロンプトの最適化
    system_prompt = "あなたは詩人です。以下の条件に基づいて、美しいポエムを生成してください。"
    full_prompt = f"{system_prompt}\n\n条件：{prompt}\n\nポエム："
    
    payload = {
        "inputs": full_prompt,
        "parameters": {
            "max_length": 120,
            "temperature": 0.8,
            "top_p": 0.95,
            "repetition_penalty": 1.2,
            "do_sample": True
        }
    }
    
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to generate text")
    
    return response.json()[0]["generated_text"]

class CharacterInfo(BaseModel):
    name: str
    work: str
    traits: str
    quotes: Optional[str] = None

class PoemRequest(BaseModel):
    source: str
    character_id: Optional[int] = None
    imageData: Optional[dict] = None
    characterData: Optional[CharacterInfo] = None

class PoemCustomizeRequest(BaseModel):
    poem_id: int
    content: str

class SNSShareRequest(BaseModel):
    poem_id: int
    platform: str  # "twitter", "facebook", "instagram"
    image_url: Optional[str] = None

api_key_header = APIKeyHeader(name="X-API-Key")

@app.get("/")
async def root():
    return {"message": "ポエム生成APIへようこそ"}

@app.post("/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    api_key: str = Security(api_key_header)
):
    # APIキーの検証
    if api_key != os.getenv("API_KEY"):
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )
    try:
        logger.info(f"Received file upload request: {file.filename}")
        # ファイルサイズの制限を設定
        if file.size > 5 * 1024 * 1024:  # 5MB制限
            raise HTTPException(status_code=400, detail="ファイルサイズが大きすぎます")
        
        # 許可するファイル形式を制限
        allowed_types = ["image/jpeg", "image/png", "image/gif"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="許可されていないファイル形式です")
        
        # ファイル名にタイムスタンプを追加して一意にする
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # ファイルを保存
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ファイルのURLを生成
        file_url = f"/uploads/{filename}"
        
        logger.info(f"File uploaded successfully: {file_url}")
        
        return {
            "filename": filename,
            "location": file_url
        }
    except Exception as e:
        logger.error(f"Error in upload_photo: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )

@app.post("/submit-character")
async def submit_character(character: CharacterInfo):
    try:
        logger.info(f"Received character submission: {character.dict()}")
        return {
            "message": "キャラクター情報が登録されました",
            "character": character
        }
    except Exception as e:
        logger.error(f"Error in submit_character: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"キャラクター情報の登録に失敗しました: {str(e)}"
        )

@app.post("/generate-poem")
async def generate_poem(request: PoemRequest):
    try:
        if request.source == "image":
            # 画像からの生成ロジック
            prompt = "画像から感じられる雰囲気や感情を表現した、叙情的なポエムを生成してください。"
        else:
            # キャラクター情報からの生成ロジック
            if request.characterData:
                prompt = f"以下のキャラクター情報を基に、その世界観を表現したポエムを生成してください。\n名前：{request.characterData.name}\n作品：{request.characterData.work}\n特徴：{request.characterData.traits}\nセリフ：{request.characterData.quotes if request.characterData.quotes else 'なし'}"
            else:
                prompt = "キャラクターの特徴を活かし、その世界観を表現したポエムを生成してください。"

        generated_text = generate_text(prompt)
        
        return {
            "message": "ポエムが生成されました",
            "poem": {
                "content": generated_text
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/customize-poem")
async def customize_poem(request: PoemCustomizeRequest):
    try:
        # ここでデータベースに保存する処理を実装
        return {
            "message": "ポエムが更新されました",
            "poem": {
                "id": request.poem_id,
                "content": request.content
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/share-on-sns")
async def share_on_sns(request: SNSShareRequest):
    try:
        # SNS連携の実装
        # 実際のSNS APIとの連携は、各プラットフォームのAPIキーが必要
        return {
            "message": f"{request.platform}への共有が完了しました",
            "share_url": f"https://{request.platform}.com/share/{request.poem_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="debug"
    ) 